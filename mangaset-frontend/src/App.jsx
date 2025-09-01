// src/App.jsx - Routeur principal complet avec toutes les fonctionnalités
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// Context Providers
import { AuthProvider } from './context/AuthContext'

// Layout Components
import NavigationBar from './components/common/NavigationBar'
import Footer from './components/common/Footer'
import ScrollToTop from './components/common/ScrollToTop'
import ProtectedRoute from './components/common/ProtectedRoute'

import UserDashboard from './components/user/UserProfilePage'
import LoginForm from './components/user/LoginForm'
import RegisterForm from './components/user/RegisterForm'
import UserProfile from './components/user/UserProfilePage'

// Main Pages
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import MangaDetailsPage from './pages/MangaDetailsPage'
import ReaderPage from './pages/ReaderPage'
import AuthPage from './pages/AuthPage'

import UserProfilePage from './components/user/UserProfilePage'

// Utility Pages
import TestPage from './pages/TestPage'
import NotFoundPage from './pages/NotFoundPage'
import LoadingPage from './pages/LoadingPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
// Error Boundary
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <ErrorBoundary> */}
          <div className="App d-flex flex-column min-vh-100">
            <ScrollToTop />
            <NavigationBar />
            <br />
            
            <main className="flex-grow-1">
              <Routes>
                {/* ===== MAIN PAGES ===== */}
                
                {/* Homepage */}
                <Route path="/" element={<HomePage />} />
                
                {/* Search & Browse */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/browse" element={<SearchPage />} />
                <Route path="/popular" element={<SearchPage />} />
                <Route path="/latest" element={<SearchPage />} />
                <Route path="/new" element={<SearchPage />} />
                <Route path="/completed" element={<SearchPage />} />
                <Route path="/ongoing" element={<SearchPage />} />
                
                {/* Genre-based searches */}
                <Route path="/genre/:genre" element={<SearchPage />} />
                <Route path="/genres" element={<SearchPage />} />
                
                {/* Manga & Reading */}
                <Route path="/manga/:slug" element={<MangaDetailsPage />} />
                <Route path="/read/:slug/:chapterId" element={<ReaderPage />} />
                {/* <Route path="/read/:mangaId/:chapterId" element={<ReaderPage />} />
                <Route path="/manga/:mangaSlug/:chapterNumber/" element={<ReaderPage />} /> */}
                
                {/* ===== AUTHENTICATION ===== */}
                
                {/* Auth pages */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/profile/:tab?" element={<UserProfilePage />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                
                {/* ===== USER PROTECTED ROUTES ===== */}
                
                {/* Profile & User Features */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/history" element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/reading-list" element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* ===== UTILITY ROUTES ===== */}
                
                {/* Testing & Development */}
                <Route path="/test" element={<TestPage />} />
                <Route path="/loading" element={<LoadingPage />} />
                
                {/* Static Pages */}
                <Route path="/about" element={<StaticPage page="about" />} />
                <Route path="/contact" element={<StaticPage page="contact" />} />
                <Route path="/faq" element={<StaticPage page="faq" />} />
                <Route path="/privacy" element={<StaticPage page="privacy" />} />
                <Route path="/terms" element={<StaticPage page="terms" />} />
                
                {/* ===== ERROR HANDLING ===== */}
                
                {/* 404 - Must be last */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <br />
            
            <Footer />
            
            {/* Global Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="custom-toast"
            />
          </div>
        {/* </ErrorBoundary> */}
      </AuthProvider>
    </Router>
  )
}

// Static Pages Component
const StaticPage = ({ page }) => {
  const pageContent = {
    about: {
      title: 'À propos de MangaSet',
      icon: 'fas fa-info-circle',
      content: (
        <>
          <p className="lead">
            MangaSet est votre destination ultime pour lire des manga en ligne gratuitement.
          </p>
          <p>
            Nous nous engageons à fournir la meilleure expérience de lecture possible avec :
          </p>
          <ul>
            <li>Une vaste collection de manga de tous genres</li>
            <li>Une interface moderne et responsive</li>
            <li>Un lecteur optimisé pour tous les appareils</li>
            <li>Des fonctionnalités avancées de suivi et de favoris</li>
          </ul>
        </>
      )
    },
    contact: {
      title: 'Contactez-nous',
      icon: 'fas fa-envelope',
      content: (
        <>
          <p>
            Vous avez une question, une suggestion ou un problème ? N'hésitez pas à nous contacter !
          </p>
          <div className="row">
            <div className="col-md-6">
              <h5><i className="fas fa-envelope me-2"></i>Email</h5>
              <p>support@mangaset.com</p>
              
              <h5><i className="fab fa-discord me-2"></i>Discord</h5>
              <p>Rejoignez notre serveur Discord pour obtenir de l'aide rapide</p>
            </div>
            <div className="col-md-6">
              <h5><i className="fab fa-twitter me-2"></i>Réseaux sociaux</h5>
              <p>Suivez-nous sur nos réseaux sociaux pour les dernières nouvelles</p>
              
              <h5><i className="fas fa-bug me-2"></i>Signaler un bug</h5>
              <p>Aidez-nous à améliorer MangaSet en signalant les problèmes</p>
            </div>
          </div>
        </>
      )
    },
    faq: {
      title: 'Questions Fréquentes',
      icon: 'fas fa-question-circle',
      content: (
        <>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Comment créer un compte ?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Cliquez sur "Connexion" dans la barre de navigation, puis sélectionnez l'onglet "Inscription".
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Comment ajouter un manga à mes favoris ?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Cliquez sur l'icône cœur sur la carte du manga ou sur la page de détails du manga.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Le site est-il gratuit ?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Oui, MangaSet est entièrement gratuit. Nous nous finançons par la publicité non-intrusive.
                </div>
              </div>
            </div>
          </div>
        </>
      )
    },
    privacy: {
      title: 'Politique de Confidentialité',
      icon: 'fas fa-shield-alt',
      content: (
        <>
          <p className="lead">
            Votre vie privée est importante pour nous.
          </p>
          
          <h5>Collecte des données</h5>
          <p>
            Nous collectons uniquement les données nécessaires au fonctionnement du service :
          </p>
          <ul>
            <li>Adresse email et nom d'utilisateur lors de l'inscription</li>
            <li>Historique de lecture pour améliorer votre expérience</li>
            <li>Préférences de lecture et favoris</li>
          </ul>
          
          <h5>Utilisation des données</h5>
          <p>
            Vos données sont utilisées pour :
          </p>
          <ul>
            <li>Fournir et améliorer nos services</li>
            <li>Personnaliser votre expérience</li>
            <li>Vous envoyer des notifications importantes</li>
          </ul>
          
          <h5>Protection des données</h5>
          <p>
            Nous utilisons des mesures de sécurité standard pour protéger vos données.
            Nous ne vendons jamais vos données personnelles à des tiers.
          </p>
        </>
      )
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      icon: 'fas fa-file-contract',
      content: (
        <>
          <p className="lead">
            En utilisant MangaSet, vous acceptez les conditions suivantes.
          </p>
          
          <h5>Utilisation du service</h5>
          <ul>
            <li>Vous devez avoir au moins 13 ans pour utiliser ce service</li>
            <li>Vous êtes responsable de maintenir la confidentialité de votre compte</li>
            <li>Vous acceptez d'utiliser le service de manière légale et éthique</li>
          </ul>
          
          <h5>Contenu</h5>
          <ul>
            <li>Le contenu est fourni à des fins de divertissement</li>
            <li>Nous nous efforçons de respecter les droits d'auteur</li>
            <li>Signalez tout contenu inapproprié</li>
          </ul>
          
          <h5>Modifications</h5>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment.
            Les modifications importantes seront communiquées aux utilisateurs.
          </p>
        </>
      )
    }
  };

  const content = pageContent[page];
  
  if (!content) {
    return <NotFoundPage />;
  }

  return (
    <div className="static-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <i className={`${content.icon} fa-3x text-primary mb-3`}></i>
              <h1>{content.title}</h1>
            </div>
            <div className="content">
              {content.content}
            </div>
            <div className="text-center mt-5">
              <a href="/" className="btn btn-primary">
                <i className="fas fa-home me-2"></i>
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App










// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import { AuthProvider } from './contexts/AuthContext';
// import { AuthProvider } from './context/AuthContext';
// import HomePage from './pages/HomePage';
// import MangaDetailsPage from './pages/MangaDetailsPage';
// import ReaderPage from './pages/ReaderPage';
// import SearchPage from './pages/SearchPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';

// function App() {
//     return (
//         <AuthProvider>
//             <Router>
//                 <div className="App">
//                     <Routes>
//                         <Route path="/" element={<HomePage />} />
//                         <Route path="/manga/:slug" element={<MangaDetailsPage />} />
//                         <Route path="/read/:mangaSlug/:chapterNumber" element={<ReaderPage />} />
//                         <Route path="/search" element={<SearchPage />} />
//                         <Route path="/login" element={<LoginPage />} />
//                         <Route path="/register" element={<RegisterPage />} />
//                         <Route path="/profile" element={<ProfilePage />} />
//                     </Routes>
//                 </div>
//             </Router>
//         </AuthProvider>
//     );
// }

// export default App;