export type ToastSound = 'success' | 'info';

const TONES: Record<ToastSound, number[]> = {
  success: [660, 880],
  info: [520],
};
const NOTE_GAP_S = 0.09;
const NOTE_LENGTH_S = 0.25;
const PEAK_GAIN = 0.06;

let context: AudioContext | undefined;

/**
 * Plays a short, quiet chime with the Web Audio API. Fails silently where audio is unavailable.
 * @param kind `success` plays two rising notes, `info` a single lower note.
 */
export function playToastSound(kind: ToastSound) {
  try {
    context ??= new AudioContext();
    const start = context.currentTime;
    TONES[kind].forEach((frequency, index) => {
      if (!context) return;
      const at = start + index * NOTE_GAP_S;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(PEAK_GAIN, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + NOTE_LENGTH_S);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(at);
      oscillator.stop(at + NOTE_LENGTH_S);
    });
  } catch {
    context = undefined;
  }
}
