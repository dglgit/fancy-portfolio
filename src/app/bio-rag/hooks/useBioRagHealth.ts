"use client";

import { useState, useEffect } from 'react';
import { HealthResponse } from '../types/bio-rag';

const API_BASE = process.env.NEXT_PUBLIC_BIO_RAG_API_URL || 'https://transstellar-interweavingly-karisa.ngrok-free.app';

export const useBioRagHealth = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`, {
          headers: {
            'ngrok-skip-browser-warning': 'yeet', // The value can be anything.
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
        } else {
          setError('Health check failed');
        }
      } catch {
        setError('Unable to connect to API');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return { health, loading, error };
}; 