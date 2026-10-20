import React, { useState, useEffect } from 'react';
import { Nav } from './components/shared/Nav';
import { Hero } from './components/Hero/Hero';
import { Menu } from './components/Menu/Menu';
import { Story } from './components/Story/Story';
import { Location } from './components/Location/Location';
import { Footer } from './components/Footer/Footer';
import { Cart } from './components/Cart/Cart';
import { setSoundActive } from './utils/sound';

import { QRPage } from './components/QR/QRPage';

export const App: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const checkIsQR = () => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname;
    const h = window.location.hash;
    const s = window.location.search;
    return p === '/qr' || p.endsWith('/qr') || h === '#/qr' || s.includes('qr');
  };

  const [isQR, setIsQR] = useState(checkIsQR());

  useEffect(() => {
    const handleLocationChange = () => {
      setIsQR(checkIsQR());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      setSoundActive(next);
      return next;
    });
  };

  if (isQR) {
    return <QRPage />;
  }

  // Time shift overlay: changes warm daylight to warm evening on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (maxScroll || 1)));
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-root">
      {/* Dynamic warm ambiance overlay (siang ke malam) */}
      <div className="time-shift-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Nav onCartOpen={() => setCartOpen(true)} />

      {/* Sound toggle button */}
      <button
        className="sound-toggle-btn"
        onClick={toggleSound}
        aria-label={soundEnabled ? 'Matikan suara maskot' : 'Nyalakan suara maskot'}
        title={soundEnabled ? 'Suara aktif' : 'Suara nonaktif'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Main Sections */}
      <main id="main-content">
        <Hero
          onOrderClick={() => setCartOpen(true)}
          onMenuClick={() => {
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <Menu />
        <Story />
        <Location />
      </main>

      {/* Footer & Final CTA */}
      <Footer />

      {/* Cart Drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default App;
