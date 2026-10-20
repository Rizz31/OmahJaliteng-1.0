import { business } from '../content.config';

/** Returns true if the warung is currently open */
export function isOpen(): boolean {
  const now = new Date();
  // Get Jakarta time
  const jakartaStr = now.toLocaleString('en-US', { timeZone: business.hours.timezone });
  const jakarta = new Date(jakartaStr);
  const h = jakarta.getHours();
  return h >= business.hours.open && h < business.hours.close;
}

/** Returns today's day name in Indonesian */
export function todayDayName(): string {
  const now = new Date();
  const jakartaStr = now.toLocaleString('en-US', { timeZone: business.hours.timezone, weekday: 'long' });
  const map: Record<string, string> = {
    Sunday: 'Minggu', Monday: 'Senin', Tuesday: 'Selasa',
    Wednesday: 'Rabu', Thursday: 'Kamis', Friday: 'Jumat', Saturday: 'Sabtu',
  };
  return map[jakartaStr] || jakartaStr;
}

/** Format price Indonesian style */
export function formatPrice(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

/** Check if URL is a valid direct link (not a google share redirect) */
export function isValidDirectUrl(url: string, domain: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes(domain);
  } catch {
    return false;
  }
}

/** Detect save-data or slow connection */
export function isSaveData(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
  const conn = nav.connection;
  if (!conn) return false;
  return !!(conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
}

/** Check WebGL availability */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Track analytics events */
export function trackEvent(name: string, props?: Record<string, string>): void {
  try {
    // Plausible
    if ((window as typeof window & { plausible?: (e: string, o?: { props?: Record<string, string> }) => void }).plausible) {
      (window as typeof window & { plausible?: (e: string, o?: { props?: Record<string, string> }) => void }).plausible!(name, { props });
    }
    // GA4
    if ((window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag!('event', name, props);
    }
  } catch {
    // no-op
  }
}
