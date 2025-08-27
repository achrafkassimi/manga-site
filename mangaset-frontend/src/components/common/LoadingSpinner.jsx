// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const spinnerSize = size === 'sm' ? { width: '1rem', height: '1rem' } : 
                     size === 'lg' ? { width: '3rem', height: '3rem' } : {};

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        variant="primary" 
        style={spinnerSize}
      />
      {text && <p className="mt-2 text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;