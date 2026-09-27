"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CollectionSection({ onInspect }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  // Use refs for values updated every scroll frame — avoids React re-renders
  const bgRef = useRef(null);          // the section DOM element for direct style update
  const currentBgIdxRef = useRef(-1); // tracks last active exhibit to skip redundant updates

  const exhibits = [
    {
      id: "noir",
      num: "01",
      name: "OLIUS NOIR 01",
      price: "118.000.000 ₫",
      usdPrice: "$4,850",
      subtitle: "Kiến trúc của bóng tối & sự im lặng sang trọng.",
      description: "Da bê vân hạt Mill Box từ Ý, cắt giác hình học góc cạnh. Khóa bấm kim loại mạ vàng chải xước — tuyên ngôn của sự tự tin không ồn ào.",
      image: "/assets/hero_bag_noir_cutout.png",
      bg: "#0A0A0A",
      theme: "dark",
      specs: "Da Bê Ý · Khóa Vàng 24K Chải Xước · 28 × 18 × 9 cm",
    },
    {
      id: "eclat",
      num: "02",
      name: "OLIUS ÉCLAT 02",
      price: "135.000.000 ₫",
      usdPrice: "$5,500",
      subtitle: "Ánh sáng ngưng đọng trên từng thớ da mềm mại.",
      description: "Tông màu champagne beige thanh khiết kết hợp kim loại bóng loáng. Một tạo tác sinh ra để bắt trọn ánh đèn trong những buổi dạ tiệc sang trọng.",
      image: "/assets/bag_eclat_cutout.png",
      bg: "#16130E",
      theme: "dark",
      specs: "Da Bê Mịn Champagne · Kim Loại Mạ Vàng Nhạt · 24 × 15 × 7 cm",
    },
    {
      id: "rose",
      num: "03",
      name: "OLIUS ROSE 03",
      price: "125.000.000 ₫",
      usdPrice: "$5,100",
      subtitle: "Tuyên ngôn của sự dịu dàng không khoan nhượng.",
      description: "Sắc hồng dusty rose đằm thắm trên chất da bê mềm như lụa. Khóa vàng champagne mờ — một thiết kế sinh ra cho những tâm hồn duy mỹ.",
      image: "/assets/bag_rose_cutout.png",
      bg: "#181014",
      theme: "dark",
      specs: "Da Bê Dusty Rose · Khóa Vàng Champagne · 22 × 16 × 8 cm",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${totalScroll * 1.3}`,
          pin: true,
          scrub: 1.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          fastScrollEnd: 1500,
          onUpdate: (self) => {
            const progress = self.progress;
            let idx;
            if (progress < 0.35) idx = 0;
            else if (progress < 0.72) idx = 1;
            else idx = 2;

            // Only update DOM when exhibit actually changes — no React re-render
            if (idx !== currentBgIdxRef.current) {
              currentBgIdxRef.current = idx;
              if (bgRef.current) {
                bgRef.current.style.backgroundColor = exhibits[idx].bg;
              }
            }
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Static dark palette — background color changes via direct DOM (bgRef)
  const textColor = "#F4F0E8";
  const subColor = "rgba(200, 183, 156, 0.85)";

  return (
    <section
      id="collection"
      ref={(el) => { containerRef.current = el; bgRef.current = el; }}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#0A0A0A", // initial; changes via bgRef direct style
        overflow: "hidden",
        transition: "background-color 0.8s ease",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: "clamp(98px, 12vh, 125px)",
          left: "clamp(24px, 5vw, 64px)",
          right: "clamp(24px, 5vw, 64px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          zIndex: 10,
          pointerEvents: "none",
          transition: "color 0.5s ease",
          color: textColor,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: subColor,
              display: "block",
              marginBottom: "6px",
            }}
          >
            PHẦN 02 — BỘ SƯU TẬP
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3.6vw, 44px)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              margin: 0,
            }}
          >
            BỘ SƯU TẬP TÚI XÁCH OLIUS
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", pointerEvents: "all" }}>
          <a
            href="/boutique"
            data-cursor="pointer"
            style={{
              textDecoration: "none",
              color: "#C8B79C",
              fontSize: "10px",
              letterSpacing: "0.2em",
              fontFamily: "var(--font-sans)",
              border: "1px solid rgba(200, 183, 156, 0.4)",
              borderRadius: "16px",
              padding: "6px 14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F4F0E8";
              e.currentTarget.style.borderColor = "#C8B79C";
              e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#C8B79C";
              e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.4)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span>BẢNG GIÁ BOUTIQUE</span>
            <span>➔</span>
          </a>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: subColor,
            }}
          >
            SÀN DIỄN KHÔNG GIAN ← CUỘN →
          </span>
        </div>
      </div>

      {/* Horizontal Cards Track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          paddingLeft: "clamp(24px, 5vw, 64px)",
          paddingRight: "clamp(24px, 5vw, 64px)",
          gap: "clamp(40px, 8vw, 120px)",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {exhibits.map((item) => {
          const itemLight = item.theme === "light";
          const cardTextColor = itemLight ? "#1A0A08" : "#F4F0E8";
          const cardSubColor = itemLight ? "#4A2A20" : "#C8B79C";
          const cardBorder = itemLight ? "rgba(26, 10, 8, 0.15)" : "rgba(200, 183, 156, 0.22)";

          return (
            <div
              key={item.id}
              data-cursor="view"
              onClick={() => onInspect && onInspect(item.id)}
              style={{
                width: "clamp(340px, 60vw, 760px)",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                cursor: "pointer",
                padding: "clamp(24px, 3vw, 40px)",
                borderRadius: "4px",
                backgroundColor: itemLight ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${cardBorder}`,
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Luxury handbag visual */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  borderRadius: "2px",
                  position: "relative",
                  backgroundColor: "rgba(0,0,0,0.04)",
                }}
              >
                {/* Floor shadow */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "55%",
                    height: "20px",
                    borderRadius: "50%",
                    background: itemLight
                      ? "radial-gradient(ellipse at center, rgba(0,0,0,0.14) 0%, transparent 70%)"
                      : "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    pointerEvents: "none",
                  }}
                />
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "16px 28px",
                    filter: itemLight
                      ? "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15))"
                      : "drop-shadow(0 22px 40px rgba(0, 0, 0, 0.65))",
                    transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease",
                    position: "relative",
                    zIndex: 2,
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07) translateY(-5px) rotate(-2deg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) translateY(0) rotate(0deg)")}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "20px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    color: itemLight ? "#1A0A08" : "#F4F0E8",
                    padding: "4px 10px",
                    backgroundColor: itemLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                    borderRadius: "12px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {item.num} / 03
                </span>
              </div>

              {/* Info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(28px, 4vw, 52px)",
                      fontWeight: 400,
                      letterSpacing: "0.12em",
                      color: cardTextColor,
                      margin: 0,
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(15px, 1.7vw, 20px)",
                      color: cardSubColor,
                      marginTop: "4px",
                    }}
                  >
                    {item.subtitle}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      letterSpacing: "0.07em",
                      color: itemLight ? "#555" : "rgba(244, 240, 232, 0.6)",
                      marginTop: "10px",
                      maxWidth: "480px",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "13px",
                        letterSpacing: "0.15em",
                        color: "#E8C872",
                        fontWeight: 500,
                      }}
                    >
                      {item.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "11px",
                        color: "rgba(200, 183, 156, 0.6)",
                      }}
                    >
                      ({item.usdPrice})
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0, marginLeft: "20px" }}>
                  <a
                    href={`/boutique?product=${item.id}`}
                    data-cursor="pointer"
                    style={{
                      textDecoration: "none",
                      background: "linear-gradient(135deg, rgba(200, 183, 156, 0.25) 0%, rgba(200, 183, 156, 0.1) 100%)",
                      border: "1px solid rgba(200, 183, 156, 0.5)",
                      color: "#F4F0E8",
                      padding: "10px 20px",
                      borderRadius: "24px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.4)";
                      e.currentTarget.style.borderColor = "#C8B79C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.25)";
                      e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.5)";
                    }}
                  >
                    BÁO GIÁ & MUA ➔
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onInspect) onInspect(item.id);
                    }}
                    data-cursor="explore"
                    style={{
                      background: "transparent",
                      border: `1px solid ${cardBorder}`,
                      color: cardTextColor,
                      padding: "10px 20px",
                      borderRadius: "24px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = cardTextColor;
                      e.currentTarget.style.color = itemLight ? "#FFFFFF" : "#0A0A0A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = cardTextColor;
                    }}
                  >
                    CHIÊM NGƯỠNG 3D ↗
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
