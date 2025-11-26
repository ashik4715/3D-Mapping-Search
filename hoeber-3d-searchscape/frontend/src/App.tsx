import { useCallback, useState } from "react";
import "./App.css";
import { AdaptiveSearchResults } from "./components/AdaptiveSearchResults";
import { CameraTracker, type DistanceState } from "./components/CameraTracker";

function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [distanceState, setDistanceState] = useState<DistanceState>("none");
  const [distance, setDistance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleDistanceChange = useCallback(
    (state: DistanceState, dist: number) => {
      setDistanceState(state);
      setDistance(dist);
    },
    []
  );

  const requestCameraPermission = async () => {
    try {
      setPermissionRequested(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Got permission, enable camera
      setCameraEnabled(true);
      // Stop the test stream immediately
      stream.getTracks().forEach((track) => track.stop());
    } catch (error: any) {
      console.error("Camera permission denied:", error);
      alert(
        "Camera access is required for this application. Please allow camera access and refresh the page."
      );
      setPermissionRequested(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // In a real app, this would trigger an API call
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Proximity-Based Adaptive Search</h1>
        <p className="subtitle">
          Lean forward for detailed results • Sit back for overview
        </p>
      </header>

      {!cameraEnabled && (
        <div className="permission-panel">
          <div className="permission-content">
            <div className="permission-icon">📹</div>
            <h2>Camera Access Required</h2>
            <p>
              This application uses your camera to detect your distance and
              adapt the search interface accordingly.
            </p>
            <ul className="permission-features">
              <li>
                ✅ When you lean forward: Detailed search results with full
                descriptions
              </li>
              <li>✅ When you sit back: Brief overview with key information</li>
              <li>✅ Real-time distance tracking</li>
            </ul>
            <button
              className="permission-button"
              onClick={requestCameraPermission}
              disabled={permissionRequested}
            >
              {permissionRequested
                ? "Requesting Permission..."
                : "Enable Camera Access"}
            </button>
            <p className="privacy-note">
              🔒 Your camera feed is processed locally and never leaves your
              device.
            </p>
          </div>
        </div>
      )}

      {cameraEnabled && (
        <div className="main-content">
          {/* Search Bar */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                className="search-input"
                 placeholder="Search 300 research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>

          {/* Camera and Results Side by Side */}
          <div className="camera-results-row">
            <div className="camera-section">
              <div className="camera-container">
                <CameraTracker
                  onDistanceChange={handleDistanceChange}
                  enabled={cameraEnabled}
                />
                <div className="distance-display">
                  <div className="distance-value">
                    {distance > 0
                      ? `${distance.toFixed(0)} cm`
                      : "No face detected"}
                  </div>
                  <div className="distance-state">
                    {distanceState.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

             <div className="results-section">
               <AdaptiveSearchResults
                 query={searchQuery}
                 distanceState={distanceState}
               />
             </div>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <button
              className="control-button"
              onClick={() => setCameraEnabled(false)}
            >
              Disable Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
