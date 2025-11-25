# 3D-Mapping-Search

Prototype that fuses Orland Hoeber’s long-running 3D reconstruction research with a modern query-history intelligence workflow. Search logs are transformed by Python into a structured “scene graph,” then rendered as an explorable Three.js terrain so researchers can visually navigate the evolution of intent clusters over time.

## Repository structure

```
hoeber-3d-searchscape/
├── backend/                # Python log processor + sample data
├── frontend/               # Vite + React + Three.js experience
└── docs/
    └── hoeber-brief.md     # Pitch-ready summary for Dr. Hoeber
```

## Data flow in brief

1. `backend/sample_logs/queries.csv` contains structured search-history events (timestamp, topic, engagement metrics).
2. `backend/process_logs.py` (configurable via `backend/config.yaml`) normalizes timestamps, buckets engagement, and emits `backend/dist/scene.json`.
3. The generated scene JSON is copied or served to the frontend (`frontend/public/data/sample-hoeber.json`) where the Three.js renderer converts it into a 3D terrain plus query markers, colored by topic lanes.

## Backend: processing search logs

```bash
cd hoeber-3d-searchscape/backend
python -m venv .venv
# macOS/Linux: source .venv/bin/activate
# Windows (PowerShell): .\.venv\Scripts\Activate.ps1
# Windows (Git Bash/CMD): source .venv/Scripts/activate
pip install -r requirements.txt
python process_logs.py --config backend/config.yaml
# Output ➜ backend/dist/scene.json
```

Key files:

- `process_logs.py`: loads CSV data, derives engagement scores, builds smoothed bucketed terrain, and exports a scene graph the frontend understands.
- `config.yaml`: edit `input_csv`, `output_scene`, and visualization parameters (bucket size, lane spacing, terrain smoothing).
- `sample_logs/queries.csv`: seed dataset blending IR, HCI, and collaborative exploration queries from a single “lab day.”

## Backend API + Swagger UI

```bash
cd hoeber-3d-searchscape/backend
uvicorn app:app --reload --port 8000
# Open http://localhost:8000/docs for interactive Swagger
```

- `GET /api/scene?refresh=true` regenerates the JSON before returning it.
- `GET /api/health` confirms dataset/config status for quick diagnostics.

## Frontend: navigating the 3D landscape

```bash
cd hoeber-3d-searchscape/frontend
npm install
# optional: echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env.local
npm run dev   # open the provided URL to interact with the scene
```

Highlights:

- `SearchTerrainScene.tsx` wires Three.js + OrbitControls to render the terrain mesh, place query spheres, and handle hover picking.
- `App.tsx` lets you switch between preset “lenses,” filter by topic lane, and inspect metrics panels that explain why certain ridges dominate.
- Production build: `npm run build` (already verified during this iteration).

## Verification checklist

- [x] Ran `python backend/process_logs.py --config backend/config.yaml` to generate a fresh `scene.json`.
- [x] Copied the scene file into `frontend/public/data/sample-hoeber.json`.
- [x] Executed `npm run build` within `frontend/` to ensure the Three.js view compiles cleanly.

## Extending the concept

- Swap in real user logs by updating `config.yaml` to point at new CSV/JSON exports.
- Stream live data by exposing the Python processor as a FastAPI endpoint; the frontend already fetches via HTTP.
- Explore collaborative IR/HCI studies by adding annotations, co-presence indicators, or alternative terrain encodings (e.g., uncertainty ridges).

See `docs/hoeber-brief.md` for a narrative pitch to Professor Hoeber plus future research directions centered on information retrieval and human-centred computing.  
When you are ready to publish, remember to `git add .`, craft a descriptive commit (e.g., “Add 3D query-history prototype”), and `git push` to share the work.\*\*\*
