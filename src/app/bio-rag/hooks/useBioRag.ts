"use client";

import { useState, useCallback } from 'react';
import { QueryResponse, QueryState, ApiError } from '../types/bio-rag';

//const API_BASE = process.env.NEXT_PUBLIC_BIO_RAG_API_URL || 'https://transstellar-interweavingly-karisa.ngrok-free.app';
const API_BASE = process.env.NEXT_PUBLIC_BIO_RAG_API_URL || 'https://bio-rag-api.icycoast-547e95ed.westus2.azurecontainerapps.io/';
export const useBioRag = () => {
  const [state, setState] = useState<QueryState>({
    loading: false,
    error: null,
    data: null
  });

  const query = useCallback(async (question: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'ngrok-skip-browser-warning': 'yeet'},
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.detail || 'API request failed');
      }

      const data: QueryResponse = await response.json();
      setState({ loading: false, error: null, data });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    query,
    reset
  };
}; 