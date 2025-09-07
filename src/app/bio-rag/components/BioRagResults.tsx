"use client";

import React, { useState } from 'react';
import { QueryResponse } from '../types/bio-rag';

interface BioRagResultsProps {
  result: QueryResponse | null;
  className?: string;
}

export const BioRagResults: React.FC<BioRagResultsProps> = ({
  result,
  className = ""
}) => {
  const [showCitations, setShowCitations] = useState(false);

  if (!result) return null;

  return (
    <div className={`bio-rag-results ${className}`}>
      <div className="space-y-4">
        {/* Answer Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">Answer</h3>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-black leading-relaxed">{result.answer}</p>
          </div>
        </div>

        {/* Citations Section */}
        {result.citations && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-black">Citations</h4>
              <button
                onClick={() => setShowCitations(!showCitations)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-1"
              >
                <span>{showCitations ? 'Hide' : 'Show'} citations</span>
                <span className="text-xs">({result.citations.cited_sentences.length})</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showCitations ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showCitations && (
              <div className="space-y-4">
                {/* Cited Sentences */}
                {result.citations.cited_sentences.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-black mb-2">Cited Sentences:</h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.citations.cited_sentences.map((citation, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-3 rounded border">
                          <span className="font-mono text-blue-600 font-medium">[{citation.sentence_number}]</span>
                          <span className="ml-2 text-black">{citation.citation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source-level Citations */}
                {Object.keys(result.citations.source_level_citations).length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-black mb-2">Source-level Citations:</h5>
                    <div className="space-y-1 bg-gray-50 p-3 rounded">
                      {Object.entries(result.citations.source_level_citations).map(([source, sentences]) => (
                        <div key={source} className="text-sm">
                          <span className="font-medium text-black">{source}:</span>
                          <span className="ml-2 text-blue-600">[{sentences.join(', ')}]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Rate Limit Info */}
        {result.rate_limit_info && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ {result.rate_limit_info.message}
            </p>
          </div>
        )}

        {/* Sources Retrieved */}
        {result.sources_retrieved && (
          <div className="text-sm text-gray-500 border-t pt-3">
            Sources retrieved: {result.sources_retrieved}
          </div>
        )}
      </div>
    </div>
  );
}; 