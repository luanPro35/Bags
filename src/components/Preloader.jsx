"use client";

import { useEffect, useState, useRef } from "react";

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState("entering"); // "entering" -> "revealed" -> "opening" -> "done"
  const [isRemoved, setIsRemoved] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleOpenDoors = () => {
    if (phase === "opening" || phase === "done") return;
    setPhase("opening");
    if (onCompleteRef.current) onCompleteRef.current();

    // Remove from DOM after doors fully slide open
    setTimeout(() => {
      setPhase("done");
      setIsRemoved(true);
    }, 1350);
  };

  useEffect(() => {
    // Step 1: Center gold seam line & brand reveal
    const timerReveal = setTimeout(() => {
      setPhase("revealed");
    }, 280);

    // Step 2: Automatic majestic grand opening after deliberate luxury pause
    const timerOpen = setTimeout(() => {
      handleOpenDoors();
    }, 1600);

    return () => {
      clearTimeout(timerReveal);
      clearTimeout(timerOpen);
    };
  }, []);

  if (isRemoved) return null;

  const isOpening = phase === "opening";
  const isRevealed = phase === "revealed" || phase === "opening";

  return (
    <div
      onClick={handleOpenDoors}
      data-cursor="pointer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99990,
        pointerEvents: isOpening ? "none" : "all",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* LEFT MAJESTIC VELVET PANEL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50.2vw", // slight overlap to prevent subpixel gap
          height: "100vh",
          backgroundColor: "#060606",
          transform: isOpening ? "translateX(-100%)" : "translateX(0%)",
          transition: "transform 1.25s cubic-bezier(0.83, 0, 0.17, 1)",
          willChange: "transform",
          boxShadow: isOpening ? "20px 0 60px rgba(0, 0, 0, 0.9)" : "none",
        }}
      />

      {/* RIGHT MAJESTIC VELVET PANEL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50.2vw",
          height: "100vh",
          backgroundColor: "#060606",
          transform: isOpening ? "translateX(100%)" : "translateX(0%)",
          transition: "transform 1.25s cubic-bezier(0.83, 0, 0.17, 1)",
          willChange: "transform",
          boxShadow: isOpening ? "-20px 0 60px rgba(0, 0, 0, 0.9)" : "none",
        }}
      />

      {/* SINGLE CENTER GLOWING SEAM ACCENT */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "100vh",
          background: "linear-gradient(180deg, transparent 0%, rgba(200, 183, 156, 0.5) 15%, rgba(200, 183, 156, 0.9) 50%, rgba(200, 183, 156, 0.5) 85%, transparent 100%)",
          opacity: isOpening ? 0 : isRevealed ? 0.8 : 0,
          boxShadow: "0 0 16px rgba(200, 183, 156, 0.5)",
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* CENTRAL BRAND CONTENT OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
          opacity: isOpening ? 0 : isRevealed ? 1 : 0,
          transform: isOpening
            ? "translateY(-18px) scale(1.06)"
            : isRevealed
            ? "translateY(0px) scale(1)"
            : "translateY(12px) scale(0.96)",
          filter: isOpening ? "blur(6px)" : "blur(0px)",
          transition: "opacity 0.75s ease, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s ease",
        }}
      >
        {/* Soft Golden Aura Glow */}
        <div
          style={{
            position: "absolute",
            width: "min(520px, 85vw)",
            height: "min(520px, 85vw)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 183, 156, 0.16) 0%, rgba(6, 6, 6, 0) 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        {/* Monogram Circular Seal */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "1px solid rgba(200, 183, 156, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#060606",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(200, 183, 156, 0.25)",
            marginBottom: "18px",
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "20px",
              color: "#F4F0E8",
              fontWeight: 400,
            }}
          >
            O
          </span>
        </div>

        {/* Grand Typography Name */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(52px, 10vw, 92px)",
            fontWeight: 300,
            letterSpacing: "0.4em",
            margin: 0,
            textIndent: "0.4em",
            color: "#F4F0E8",
            textShadow: "0 6px 36px rgba(200, 183, 156, 0.3)",
          }}
        >
          OLIUS
        </h1>

        {/* Couture Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(10px, 1.2vw, 12px)",
            letterSpacing: "0.5em",
            color: "#C8B79C",
            marginTop: "14px",
            textTransform: "uppercase",
            textIndent: "0.5em",
            opacity: 0.95,
          }}
        >
          HAUTE MAROQUINERIE · PARIS
        </p>

        {/* Golden Hairline Underline Accent */}
        <div
          style={{
            width: "36px",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, #C8B79C 50%, transparent 100%)",
            marginTop: "20px",
            boxShadow: "0 0 10px rgba(200, 183, 156, 0.5)",
          }}
        />
      </div>
    </div>
  );
}
