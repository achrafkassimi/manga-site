// src/components/common/ErrorBoundary.jsx
import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
  }

  handleRefresh = () => {
    // Reset the error boundary state
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-4x text-warning mb-4"></i>
            <h2 className="mb-3">Oups ! Une erreur s'est produite</h2>
            <p className="text-muted mb-4">
              Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
            </p>
            
            <Alert variant="danger" className="text-start mb-4">
              <Alert.Heading>
                <i className="fas fa-bug me-2"></i>
                Détails de l'erreur
              </Alert.Heading>
              <p className="mb-2">
                <strong>Erreur :</strong> {this.state.error && this.state.error.toString()}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-3">
                  <summary>Stack trace (développement)</summary>
                  <pre className="mt-2 small">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </Alert>

            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="primary" 
                onClick={this.handleRefresh}
                size="lg"
              >
                <i className="fas fa-redo me-2"></i>
                Actualiser la page
              </Button>
              
              <Button 
                variant="outline-secondary" 
                href="/"
                size="lg"
              >
                <i className="fas fa-home me-2"></i>
                Retour à l'accueil
              </Button>
            </div>

            <div className="mt-4 text-muted">
              <small>
                Si le problème persiste, veuillez{' '}
                <a href="/contact" className="text-decoration-none">
                  nous contacter
                </a>
              </small>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;