// // src/components/common/LoadingSpinner.jsx
// import React from 'react';
// import { Spinner } from 'react-bootstrap';

// const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
//   const spinnerSize = size === 'sm' ? { width: '1rem', height: '1rem' } : 
//                      size === 'lg' ? { width: '3rem', height: '3rem' } : {};

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center p-4">
//       <Spinner 
//         animation="border" 
//         variant="primary" 
//         style={spinnerSize}
//       />
//       {text && <p className="mt-2 text-muted">{text}</p>}
//     </div>
//   );
// };

// export default LoadingSpinner;

// src/components/common/LoadingSpinner.jsx - Version basique
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', variant = 'primary' }) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm':
        return { width: '1rem', height: '1rem' };
      case 'lg':
        return { width: '3rem', height: '3rem' };
      case 'xl':
        return { width: '4rem', height: '4rem' };
      case 'md':
      default:
        return { width: '2rem', height: '2rem' };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
      case 'xl':
        return '';
      case 'md':
      default:
        return '';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        variant={variant}
        style={getSpinnerSize()}
        role="status"
        aria-hidden="true"
      />
      {text && (
        <p className={`mt-2 text-muted ${getTextSize()} mb-0`}>
          {text}
        </p>
      )}
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

// Composant de loading pour sections complètes
export const SectionLoading = ({ title = 'Loading content...', height = '200px' }) => {
  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: height }}
    >
      <div className="text-center">
        <Spinner 
          animation="border" 
          variant="primary"
          style={{ width: '2.5rem', height: '2.5rem' }}
        />
        <p className="mt-3 text-muted mb-0">{title}</p>
      </div>
    </div>
  );
};

// Composant de loading inline
export const InlineLoading = ({ text = 'Loading...' }) => {
  return (
    <span className="d-inline-flex align-items-center">
      <Spinner 
        animation="border" 
        size="sm"
        variant="primary"
        className="me-2"
      />
      <small className="text-muted">{text}</small>
    </span>
  );
};

// Composant de loading overlay
export const LoadingOverlay = ({ show, text = 'Loading...' }) => {
  if (!show) return null;

  return (
    <div 
      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        zIndex: 1000,
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="text-center">
        <Spinner 
          animation="border" 
          variant="primary"
          style={{ width: '3rem', height: '3rem' }}
        />
        <p className="mt-2 text-dark fw-medium">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;