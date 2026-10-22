// ============================================================
// SOUND OF LUXURY — Native Web Audio Synthesizer (Round 59)
// Pure Web Audio API: 0 external assets, 0ms lag, toggleable
// ============================================================

const SOUND_PREF_KEY = 'pd_luxury_sound_enabled';

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled() {
  try {
    const val = localStorage.getItem(SOUND_PREF_KEY);
    return val === 'true'; // Default disabled until user turns it on
  } catch (e) {
    return false;
  }
}

export function setSoundEnabled(enabled) {
  try {
    localStorage.setItem(SOUND_PREF_KEY, enabled ? 'true' : 'false');
    if (enabled) {
      playCrystalChime();
    }
  } catch (e) {}
}

export function toggleSound() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

/**
 * Crystal bell chime for luxury actions (Wishlist, Saved, Match 98%)
 */
export function playCrystalChime() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7 arpeggio

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.045 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.6);
    });
  } catch (e) {}
}

/**
 * Subtle tactile metallic click for buttons & sliders
 */
export function playSoftClick() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

/**
 * Gem sparkle dispersion shimmer (for diamond fire / loupe)
 */
export function playSparkle() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 + Math.random() * 1400, now + i * 0.035);

      gain.gain.setValueAtTime(0.03, now + i * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.035);
      osc.stop(now + i * 0.035 + 0.22);
    }
  } catch (e) {}
}

/**
 * Camera shutter sound for photo snapshots & moodboard download
 */
export function playCameraSnap() {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}
