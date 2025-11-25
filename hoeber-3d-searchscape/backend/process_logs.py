"""Generate a 3D-ready scene for visualizing search history timelines."""
from __future__ import annotations

import argparse
import csv
import json
import math
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List

import yaml


@dataclass
class QueryEvent:
    timestamp: datetime
    query: str
    topic: str
    session_id: str
    clicks: int
    dwell_seconds: float
    result_count: int

    @classmethod
    def from_row(cls, row: Dict[str, str]) -> "QueryEvent":
        return cls(
            timestamp=datetime.fromisoformat(row["timestamp"]),
            query=row["query"].strip(),
            topic=row["intent_topic"].strip(),
            session_id=row["session_id"].strip(),
            clicks=int(row.get("clicks", 0) or 0),
            dwell_seconds=float(row.get("dwell_seconds", 0.0) or 0.0),
            result_count=int(row.get("result_count", 0) or 0),
        )


def load_config(path: Path) -> Dict:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def load_logs(csv_path: Path) -> List[QueryEvent]:
    with csv_path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return [QueryEvent.from_row(row) for row in reader]


def normalize(value: float, min_value: float, max_value: float) -> float:
    if math.isclose(max_value, min_value):
        return 0.5
    return (value - min_value) / (max_value - min_value)


def pseudo_embedding(label: str, dims: int = 3) -> List[float]:
    # Deterministic pseudo-vector derived from topic string for styling
    seed = sum(ord(ch) * (idx + 1) for idx, ch in enumerate(label))
    vec = []
    for i in range(dims):
        seed = (1103515245 * (seed + i) + 12345) & 0x7FFFFFFF
        vec.append(round((seed % 1000) / 1000.0, 3))
    return vec


def bucket_index(event: QueryEvent, start: datetime, bucket_minutes: int) -> int:
    delta = event.timestamp - start
    total_minutes = delta.total_seconds() / 60
    return int(total_minutes // bucket_minutes)


def build_scene(events: List[QueryEvent], cfg: Dict) -> Dict:
    if not events:
        raise ValueError("No events found in log")

    bucket_minutes = cfg["timeline"].get("bucket_minutes", 60)
    length_units = cfg["scene"].get("length_units", 120)
    topic_spread = cfg["scene"].get("topic_spread", 10)
    max_height = cfg["terrain"].get("max_height", 40)
    smoothing_window = max(1, int(cfg["terrain"].get("smoothing_window", 1)))

    events = sorted(events, key=lambda e: e.timestamp)
    start = events[0].timestamp
    end = events[-1].timestamp
    total_minutes = max((end - start).total_seconds() / 60, bucket_minutes)
    bucket_count = int(math.ceil(total_minutes / bucket_minutes))

    max_clicks = max(event.clicks for event in events) or 1
    max_dwell = max(event.dwell_seconds for event in events) or 1

    topic_index: Dict[str, int] = {}
    for event in events:
        if event.topic not in topic_index:
            topic_index[event.topic] = len(topic_index)

    # Engagement per query event
    query_payload = []
    for event in events:
        engagement = 0.4 * (event.clicks / max_clicks) + 0.6 * (event.dwell_seconds / max_dwell)
        x_ratio = (event.timestamp - start).total_seconds() / 60 / total_minutes
        x = round(x_ratio * length_units, 3)
        y = round(engagement * max_height, 3)
        z = round(topic_index[event.topic] * topic_spread, 3)
        query_payload.append(
            {
                "query": event.query,
                "topic": event.topic,
                "timestamp": event.timestamp.isoformat(),
                "sessionId": event.session_id,
                "metrics": {
                    "clicks": event.clicks,
                    "dwellSeconds": event.dwell_seconds,
                    "results": event.result_count,
                    "engagement": round(engagement, 3),
                },
                "position": [x, y, z],
                "embedding": pseudo_embedding(event.query),
            }
        )

    # Bucket aggregates for terrain profile
    bucket_heights = [0.0 for _ in range(bucket_count)]
    bucket_topics: List[Dict[str, float]] = [defaultdict(float) for _ in range(bucket_count)]
    for event in events:
        idx = min(bucket_count - 1, bucket_index(event, start, bucket_minutes))
        contribution = (event.clicks / max_clicks + event.dwell_seconds / max_dwell) / 2
        bucket_heights[idx] += contribution
        bucket_topics[idx][event.topic] += contribution

    bucket_heights = smooth(bucket_heights, smoothing_window)

    terrain_profile = []
    for i, height in enumerate(bucket_heights):
        x = round((i / max(bucket_count - 1, 1)) * length_units, 3)
        normalized_height = round(min(1.0, height / len(events)) * max_height, 3)
        top_topics = sorted(bucket_topics[i].items(), key=lambda x: x[1], reverse=True)[:3]
        terrain_profile.append(
            {
                "bucket": i,
                "x": x,
                "height": normalized_height,
                "topTopics": [topic for topic, _ in top_topics],
            }
        )

    scene = {
        "metadata": {
            "start": start.isoformat(),
            "end": end.isoformat(),
            "bucketMinutes": bucket_minutes,
            "topics": [
                {"topic": topic, "lane": idx, "embedding": pseudo_embedding(topic)}
                for topic, idx in topic_index.items()
            ],
        },
        "terrainProfile": terrain_profile,
        "queries": query_payload,
    }

    return scene


def smooth(values: List[float], window: int) -> List[float]:
    if window <= 1:
        return values
    half = window // 2
    smoothed = []
    for idx, _ in enumerate(values):
        start = max(0, idx - half)
        end = min(len(values), idx + half + 1)
        window_slice = values[start:end]
        smoothed.append(sum(window_slice) / len(window_slice))
    return smoothed


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Process search logs into a 3D scene JSON")
    parser.add_argument("--config", default="backend/config.yaml", help="Path to YAML config")
    args = parser.parse_args()

    config_path = Path(args.config).resolve()
    cfg = load_config(config_path)

    def resolve(path_str: str) -> Path:
        candidate = Path(path_str)
        if candidate.is_absolute():
            return candidate
        return (config_path.parent / candidate).resolve()

    csv_path = resolve(cfg["input_csv"])
    output_path = resolve(cfg["output_scene"])

    events = load_logs(csv_path)
    scene = build_scene(events, cfg)

    ensure_parent(output_path)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(scene, handle, indent=2)

    print(f"Processed {len(events)} events -> {output_path}")


if __name__ == "__main__":
    main()
