import React, { useEffect, useRef, useState, useCallback } from 'react';
import { business, HERO_HAS_BAKED_MASCOT, whatsappVerified } from '../../content.config';
import { isOpen, isSaveData, hasWebGL, trackEvent } from '../../utils/helpers';
import { initDepthShader, type DepthShaderController } from '../../utils/depthShader';
import { getAssetUrl } from '../../utils/asset';
import { Mascot } from '../Mascot/Mascot';
import './Hero.css';

interface HeroProps {
  onOrderClick: () => void;
  onMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onMenuClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthCtrlRef = useRef<DepthShaderController | null>(null);

  const [openStatus, setOpenStatus] = useState(isOpen());
  const [videoReady, setVideoReady] = useState(false);
  const [useVideo, setUseVideo] = useState(false);
  const [depthActive, setDepthActive] = useState(false);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Decide if video should be loaded
  useEffect(() => {
    if (!reducedMotion && !isSaveData()) {
      setUseVideo(true);
    }
  }, [reducedMotion]);

  // Update open status every minute
  useEffect(() => {
    const t = setInterval(() => setOpenStatus(isOpen()), 60000);
    return () => clearInterval(t);
  }, []);

  // Parallax tracking (mouse, scroll, device tilt)
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let targetY = 0;

    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      const factor = scrollY * 0.25;
      el.style.setProperty('--parallax-y', `${factor}px`);
      targetY = (scrollY / (window.innerHeight || 1)) * 0.5;
      depthCtrlRef.current?.setOffset(targetX, targetY);
    };

    const onMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const normX = (e.clientX - cx) / cx;
      const normY = (e.clientY - cy) / cy;
      targetX = normX;
      targetY = normY;

      const el = heroRef.current;
      if (el) {
        el.style.setProperty('--mouse-x', `${normX * 14}px`);
        el.style.setProperty('--mouse-y', `${normY * 10}px`);
      }

      depthCtrlRef.current?.setOffset(targetX, targetY);
    };

    const onDeviceMotion = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const normX = Math.max(-1, Math.min(1, e.gamma / 25));
        const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        targetX = normX;
        targetY = normY;

        const el = heroRef.current;
        if (el) {
          el.style.setProperty('--mouse-x', `${normX * 12}px`);
          el.style.setProperty('--mouse-y', `${normY * 8}px`);
        }

        depthCtrlRef.current?.setOffset(targetX, targetY);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('deviceorientation', onDeviceMotion, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onDeviceMotion);
    };
  }, [reducedMotion]);

  // Lazy WebGL Depth Parallax initialization AFTER first paint
  const initWebGLDepth = useCallback(() => {
    if (reducedMotion || isSaveData() || !hasWebGL()) return;
    const canvas = canvasRef.current;
    const poster = posterRef.current;
    if (!canvas || !poster) return;

    // Cap DPR at 1.5 to save mobile GPU memory
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr) || 1280;
    canvas.height = Math.floor(rect.height * dpr) || 720;

    const source = (videoReady && videoRef.current) ? videoRef.current : poster;

    const ctrl = initDepthShader(
      canvas,
      source,
      getAssetUrl('assets/depth/scene-hero-depth.jpg'),
      () => {
        setDepthActive(true);
      },
      () => {
        // Silently skip if depth map missing or WebGL fails
        setDepthActive(false);
      }
    );

    if (ctrl) {
      depthCtrlRef.current = ctrl;
    }
  }, [reducedMotion, videoReady]);

  useEffect(() => {
    // Delay initialization until after first paint
    const timer = setTimeout(() => {
      initWebGLDepth();
    }, 350);

    return () => {
      clearTimeout(timer);
      depthCtrlRef.current?.destroy();
      depthCtrlRef.current = null;
    };
  }, [initWebGLDepth]);

  const handleVideoLoaded = () => {
    setVideoReady(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {/* autoplay policy */});
    }
  };

  const handleWAClick = () => {
    trackEvent('whatsapp_hero_click');
    onOrderClick();
  };

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    onMenuClick();
  };

  return (
    <section
      id="hero"
      className="hero"
      ref={heroRef}
      style={{
        '--parallax-y': '0px',
        '--mouse-x': '0px',
        '--mouse-y': '0px',
      } as React.CSSProperties}
      aria-label="Selamat datang di Jaliteng"
    >
      {/* Background media & Depth Canvas */}
      <div className="hero-media" aria-hidden="true">
        {/* Hidden/base image for texture sampling and fallback */}
        <img
          ref={posterRef}
          className={`hero-poster ${depthActive ? 'hidden-under-depth' : ''}`}
          src={getAssetUrl('assets/hero-poster.jpg')}
          alt=""
          loading="eager"
          decoding="async"
          aria-hidden="true"
        />

        {/* Video loop if enabled & supported */}
        {useVideo && (
          <video
            ref={videoRef}
            className={`hero-video ${videoReady && !depthActive ? 'ready' : ''}`}
            poster={getAssetUrl('assets/hero-poster.jpg')}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            onLoadedData={handleVideoLoaded}
            aria-hidden="true"
          >
            <source src={getAssetUrl('assets/hero-loop.mp4')} type="video/mp4" />
          </video>
        )}

        {/* WebGL Depth Canvas */}
        <canvas
          ref={canvasRef}
          className={`hero-depth-canvas ${depthActive ? 'active' : ''}`}
          aria-hidden="true"
        />

        {/* Overlay gradient - warm evening effect with high contrast for text */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Hanging bulbs glowing ambiance */}
        <div className="hero-bulbs" aria-hidden="true">
          <div className="bulb" style={{ left: '52%', top: '18%' }} />
          <div className="bulb" style={{ left: '62%', top: '14%' }} />
          <div className="bulb" style={{ left: '71%', top: '17%' }} />
          <div className="bulb" style={{ left: '79%', top: '13%' }} />
        </div>
      </div>

      {/* Mascot layer (only rendered if not baked into the video/poster) */}
      {!HERO_HAS_BAKED_MASCOT && (
        <div className="hero-mascot-layer" aria-hidden="true">
          <Mascot pose="idle" section="hero" className="hero-mascot" />
        </div>
      )}

      {/* Content */}
      <div className="hero-content">
        <div className="hero-text-block">
          {/* Open/close live badge */}
          <div className="hero-status">
            <span className={`badge ${openStatus ? 'badge-open' : 'badge-closed'}`}>
              <span className="status-dot" />
              {openStatus
                ? 'Buka sekarang'
                : `Tutup · buka lagi jam ${String(business.hours.open).padStart(2, '0')}.00`
              }
            </span>
          </div>

          <h1 className="hero-headline">
            {business.heroHeadline}
          </h1>
          <p className="hero-subline">{business.heroSubline}</p>

          <div className="hero-ctas">
            {!whatsappVerified ? (
              <>
                <a
                  href={`tel:${business.phone}`}
                  className="btn-enamel btn-tel"
                  onClick={() => trackEvent('tel_hero_click')}
                  aria-label={`Telepon Jaliteng di ${business.phone}`}
                >
                  <PhoneIcon />
                  Telepon ({business.phone})
                </a>
                <a
                  href={business.whatsappUrl}
                  className="btn-enamel btn-secondary"
                  onClick={handleWAClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pesan via WhatsApp"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </>
            ) : (
              <>
                <a
                  href={business.whatsappUrl}
                  className="btn-enamel btn-wa"
                  onClick={handleWAClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pesan via WhatsApp"
                >
                  <WhatsAppIcon />
                  Pesan via WhatsApp
                </a>
                <a
                  href={`tel:${business.phone}`}
                  className="btn-enamel btn-secondary"
                  onClick={() => trackEvent('tel_hero_click')}
                  aria-label={`Telepon ${business.phone}`}
                >
                  <PhoneIcon />
                  Telepon
                </a>
              </>
            )}

            <button
              className="btn-enamel btn-secondary"
              onClick={scrollToMenu}
              aria-label="Lihat Menu Jaliteng"
            >
              Lihat Menu
              <ArrowDownIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span>Gulir ke bawah</span>
        <div className="scroll-line" />
      </div>

      {/* Torn paper bottom edge */}
      <div className="hero-torn" aria-hidden="true" />
    </section>
  );
};

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.025.37 2.03.72 3-.275.733-.085 1.58.495 2.16l1.27 1.27a16 16 0 006.29 6.29l1.27 1.27c.58.58 1.427.77 2.16.495.97.35 1.975.592 3 .72A2 2 0 0122 16.92z"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 5v14M5 12l7 7 7-7"/>
  </svg>
);

export default Hero;
