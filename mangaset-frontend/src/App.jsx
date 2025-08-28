// src/App.jsx - Version mise à jour avec AuthPage
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context Providers
import { AuthProvider } from './context/AuthContext'

// Components pour test
import NavigationBar from './components/common/NavigationBar'
import Footer from './components/common/Footer'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'

// Pages temporaires pour test
import TestPage from './pages/TestPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App d-flex flex-column min-vh-100">
          <NavigationBar />
          
          <main className="flex-grow-1">
            <Routes>
              {/* Route principale - HomePage avec tous les composants */}
              <Route path="/" element={<HomePage />} />
              
              {/* Route d'authentification combinée */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              
              {/* Route de test pour composants individuels */}
              <Route path="/test" element={<TestPage />} />
              
              {/* Routes temporaires pour navigation */}
              <Route path="/manga/:slug" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-book fa-3x text-primary mb-3"></i>
                  <h2>Manga Details Page</h2>
                  <p className="text-muted">Cette page sera développée dans la suite du projet.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/search" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-search fa-3x text-info mb-3"></i>
                  <h2>Search Page</h2>
                  <p className="text-muted">Page de recherche en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/browse" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-compass fa-3x text-success mb-3"></i>
                  <h2>Browse Page</h2>
                  <p className="text-muted">Page de navigation en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/genres" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-tags fa-3x text-warning mb-3"></i>
                  <h2>All Genres</h2>
                  <p className="text-muted">Page de tous les genres en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/popular" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-fire fa-3x text-danger mb-3"></i>
                  <h2>Popular Manga</h2>
                  <p className="text-muted">Page des manga populaires en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/latest" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-clock fa-3x text-info mb-3"></i>
                  <h2>Latest Updates</h2>
                  <p className="text-muted">Page des dernières mises à jour en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/new" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-star fa-3x text-success mb-3"></i>
                  <h2>New Series</h2>
                  <p className="text-muted">Page des nouvelles séries en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/favorites" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-heart fa-3x text-danger mb-3"></i>
                  <h2>My Favorites</h2>
                  <p className="text-muted">Page des favoris en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/history" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-history fa-3x text-info mb-3"></i>
                  <h2>Reading History</h2>
                  <p className="text-muted">Page de l'historique en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              <Route path="/profile" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
                  <h2>User Profile</h2>
                  <p className="text-muted">Page de profil utilisateur en cours de développement.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Retour à l'accueil
                  </a>
                </div>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="container mt-5 text-center py-5">
                  <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                  <h1>404 - Page Not Found</h1>
                  <p className="text-muted">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Go Home
                  </a>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App