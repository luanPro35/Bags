"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorType, setCursorType] = useState("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktop/mouse)
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hovered interactive elements for custom cursor states
      const target = e.target.closest("[data-cursor]");
      if (target) {
        const type = target.getAttribute("data-cursor");
        setCursorType(type);
        if (type === "view") setCursorText("XEM ◉");
        else if (type === "explore") setCursorText("KHÁM PHÁ");
        else if (type === "rotate") setCursorText("XOAY 360°");
        else if (type === "plus") setCursorText("+");
        else setCursorText("");
      } else {
        const clickable = e.target.closest("button, a, input, textarea");
        if (clickable) {
          setCursorType("pointer");
          setCursorText("");
        } else {
          setCursorType("default");
          setCursorText("");
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth physics lerp loop
    const render = () => {
      // Small dot follows tightly but not instant
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;

      // Outer ring floats like silk — very slow lag creates luxury feel
      cursorX += (mouseX - cursorX) * 0.09;
      cursorY += (mouseY - cursorY) * 0.09;

      if (cursorRef.current && cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${Math.round(dotX * 100) / 100}px, ${Math.round(dotY * 100) / 100}px, 0)`;
        cursorRef.current.style.transform = `translate3d(${Math.round(cursorX * 100) / 100}px, ${Math.round(cursorY * 100) / 100}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isExpanded = ["view", "explore", "rotate"].includes(cursorType);
  const isPlus = cursorType === "plus";
  const isPointer = cursorType === "pointer";

  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 99999 }}>
      {/* Center pinpoint */}
      <div
        ref={cursorDotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "4px",
          marginLeft: "-2px",
          marginTop: "-2px",
          borderRadius: "50%",
          backgroundColor: "#C8B79C",
          opacity: isExpanded ? 0 : 1,
          transition: "opacity 0.2s ease, transform 0.05s ease-out",
        }}
      />

      {/* Lag follower ring / expanded badge */}
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: isExpanded ? "84px" : isPlus ? "44px" : isPointer ? "48px" : "32px",
          height: isExpanded ? "84px" : isPlus ? "44px" : isPointer ? "48px" : "32px",
          marginLeft: isExpanded ? "-42px" : isPlus ? "-22px" : isPointer ? "-24px" : "-16px",
          marginTop: isExpanded ? "-42px" : isPlus ? "-22px" : isPointer ? "-24px" : "-16px",
          borderRadius: "50%",
          border: isExpanded
            ? "1px solid rgba(200, 183, 156, 0.6)"
            : "1px solid rgba(200, 183, 156, 0.35)",
          backgroundColor: isExpanded
            ? "rgba(10, 10, 10, 0.75)"
            : isPlus
            ? "rgba(200, 183, 156, 0.15)"
            : "transparent",
          backdropFilter: isExpanded ? "blur(8px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#F4F0E8",
          fontSize: isPlus ? "18px" : "10px",
          letterSpacing: isPlus ? "0" : "0.15em",
          fontFamily: "var(--font-sans)",
          fontWeight: 500,
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), margin 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        {cursorText}
      </div>
    </div>
  );
}
