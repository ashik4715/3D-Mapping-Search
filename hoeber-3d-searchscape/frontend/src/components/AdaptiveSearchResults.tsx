import { useMemo } from 'react';
import type { DistanceState } from './CameraTracker';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  fullDescription?: string;
}

interface Props {
  query: string;
  distanceState: DistanceState;
  results?: SearchResult[];
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'MediaPipe Face Detection Documentation',
    url: 'https://google.github.io/mediapipe/',
    snippet: 'MediaPipe offers cross-platform solutions for building applied machine learning pipelines.',
    fullDescription:
      'MediaPipe is a framework for building multimodal applied machine learning pipelines. It provides cross-platform solutions for live and streaming media, including face detection, hand tracking, pose estimation, and more. The framework is optimized for mobile devices, desktops, and edge devices.',
  },
  {
    id: '2',
    title: 'Web Camera API - MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia',
    snippet: 'The MediaDevices.getUserMedia() method prompts the user for permission to use a media input.',
    fullDescription:
      'The MediaDevices.getUserMedia() method prompts the user for permission to use a media input which produces a MediaStream with tracks containing the requested types of media. The returned promise resolves to a MediaStream object. If the user denies permission, or matching media is not available, the promise is rejected with NotAllowedError or NotFoundError respectively.',
  },
  {
    id: '3',
    title: 'Proximity-Based UI Design Patterns',
    url: 'https://www.interaction-design.org/',
    snippet: 'Explore how distance and proximity can inform interface design decisions.',
    fullDescription:
      'Proximity-based UI design leverages spatial relationships and user positioning to create more intuitive interfaces. By detecting user distance through sensors or cameras, interfaces can adapt their level of detail, showing overviews when far and detailed information when close. This pattern is particularly useful for large displays, kiosks, and immersive computing environments.',
  },
  {
    id: '4',
    title: 'Human-Computer Interaction Research',
    url: 'https://hci.stanford.edu/',
    snippet: 'Research on natural interaction methods including gesture and proximity sensing.',
    fullDescription:
      'The Stanford HCI Group explores novel interaction techniques that bridge physical and digital spaces. Their research includes gesture recognition, eye tracking, proximity sensing, and embodied interaction. These technologies enable more natural and intuitive ways for users to interact with computing systems.',
  },
  {
    id: '5',
    title: 'Adaptive Interfaces in Information Retrieval',
    url: 'https://www.sigir.org/',
    snippet: 'How search interfaces adapt to user context and behavior.',
    fullDescription:
      'Adaptive information retrieval systems modify their behavior based on user context, preferences, and interaction patterns. Proximity-based adaptation is an emerging area where search result presentation changes based on physical distance, enabling overview modes for distant viewing and detailed exploration for close-up interaction.',
  },
];

export function AdaptiveSearchResults({
  query,
  distanceState,
  results = MOCK_RESULTS,
}: Props) {
  const displayResults = useMemo(() => {
    const isClose = distanceState === 'close';
    const isFar = distanceState === 'far';

    if (isClose) {
      // Show all results with full descriptions
      return results;
    } else if (isFar) {
      // Show only top 3 results with minimal info
      return results.slice(0, 3);
    } else {
      // Medium: show top 5 with snippets
      return results.slice(0, 5);
    }
  }, [distanceState, results]);

  const getDetailLevel = () => {
    switch (distanceState) {
      case 'close':
        return 'detailed';
      case 'medium':
        return 'moderate';
      case 'far':
        return 'overview';
      default:
        return 'standard';
    }
  };

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Search Results for &quot;{query || 'proximity-based search'}&quot;</h2>
        <div className="detail-indicator">
          Mode: <strong>{getDetailLevel()}</strong> ({distanceState})
        </div>
      </div>
      <div className="results-list">
        {displayResults.map((result, idx) => (
          <div key={result.id} className="result-card">
            <div className="result-rank">{idx + 1}</div>
            <div className="result-content">
              <h3 className="result-title">
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </h3>
              <div className="result-url">{result.url}</div>
              {distanceState === 'close' && result.fullDescription ? (
                <p className="result-description">{result.fullDescription}</p>
              ) : (
                <p className="result-snippet">{result.snippet}</p>
              )}
              {distanceState === 'close' && (
                <div className="result-meta">
                  <span>Full context available</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {distanceState === 'far' && (
        <div className="results-hint">
          💡 Lean forward to see more results and detailed descriptions
        </div>
      )}
      {distanceState === 'close' && (
        <div className="results-hint">
          ✓ Detailed view active - all information displayed
        </div>
      )}
    </div>
  );
}

