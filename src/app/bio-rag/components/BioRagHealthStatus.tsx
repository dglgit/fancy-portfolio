"use client";

import React from 'react';
import { useBioRagHealth } from '../hooks/useBioRagHealth';

export const BioRagHealthStatus: React.FC = () => {
  const { health, loading, error } = useBioRagHealth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Checking API status...</span>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm">API unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm">
        API Healthy {health.database_loaded ? '(DB Loaded)' : '(DB Missing)'}
      </span>
    </div>
  );
}; 