"use client";

import React, { useState } from 'react';
import { useBioRag } from '../hooks/useBioRag';
import { QueryResponse } from '../types/bio-rag';

interface BioRagQueryFormProps {
  onResult?: (result: QueryResponse) => void;
  placeholder?: string;
  className?: string;
}

export const BioRagQueryForm: React.FC<BioRagQueryFormProps> = ({
  onResult,
  placeholder = "Ask a question about biology...",
  className = ""
}) => {
  const [question, setQuestion] = useState('');
  const { query, loading, error } = useBioRag();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    try {
      const result = await query(question);
      onResult?.(result);
      setQuestion(''); // Clear input after successful submission
    } catch (err) {
      console.error('Query failed:', err);
    }
  };

  return (
    <div className={`bio-rag-form ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 text-black rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-2 bg-blue-600 text-black rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Querying...' : 'Ask Question'}
          </button>
          
          {question.trim() && (
            <button
              type="button"
              onClick={() => setQuestion('')}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}; 