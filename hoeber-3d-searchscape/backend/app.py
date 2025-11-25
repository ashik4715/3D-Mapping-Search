from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from process_logs import build_scene, ensure_parent, load_config, load_logs


BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.yaml"
DIST_PATH = BASE_DIR / "dist" / "scene.json"

DESCRIPTION = """
API gateway that bridges the search-log processing pipeline with the 3D frontend.
- `GET /api/scene` regenerates (optional) and returns the latest scene JSON.
- `GET /api/health` reports processor + dataset availability.
"""

app = FastAPI(
    title="Hoeber 3D Searchscape API",
    version="0.2.0",
    description=DESCRIPTION.strip(),
    contact={"name": "3D Mapping Search", "url": "https://github.com/"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def resolve_relative(path_str: str) -> Path:
    candidate = Path(path_str)
    if candidate.is_absolute():
        return candidate
    return (CONFIG_PATH.parent / candidate).resolve()


def generate_scene() -> Dict[str, Any]:
    cfg = load_config(CONFIG_PATH)
    csv_path = resolve_relative(cfg["input_csv"])
    output_path = resolve_relative(cfg["output_scene"])

    events = load_logs(csv_path)
    scene = build_scene(events, cfg)

    ensure_parent(output_path)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(scene, handle, indent=2)

    return scene


def read_cached_scene() -> Dict[str, Any]:
    if not DIST_PATH.exists():
        raise FileNotFoundError("Scene cache missing. Regenerate with refresh=true.")
    with DIST_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@app.get("/api/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "config": str(CONFIG_PATH),
        "datasetExists": (CONFIG_PATH.parent / "sample_logs" / "queries.csv").exists(),
        "lastSceneUpdated": datetime.fromtimestamp(DIST_PATH.stat().st_mtime).isoformat()
        if DIST_PATH.exists()
        else None,
    }


@app.get("/api/scene")
def scene(refresh: bool = Query(default=False, description="Regenerate scene from CSV before returning")) -> Dict[str, Any]:
    try:
        if refresh or not DIST_PATH.exists():
            return generate_scene()
        return read_cached_scene()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

