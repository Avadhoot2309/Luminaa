import { useCallback } from 'react';

/**
 * Hook for playing sound effects in games
 * Uses Web Audio API to generate sounds for better performance
 */
export const useSoundEffects = () => {
    // Initialize audio context (lazy)
    let audioContext = null;

    const getAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    };

    // Play correct/success sound - ascending tones
    const playSuccess = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Create three ascending notes
            const notes = [
                { freq: 523.25, time: 0, duration: 0.1 }, // C5
                { freq: 659.25, time: 0.1, duration: 0.1 }, // E5
                { freq: 783.99, time: 0.2, duration: 0.2 }, // G5
            ];

            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = note.freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.3, now + note.time);
                gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration);

                osc.start(now + note.time);
                osc.stop(now + note.time + note.duration);
            });
        } catch (e) {
            console.error('Error playing success sound:', e);
        }
    }, []);

    // Play error/wrong sound - descending tones
    const playError = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Create two descending notes
            const notes = [
                { freq: 659.25, time: 0, duration: 0.15 }, // E5
                { freq: 440, time: 0.15, duration: 0.3 }, // A4
            ];

            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = note.freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.3, now + note.time);
                gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration);

                osc.start(now + note.time);
                osc.stop(now + note.time + note.duration);
            });
        } catch (e) {
            console.error('Error playing error sound:', e);
        }
    }, []);

    // Play click/button sound
    const playClick = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            console.error('Error playing click sound:', e);
        }
    }, []);

    // Play victory/level complete - fanfare-like sound
    const playVictory = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Create a celebratory fanfare
            const notes = [
                { freq: 523.25, time: 0, duration: 0.15 }, // C5
                { freq: 659.25, time: 0.15, duration: 0.15 }, // E5
                { freq: 783.99, time: 0.3, duration: 0.15 }, // G5
                { freq: 1046.50, time: 0.45, duration: 0.4 }, // C6 (high note)
            ];

            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = note.freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.35, now + note.time);
                gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration);

                osc.start(now + note.time);
                osc.stop(now + note.time + note.duration);
            });
        } catch (e) {
            console.error('Error playing victory sound:', e);
        }
    }, []);

    // Play combo/streak sound - quick beep
    const playCombo = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = 880; // A5
            osc.type = 'square';

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch (e) {
            console.error('Error playing combo sound:', e);
        }
    }, []);

    // Play match sound - for memory games
    const playMatch = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Play a harmonic match sound (two notes together)
            const notes = [523.25, 659.25]; // C5 and E5

            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

                osc.start(now);
                osc.stop(now + 0.25);
            });
        } catch (e) {
            console.error('Error playing match sound:', e);
        }
    }, []);

    // Play warning/time running out sound
    const playWarning = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Rapid beeps
            for (let i = 0; i < 3; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = 1047; // C6
                osc.type = 'sine';

                const startTime = now + i * 0.12;
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

                osc.start(startTime);
                osc.stop(startTime + 0.1);
            }
        } catch (e) {
            console.error('Error playing warning sound:', e);
        }
    }, []);

    // Play game over sound
    const playGameOver = useCallback(() => {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Descending scale (sad trombone style)
            const notes = [
                { freq: 523.25, time: 0, duration: 0.2 }, // C5
                { freq: 440, time: 0.2, duration: 0.2 }, // A4
                { freq: 370.99, time: 0.4, duration: 0.3 }, // F#4
            ];

            notes.forEach(note => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = note.freq;
                osc.type = 'sine';

                gain.gain.setValueAtTime(0.3, now + note.time);
                gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration);

                osc.start(now + note.time);
                osc.stop(now + note.time + note.duration);
            });
        } catch (e) {
            console.error('Error playing game over sound:', e);
        }
    }, []);

    return {
        playSuccess,
        playError,
        playClick,
        playVictory,
        playCombo,
        playMatch,
        playWarning,
        playGameOver,
    };
};
