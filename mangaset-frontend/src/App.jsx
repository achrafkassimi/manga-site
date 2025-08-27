import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

// // src/App.jsx
// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// // Context Providers
// import { AuthProvider } from './context/AuthContext'

// // Components
// import NavigationBar from './components/common/NavigationBar'
// import Footer from './components/common/Footer'

// // Pages
// import HomePage from './pages/HomePage'
// import MangaDetailsPage from './pages/MangaDetailsPage'
// import ReaderPage from './pages/ReaderPage'
// import SearchPage from './pages/SearchPage'
// import UserProfilePage from './pages/UserProfilePage'
// import LoginForm from './components/user/LoginForm'
// import RegisterForm from './components/user/RegisterForm'

// // Utility Components
// import ProtectedRoute from './components/common/ProtectedRoute'
// import ScrollToTop from './components/common/ScrollToTop'

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="App">
//           <ScrollToTop />
//           <NavigationBar />
          
//           <main style={{ minHeight: 'calc(100vh - 200px)' }}>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/manga/:slug" element={<MangaDetailsPage />} />
//               <Route path="/read/:slug/:chapterId" element={<ReaderPage />} />
//               <Route path="/search" element={<SearchPage />} />
//               <Route path="/browse" element={<SearchPage />} />
//               <Route path="/popular" element={<SearchPage />} />
//               <Route path="/latest" element={<SearchPage />} />
//               <Route path="/new" element={<SearchPage />} />
//               <Route path="/genre/:genre" element={<SearchPage />} />
              
//               {/* Auth Routes */}
//               <Route path="/login" element={<LoginForm />} />
//               <Route path="/register" element={<RegisterForm />} />
              
//               {/* Protected Routes */}
//               <Route path="/profile" element={
//                 <ProtectedRoute>
//                   <UserProfilePage />
//                 </ProtectedRoute>
//               } />
//               <Route path="/favorites" element={
//                 <ProtectedRoute>
//                   <UserProfilePage />
//                 </ProtectedRoute>
//               } />
//               <Route path="/history" element={
//                 <ProtectedRoute>
//                   <UserProfilePage />
//                 </ProtectedRoute>
//               } />
              
//               {/* 404 Route */}
//               <Route path="*" element={
//                 <div className="container mt-5 text-center">
//                   <h1>404 - Page Not Found</h1>
//                   <p>The page you're looking for doesn't exist.</p>
//                   <a href="/" className="btn btn-primary">Go Home</a>
//                 </div>
//               } />
//             </Routes>
//           </main>
          
//           <Footer />
          
//           {/* Toast Notifications */}
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       </AuthProvider>
//     </Router>
//   )
// }

// export default App