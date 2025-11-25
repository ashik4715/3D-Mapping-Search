import { useEffect, useMemo, useState } from 'react';
import SearchTerrainScene from './components/SearchTerrainScene';
import type { QueryNode, SceneData } from './types/scene';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

type ScenePreset = {
  id: string;
  label: string;
  path: string;
  summary: string;
  focus: string;
};

const DATASETS: ScenePreset[] = [
  {
    id: 'backend-live',
    label: 'Live backend (FastAPI)',
    path: `${API_BASE_URL}/scene?refresh=false`,
    summary:
      'Hits the FastAPI endpoint so you can regenerate or inspect data through Swagger.',
    focus: 'Pair with http://localhost:8000/docs to explore schemas and refresh toggles.',
  },
  {
    id: 'sensemaking-day',
    label: 'IR × HCI Lab Day (Nov 05)',
    path: '/data/sample-hoeber.json',
    summary:
      'Captures a single-day sprint where retrieval scientists alternated between IR feature probes and HCI instrumentation ideas.',
    focus: 'Highlights rhythmic transitions between theoretical IR work and embodied interaction probes.',
  },
  {
    id: 'collab-storyboard',
    label: 'Collaborative Storyboarding (What-if)',
    path: '/data/sample-hoeber.json',
    summary:
      'Replays the same timeline but spotlights collaboration-heavy sequences to illustrate future shared sensemaking views.',
    focus: 'Emphasizes group touchpoints and opportunities for query trails to become shared artifacts.',
  },
];

function App() {
  const [presetId, setPresetId] = useState(DATASETS[0].id);
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState('all');
  const [hoveredQuery, setHoveredQuery] = useState<QueryNode | null>(null);

  const preset = useMemo(
    () => DATASETS.find((p) => p.id === presetId) ?? DATASETS[0],
    [presetId],
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setTopicFilter('all');
    setHoveredQuery(null);

    fetch(preset.path)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: SceneData) => {
        if (!isMounted) return;
        setSceneData(data);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setError('Unable to load dataset. Please try again.');
        setSceneData(null);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [preset]);

  const topicOptions = sceneData?.metadata.topics ?? [];
  const highlightTopic = topicFilter === 'all' ? undefined : topicFilter;

  const summaryMetrics = useMemo(() => {
    if (!sceneData) {
      return null;
    }
    const totalQueries = sceneData.queries.length;
    const avgEngagement =
      sceneData.queries.reduce((acc, q) => acc + q.metrics.engagement, 0) /
      Math.max(1, totalQueries);
    const topTopics = topicOptions
      .map((topic) => ({
        topic: topic.topic,
        count: sceneData.queries.filter((q) => q.topic === topic.topic).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 2);

    return {
      totalQueries,
      avgEngagement: avgEngagement.toFixed(2),
      topTopics,
    };
  }, [sceneData, topicOptions]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Prototype</p>
          <h1>3D Mapping of Search Timelines</h1>
          <p className="tagline">
            Connecting Dr. Hoeber&apos;s 3D reconstruction vision with interactive retrieval
            history analysis.
          </p>
        </div>
        <div className="header-meta">
          <span>Python log processor → Three.js map</span>
          <span>Explorable search intent landscape</span>
        </div>
      </header>

      <section className="controls-panel">
        <div className="control-field">
          <label htmlFor="dataset">Dataset lens</label>
          <select
            id="dataset"
            value={presetId}
            onChange={(event) => setPresetId(event.target.value)}
          >
            {DATASETS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-field">
          <label htmlFor="topic-filter">Highlight topic lane</label>
          <select
            id="topic-filter"
            value={topicFilter}
            onChange={(event) => setTopicFilter(event.target.value)}
            disabled={!sceneData}
          >
            <option value="all">All clusters</option>
            {topicOptions.map((option) => (
              <option key={option.topic} value={option.topic}>
                {option.topic}
              </option>
            ))}
          </select>
        </div>
        <p className="dataset-summary">
          {sceneData ? preset.summary : 'Loading dataset...'}
          <br />
          <span className="focus">{preset.focus}</span>
        </p>
      </section>

      <main className="content-grid">
        <div className="scene-panel">
          {loading && <div className="loading-state">Loading 3D scene…</div>}
          {error && <div className="error-state">{error}</div>}
          {!loading && !error && (
            <SearchTerrainScene
              data={sceneData ?? undefined}
              highlightTopic={highlightTopic}
              onHover={setHoveredQuery}
            />
          )}
        </div>
        <aside className="insight-panel">
          <section className="metric-row">
            <div>
              <p className="metric-label">Total queries</p>
              <p className="metric-value">{summaryMetrics?.totalQueries ?? '–'}</p>
            </div>
            <div>
              <p className="metric-label">Avg engagement</p>
              <p className="metric-value">{summaryMetrics?.avgEngagement ?? '–'}</p>
            </div>
          </section>
          <section className="topic-highlights">
            <h2>Dominant topic ridges</h2>
            {summaryMetrics?.topTopics?.length ? (
              summaryMetrics.topTopics.map((topic) => (
                <div key={topic.topic} className="topic-chip">
                  <strong>{topic.topic}</strong>
                  <span>{topic.count} queries</span>
                </div>
              ))
            ) : (
              <p>Awaiting data…</p>
            )}
          </section>
          <section className="hover-card">
            <h2>Hover focus</h2>
            {hoveredQuery ? (
              <div>
                <p className="hover-query">“{hoveredQuery.query}”</p>
                <p className="hover-meta">
                  {hoveredQuery.topic} • {new Date(hoveredQuery.timestamp).toLocaleTimeString()}
                </p>
                <div className="hover-metrics">
                  <span>{hoveredQuery.metrics.clicks} clicks</span>
                  <span>{hoveredQuery.metrics.dwellSeconds}s dwell</span>
                  <span>{hoveredQuery.metrics.results} results</span>
                </div>
              </div>
            ) : (
              <p>Hover a node to surface micro-intent context.</p>
            )}
          </section>
          <section className="future-notes">
            <h2>Next exploration steps</h2>
            <ul>
              <li>Blend session similarity to morph terrain in real time.</li>
              <li>Anchor annotations for collaborative sensemaking.</li>
              <li>Pipe live query logs to watch the ridge evolve.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
