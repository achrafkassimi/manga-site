// src/pages/LoadingPage.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoadingPage = ({ message = "Chargement en cours..." }) => {
  return (
    <div className="loading-page d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <Container>
        <div className="text-center">
          <LoadingSpinner size="xl" text={message} />
          
          <div className="mt-4">
            <div className="loading-tips">
              <h6 className="text-muted">Le saviez-vous ?</h6>
              <p className="text-muted small">
                Vous pouvez utiliser les touches fléchées pour naviguer dans le lecteur de manga !
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoadingPage;