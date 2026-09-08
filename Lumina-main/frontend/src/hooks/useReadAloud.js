import { useState, useEffect, useRef } from 'react';

export const useReadAloud = (language = 'en', speed = 1) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voices, setVoices] = useState([]);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ✅ Step 1: Force Load & Listen for Voices (Cross-Browser Resilient)
  useEffect(() => {
    let poller;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // 🔍 Vocal Diagnostics
        const indianVoices = availableVoices.filter(v => 
          v.lang.toLowerCase().includes('in') || 
          v.lang.toLowerCase().startsWith('hi') || 
          v.lang.toLowerCase().startsWith('mr')
        );
        console.log("🎙️ Luminaa Vocal Diagnostics:", {
          total: availableVoices.length,
          indianVoices: indianVoices.map(v => `${v.name} (${v.lang})`)
        });

        // If we found our target voices, we can stop polling early
        if (indianVoices.length > 0 && poller) clearInterval(poller);
      }
    };
    
    // Initial call
    loadVoices();

    // Standard event listener
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Interval polling (Critical for Firefox)
    poller = setInterval(loadVoices, 500);

    // Stop polling after 4 seconds to save resources
    const timeout = setTimeout(() => {
      if (poller) clearInterval(poller);
    }, 4000);

    return () => {
      if (poller) clearInterval(poller);
      clearTimeout(timeout);
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
      // 🛑 Critical: Stop all speech on unmount
      synth.cancel();
    };
  }, [synth]);

  // ✅ Step 2: Advanced Voice Selection
  const getBestVoice = (langCode) => {
    const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'mr-IN' };
    const targetLang = langMap[langCode] || langCode;
    
    // Normalize target for comparison (handle both - and _)
    const isTargetMatch = (voiceLang) => {
      const normalized = voiceLang.toLowerCase().replace('_', '-');
      return normalized.startsWith(targetLang.toLowerCase());
    };

    // Priority 1: Microsoft Natural Online Voices (Premium)
    const msNatural = voices.find(v => 
      isTargetMatch(v.lang) && 
      (v.name.includes('Natural') || v.name.includes('Online')) &&
      v.name.includes('Microsoft')
    );
    if (msNatural) return msNatural;

    // Priority 2: Google Natural Voices
    const googleVoice = voices.find(v => 
      isTargetMatch(v.lang) && 
      v.name.includes('Google')
    );
    if (googleVoice) return googleVoice;
    
    // Priority 3: Standard Region-Specific Voices
    const standardVoice = voices.find(v => isTargetMatch(v.lang));
    if (standardVoice) return standardVoice;
    
    // Priority 4: Universal Indian Fallback (Critical for devices with only 1 Indian voice)
    if (langCode === 'hi' || langCode === 'mr') {
      const anyIndian = voices.find(v => 
        v.lang.toLowerCase().includes('in') || 
        v.lang.toLowerCase().startsWith('hi') || 
        v.lang.toLowerCase().startsWith('mr')
      );
      if (anyIndian) return anyIndian;
    }

    // Priority 5: Generic Language Code
    const genericVoice = voices.find(v => v.lang.startsWith(langCode));
    if (genericVoice) return genericVoice;

    return null;
  };

  const speak = (text, onBoundary, onEnd) => {
    // 🛑 Soft Reset: Clear any hanging speech
    synth.cancel();

    // ⏱️ Delay (50ms) to ensure the browser's speech engine has cleared its buffer
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map internal codes to browser-standard locale strings
      const browserLang = language === 'hi' ? 'hi-IN' : (language === 'mr' ? 'mr-IN' : 'en-IN');
      utterance.lang = browserLang;
      
      const voice = getBestVoice(language);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = speed;
      
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary(event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onEnd) onEnd();
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }, 50);
  };

  const pause = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (synth.paused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  };

  // Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecording(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isPlaying,
    isPaused,
    currentWordIndex,
    setCurrentWordIndex,
    currentSentenceIndex,
    setCurrentSentenceIndex,
    speak,
    pause,
    resume,
    stop,
    startRecording,
    stopRecording,
    isRecording,
    recording
  };
};
