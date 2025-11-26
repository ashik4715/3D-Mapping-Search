import { useMemo } from 'react';
import type { DistanceState } from './CameraTracker';
import { RESEARCH_PAPERS } from '../data/researchPapers';

interface Props {
  query: string;
  distanceState: DistanceState;
}

export function AdaptiveSearchResults({ query, distanceState }: Props) {
  // Filter papers based on search query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return RESEARCH_PAPERS;
    }

    const lowerQuery = query.toLowerCase();
    return RESEARCH_PAPERS.filter(
      (paper) =>
        paper.title.toLowerCase().includes(lowerQuery) ||
        paper.abstract.toLowerCase().includes(lowerQuery) ||
        paper.authors.some((author) => author.toLowerCase().includes(lowerQuery)) ||
        paper.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)) ||
        paper.venue.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // Calculate result count based on distance
  const getResultCount = () => {
    switch (distanceState) {
      case 'close':
        return Math.min(50, filteredResults.length); // Show up to 50 when close
      case 'medium':
        return Math.min(20, filteredResults.length); // Show up to 20 at medium
      case 'far':
        return Math.min(10, filteredResults.length); // Show up to 10 when far
      default:
        return Math.min(15, filteredResults.length);
    }
  };

  const displayResults = useMemo(() => {
    const count = getResultCount();
    return filteredResults.slice(0, count);
  }, [filteredResults, distanceState]);

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

  const getResultCountText = () => {
    const shown = displayResults.length;
    const total = filteredResults.length;
    return `Showing ${shown} of ${total} results`;
  };

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>Search Results for &quot;{query || 'all research papers'}&quot;</h2>
        <div className="detail-indicator">
          Mode: <strong>{getDetailLevel()}</strong> ({distanceState})
        </div>
      </div>
      <p className="results-count">{getResultCountText()}</p>
      
      <div className="results-list">
        {displayResults.length === 0 ? (
          <div className="no-results">
            <p>No results found for &quot;{query}&quot;</p>
            <p>Try different keywords</p>
          </div>
        ) : (
          displayResults.map((paper, idx) => (
            <div key={paper.id} className="result-card">
              <div className="result-rank">{idx + 1}</div>
              <div className="result-content">
                <h3 className="result-title">
                  <a href={paper.url} target="_blank" rel="noopener noreferrer">
                    {paper.title}
                  </a>
                </h3>
                <div className="result-meta-info">
                  <span className="result-authors">{paper.authors.join(', ')}</span>
                  <span className="result-venue">{paper.venue} {paper.year}</span>
                  <span className="result-citations">📚 {paper.citations} citations</span>
                </div>
                {distanceState === 'close' ? (
                  <p className="result-description">{paper.abstract}</p>
                ) : (
                  <p className="result-snippet">{paper.abstract.substring(0, 200)}...</p>
                )}
                <div className="result-keywords">
                  {paper.keywords.slice(0, distanceState === 'close' ? 6 : 3).map((keyword, i) => (
                    <span key={i} className="keyword-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
                {distanceState === 'close' && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-link"
                  >
                    View Paper →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {distanceState === 'far' && filteredResults.length > 10 && (
        <div className="results-hint">
          💡 Lean forward to see more results ({filteredResults.length - 10} more available)
        </div>
      )}
      {distanceState === 'close' && filteredResults.length > 50 && (
        <div className="results-hint">
          ✓ Detailed view active - showing maximum results
        </div>
      )}
    </div>
  );
}
