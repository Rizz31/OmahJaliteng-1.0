// Global sound flag and Web Audio API synthesizer for soft mascot bounce
let soundActive = false;

export function setSoundActive(active: boolean) {
  soundActive = active;
}

export function isSoundActive() {
  return soundActive;
}

export function playMascotBounceSound() {
  if (!soundActive || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Warm, soft acoustic boing/chime (pentatonic Javanese warmth)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Gentle frequency sweep
    osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.08); // D5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18); // A4
    
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  } catch {
    // Audio context may be restricted by browser policy
  }
}
