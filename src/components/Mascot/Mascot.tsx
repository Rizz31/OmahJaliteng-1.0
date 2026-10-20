import React, { useEffect, useRef, useState, useCallback } from 'react';
import { mascot } from '../../content.config';
import { playMascotBounceSound } from '../../utils/sound';
import { getAssetUrl } from '../../utils/asset';
import './Mascot.css';

export type MascotPose = 'idle' | 'lick' | 'point' | 'thumbsup' | 'peek' | 'jump' | 'blangkon';

interface MascotProps {
  pose?: MascotPose;
  section?: string;
  className?: string;
}

interface Crumb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const POSE_IMAGES: Record<MascotPose, string> = {
  idle:     getAssetUrl('assets/mascot/mascot-idle.png'),
  lick:     getAssetUrl('assets/mascot/mascot-lick.png'),
  point:    getAssetUrl('assets/mascot/mascot-point.png'),
  thumbsup: getAssetUrl('assets/mascot/mascot-thumbsup.png'),
  peek:     getAssetUrl('assets/mascot/mascot-peek.png'),
  jump:     getAssetUrl('assets/mascot/mascot-jump.png'),
  blangkon: getAssetUrl('assets/mascot/mascot-blangkon.png'),
};

export const Mascot: React.FC<MascotProps> = ({ pose = 'idle', section, className = '' }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [currentPose, setCurrentPose] = useState<MascotPose>(pose);
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});
  
  const lickTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sync prop -> state
  useEffect(() => {
    setCurrentPose(pose);
  }, [pose]);

  // Auto tongue-lick every 6-10s
  useEffect(() => {
    if (reducedMotion) return;
    const scheduleLick = () => {
      const waitTime = 6000 + Math.random() * 4000;
      lickTimerRef.current = setTimeout(() => {
        setCurrentPose('lick');
        setTimeout(() => setCurrentPose(pose), 1600);
        scheduleLick();
      }, waitTime);
    };
    scheduleLick();
    return () => {
      if (lickTimerRef.current) clearTimeout(lickTimerRef.current);
    };
  }, [pose, reducedMotion]);

  const showBubble = useCallback((text?: string) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    const msg = text || mascot.bubbles[Math.floor(Math.random() * mascot.bubbles.length)];
    setBubble(msg);
    setBubbleVisible(true);
    bubbleTimerRef.current = setTimeout(() => setBubbleVisible(false), 3600);
  }, []);

  // Section-based bubble greeting
  useEffect(() => {
    if (!section) return;
    const sectionBubbles: Record<string, string> = {
      hero:     'Kulo nuwun, selamat datang di Jaliteng!',
      menu:     'Monggo, dipilih dulu...',
      story:    'Hangat dari Semarang sejak awal berdiri!',
      location: 'Yuk mampir, kami tunggu ya!',
      cta:      'Pesan malam ini, yuk!',
    };
    const msg = sectionBubbles[section];
    if (msg) showBubble(msg);
  }, [section, showBubble]);

  // Listen for global cart add event to do thumbsup + bubble
  useEffect(() => {
    const handleCartAdd = () => {
      setCurrentPose('thumbsup');
      showBubble('Sip! Sudah masuk pesanan, monggo dicek!');
      setTimeout(() => setCurrentPose(pose), 2200);
    };
    window.addEventListener('jaliteng:cart-add', handleCartAdd);
    return () => window.removeEventListener('jaliteng:cart-add', handleCartAdd);
  }, [pose, showBubble]);

  // Click handler: squish-bounce + crumb particles + soft sound
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    playMascotBounceSound();

    if (reducedMotion) {
      showBubble();
      return;
    }

    // Squish-bounce effect
    setIsSquishing(true);
    setCurrentPose('jump');
    showBubble();

    // Spawn crumb particles
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const crumbColors = ['#E8A838', '#F1E6D0', '#5B3A21', '#B5532F'];
    const newCrumbs: Crumb[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: clickX,
      y: clickY,
      vx: (Math.random() - 0.5) * 80,
      vy: -20 - Math.random() * 60,
      size: 4 + Math.random() * 5,
      color: crumbColors[Math.floor(Math.random() * crumbColors.length)],
    }));

    setCrumbs(newCrumbs);
    setTimeout(() => setCrumbs([]), 650);

    setTimeout(() => {
      setIsSquishing(false);
      setCurrentPose(pose);
    }, 1000);
  }, [pose, reducedMotion, showBubble]);

  // Mouse tilt & touch tilt towards pointer
  useEffect(() => {
    if (reducedMotion) return;
    const handlePointer = (clientX: number, clientY: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (clientX - cx) / (window.innerWidth || 1);
      const dy = (clientY - cy) / (window.innerHeight || 1);
      el.style.setProperty('--tilt-x', `${dy * 8}deg`);
      el.style.setProperty('--tilt-y', `${-dx * 8}deg`);
    };

    const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [reducedMotion]);

  const effectivePose = currentPose;
  const src = POSE_IMAGES[effectivePose] || POSE_IMAGES['idle'];
  const fallbackSrc = POSE_IMAGES['idle'];

  return (
    <div
      ref={wrapRef}
      className={`mascot-wrap ${isSquishing ? 'squish' : ''} ${className}`}
      style={{
        '--tilt-x': '0deg',
        '--tilt-y': '0deg',
        transformOrigin: `${mascot.footAnchorX}% ${mascot.footAnchorY}%`,
      } as React.CSSProperties}
      onClick={handleClick}
      aria-label="Maskot Jaliteng interaktif"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showBubble();
          playMascotBounceSound();
        }
      }}
    >
      {/* Speech bubble */}
      {bubbleVisible && bubble && (
        <div className="mascot-bubble" aria-live="polite">
          <span>{bubble}</span>
        </div>
      )}

      {/* Crumb particles */}
      {crumbs.map(crumb => (
        <span
          key={crumb.id}
          className="mascot-crumb"
          style={{
            left: `${crumb.x}px`,
            top: `${crumb.y}px`,
            width: `${crumb.size}px`,
            height: `${crumb.size}px`,
            backgroundColor: crumb.color,
            '--vx': `${crumb.vx}px`,
            '--vy': `${crumb.vy}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}

      {/* Mascot Image */}
      <img
        ref={imgRef}
        src={imgFailed[src] ? fallbackSrc : src}
        alt={`Maskot Jaliteng ${effectivePose}`}
        className={`mascot-img mascot-${effectivePose}`}
        style={{
          transformOrigin: `${mascot.footAnchorX}% ${mascot.footAnchorY}%`,
        }}
        onError={() => {
          if (!imgFailed[src]) setImgFailed(prev => ({ ...prev, [src]: true }));
        }}
        draggable={false}
      />
    </div>
  );
};

export default Mascot;
