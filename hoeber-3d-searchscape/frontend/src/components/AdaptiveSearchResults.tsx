import { useMemo, useState } from 'react';
import type { DistanceState } from './CameraTracker';
import { RESEARCH_PAPERS, type ResearchPaper } from '../data/researchPapers';

interface Props {
  query: string;
  distanceState: DistanceState;
}

export function AdaptiveSearchResults({ query, distanceState }: Props) {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

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
        return 'Detailed';
      case 'medium':
        return 'Moderate';
      case 'far':
        return 'Overview';
      default:
        return 'Standard';
    }
  };

  const getResultCountText = () => {
    const shown = displayResults.length;
    const total = filteredResults.length;
    return `Showing ${shown} of ${total} results`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {query ? `Results for "${query}"` : 'Research Papers'}
          </h2>
          <p className="text-sm text-gray-600">{getResultCountText()}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-xs font-medium text-gray-600">Mode:</span>
            <span className="text-sm font-semibold text-blue-700">{getDetailLevel()}</span>
            <span className="text-xs text-gray-500">({distanceState})</span>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {displayResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600">No results found for &quot;{query}&quot;</p>
            <p className="text-sm text-gray-500 mt-2">Try different keywords</p>
          </div>
        ) : (
          displayResults.map((paper, idx) => (
            <div
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {paper.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                    <span className="font-medium">{paper.authors.join(', ')}</span>
                    <span>•</span>
                    <span>{paper.venue} {paper.year}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span>📚</span>
                      <span>{paper.citations} citations</span>
                    </span>
                  </div>
                  {distanceState === 'close' ? (
                    <p className="text-gray-700 leading-relaxed mb-3">{paper.abstract}</p>
                  ) : (
                    <p className="text-gray-600 text-sm line-clamp-2">{paper.abstract}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {paper.keywords.slice(0, distanceState === 'close' ? 6 : 3).map((keyword, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {distanceState === 'close' && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Paper →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Hint */}
      {distanceState === 'far' && filteredResults.length > 10 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <span>💡</span>
            <span>Lean forward to see more results ({filteredResults.length - 10} more available)</span>
          </p>
        </div>
      )}
      {distanceState === 'close' && filteredResults.length > 50 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <span>✓</span>
            <span>Detailed view active - showing maximum results</span>
          </p>
        </div>
      )}

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPaper(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPaper(null)}
              className="float-right text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedPaper.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div>
                <span className="font-medium">Authors:</span> {selectedPaper.authors.join(', ')}
              </div>
              <div>
                <span className="font-medium">Venue:</span> {selectedPaper.venue} {selectedPaper.year}
              </div>
              <div>
                <span className="font-medium">Citations:</span> {selectedPaper.citations}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
              <p className="text-gray-700 leading-relaxed">{selectedPaper.abstract}</p>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPaper.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={selectedPaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Full Paper →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
