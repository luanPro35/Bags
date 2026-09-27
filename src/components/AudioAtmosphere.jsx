"use client";

import { useState, useEffect, useRef } from "react";

export default function AudioAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      // Start ethereal soundscape
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Frequencies for a warm, celestial luxury ambient chord (F2, C3, Ab3, C4)
        const freqs = [87.31, 130.81, 207.65, 261.63];
        const oscs = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

          osc.type = idx % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(320 + idx * 80, ctx.currentTime);

          if (panner) {
            panner.pan.setValueAtTime((idx - 1.5) * 0.4, ctx.currentTime);
            osc.connect(filter);
            filter.connect(panner);
            panner.connect(masterGain);
          } else {
            osc.connect(filter);
            filter.connect(masterGain);
          }

          osc.start();
          oscs.push(osc);
        });

        oscillatorsRef.current = oscs;
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio API error:", err);
      }
    } else {
      // Fade out
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        setTimeout(() => {
          oscillatorsRef.current.forEach((osc) => osc.stop());
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
          oscillatorsRef.current = [];
          setIsPlaying(false);
        }, 1200);
      }
    }
  };

  return (
    <button
      onClick={toggleSound}
      data-cursor="pointer"
      aria-label="Toggle ambient luxury soundscape"
      style={{
        background: "transparent",
        border: "none",
        color: isPlaying ? "var(--color-champagne)" : "rgba(244, 240, 232, 0.45)",
        fontSize: "11px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        padding: "6px 10px",
        transition: "color 0.3s ease",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "flex-end", height: "12px", gap: "2px" }}>
        {[0.6, 1, 0.4, 0.8].map((h, i) => (
          <span
            key={i}
            style={{
              width: "1.5px",
              height: isPlaying ? "100%" : "4px",
              backgroundColor: "currentColor",
              transformOrigin: "bottom",
              animation: isPlaying ? `pulseSubtle ${1 + i * 0.3}s ease-in-out infinite alternate` : "none",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </span>
      <span>{isPlaying ? "SOUND ON" : "SOUND OFF"}</span>
    </button>
  );
}
