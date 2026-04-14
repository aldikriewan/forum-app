import React from 'react';
import { useSelector } from 'react-redux';
import './LoadingIndicator.css';

function LoadingIndicator() {
  const { isLoading, loadingText } = useSelector((state) => state.ui);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner" />
        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
}

export default LoadingIndicator;
