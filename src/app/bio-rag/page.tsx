"use client";

import { useState } from "react";
import Link from "next/link";
import { BioRagQueryForm } from "./components/BioRagQueryForm";
import { BioRagResults } from "./components/BioRagResults";
import { BioRagHealthStatus } from "./components/BioRagHealthStatus";
import { QueryResponse } from "./types/bio-rag";

export default function BioRagPage() {
  const [results, setResults] = useState<QueryResponse[]>([]);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  const handleNewResult = (result: QueryResponse) => {
    setResults(prev => [result, ...prev]);
    setExpandedResult(0); // Expand the newest result
  };

  const toggleResult = (index: number) => {
    setExpandedResult(expandedResult === index ? null : index);
  };

  const removeResult = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
    if (expandedResult === index) {
      setExpandedResult(null);
    } else if (expandedResult !== null && expandedResult > index) {
      setExpandedResult(expandedResult - 1);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl bg-gray-200 mx-auto px-4 rounded-lg">
        <div className="rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-black">
                🧬 Bio-RAG Question Answering
              </h1>
            </div>
            <BioRagHealthStatus />
          </div>
          
          <p className="text-black mb-6">
            Ask questions about biology using our multimodal RAG system. 
            Get answers with detailed citations from multiple textbooks.
          </p>

          <BioRagQueryForm onResult={handleNewResult} />
        </div>

        {/* Previous Results as Cards */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black">Previous Questions</h2>
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Question Header - Always Visible */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-black truncate">
                        {result.question}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleResult(index)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        {expandedResult === index ? 'Collapse' : 'Expand'}
                      </button>
                      <button
                        onClick={() => removeResult(index)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Answer Content - Collapsible */}
                {expandedResult === index && (
                  <div className="p-4">
                    <BioRagResults result={result} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
