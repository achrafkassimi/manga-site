// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// // import React from 'react'
// // import ReactDOM from 'react-dom/client'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import '@fortawesome/fontawesome-free/css/all.min.css'
// import './styles/custom.css'
// import App from './App.jsx'


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/main.jsx - Point d'entrée pour Vite
import React from 'react'
import ReactDOM from 'react-dom/client'

// Imports CSS dans l'ordre correct
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './styles/custom.css'

// Import du composant principal
import App from './App.jsx'

// Configuration pour le mode développement
if (import.meta.env.MODE === 'development') {
  console.log('🚀 MangaSet Development Mode');
  console.log('📊 Environment Variables:');
  console.log('- API URL:', import.meta.env.VITE_API_URL);
  console.log('- Site Name:', import.meta.env.VITE_SITE_NAME);
  console.log('- Version:', import.meta.env.VITE_APP_VERSION);
}

// Création et rendu de l'application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)