import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../../hooks/useCart';

interface NavProps {
  onCartOpen: () => void;
}

export const Nav: React.FC<NavProps> = ({ onCartOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen for cart add events to refresh count
  useEffect(() => {
    const handler = () => {};
    window.addEventListener('jaliteng:cart', handler);
    return () => window.removeEventListener('jaliteng:cart', handler);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Navigasi utama">
      <a href="#hero" className="nav-logo" aria-label="Jaliteng - kembali ke atas">
        Jali<span>teng</span>
      </a>

      <div className="nav-actions">
        <a
          href="#menu"
          className="nav-link"
          onClick={e => { e.preventDefault(); scrollTo('menu'); }}
          aria-label="Lihat menu"
        >
          Menu
        </a>
        <a
          href="#lokasi"
          className="nav-link"
          onClick={e => { e.preventDefault(); scrollTo('lokasi'); }}
          aria-label="Lokasi dan jam buka"
        >
          Lokasi
        </a>

        <button
          className="cart-fab"
          onClick={onCartOpen}
          aria-label={`Keranjang pesanan, ${totalItems} item`}
          id="cart-toggle-btn"
        >
          <CartIcon />
          <span>Pesanan</span>
          {totalItems > 0 && (
            <span className="cart-count" aria-label={`${totalItems} item di keranjang`}>
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);

export default Nav;
