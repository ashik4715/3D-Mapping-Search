import { useState, useCallback } from 'react';
import { CameraTracker, type DistanceState } from './components/CameraTracker';
import { AdaptiveSearchResults } from './components/AdaptiveSearchResults';

function App() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [distanceState, setDistanceState] = useState<DistanceState>('none');
  const [distance, setDistance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleDistanceChange = useCallback((state: DistanceState, dist: number) => {
    setDistanceState(state);
    setDistance(dist);
  }, []);

  const requestCameraPermission = async () => {
    try {
      setPermissionRequested(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error: any) {
      console.error('Camera permission denied:', error);
      alert(
        'Camera access is required for this application. Please allow camera access and refresh the page.'
      );
      setPermissionRequested(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#ebe3ca]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proximity-Based Adaptive Search</h1>
              <p className="text-sm text-gray-600 mt-1">
                Lean forward for detailed results • Sit back for overview
              </p>
            </div>
            {!cameraEnabled && (
              <button
                onClick={requestCameraPermission}
                disabled={permissionRequested}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {permissionRequested ? 'Requesting...' : 'Enable Camera'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Permission Panel */}
      {!cameraEnabled && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📹</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Camera Access Required</h2>
              <p className="text-gray-600 text-lg">
                This application uses your camera to detect your distance and adapt the search interface accordingly.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-700">
                    <strong>Lean forward</strong> to see detailed search results with full descriptions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-700">
                    <strong>Sit back</strong> to see a brief overview with key information
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-700">
                    Real-time distance tracking with visual feedback
                  </span>
                </li>
              </ul>
            </div>
            <button
              onClick={requestCameraPermission}
              disabled={permissionRequested}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {permissionRequested ? 'Requesting Permission...' : 'Enable Camera Access'}
            </button>
            <p className="text-center mt-6 text-sm text-gray-500">
              🔒 Your camera feed is processed locally and never leaves your device
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      {cameraEnabled && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  placeholder="Search 200 research papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
            {/* Left Column - Camera */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Camera Tracking</h2>
                <button
                  onClick={() => setCameraEnabled(false)}
                  className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Disable
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                <CameraTracker
                  onDistanceChange={handleDistanceChange}
                  enabled={cameraEnabled}
                />
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {distance > 0 ? `${distance.toFixed(0)} cm` : '---'}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {distanceState !== 'none' ? distanceState : 'No Detection'}
                  </div>
                  <div className="mt-3 flex justify-center gap-2">
                    {distanceState === 'far' && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Overview Mode
                      </span>
                    )}
                    {distanceState === 'medium' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        Moderate Mode
                      </span>
                    )}
                    {distanceState === 'close' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Detailed Mode
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Search Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
              <AdaptiveSearchResults query={searchQuery} distanceState={distanceState} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
