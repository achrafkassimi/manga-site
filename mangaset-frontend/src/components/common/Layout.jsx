// src/components/common/Layout.jsx
import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <NavigationBar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
