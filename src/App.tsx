import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Apply from './pages/Apply';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Social from './pages/Social';
import { BottomNav } from './components/BottomNav';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper key={location.pathname}><Home /></PageWrapper>} />
        <Route path="/detail/:id" element={<PageWrapper key={location.pathname}><Detail /></PageWrapper>} />
        <Route path="/summon" element={<PageWrapper key={location.pathname}><Apply /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper key={location.pathname}><Profile /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper key={location.pathname}><Gallery /></PageWrapper>} />
        <Route path="/social" element={<PageWrapper key={location.pathname}><Social /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper key={location.pathname}><Home /></PageWrapper>} />
        <Route path="/apply" element={<PageWrapper key={location.pathname}><Apply /></PageWrapper>} />
        <Route path="/adopt" element={<PageWrapper key={location.pathname}><Apply /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode, key?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

import { UserProvider } from './lib/UserContext';

export default function App() {
  return (
    <Router>
      <UserProvider>
        <div className="max-w-md mx-auto bg-background min-h-screen relative shadow-2xl overflow-x-hidden">
          <AnimatedRoutes />
          <BottomNav />
        </div>
      </UserProvider>
    </Router>
  );
}
