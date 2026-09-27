"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FooterSection() {
  const footerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const footer = footerRef.current;
    const logo = logoRef.current;
    if (!footer || !logo) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logo,
        { scale: 0.85, autoAlpha: 0.5, letterSpacing: "0.18em", y: 30 },
        {
          scale: 1,
          autoAlpha: 1,
          letterSpacing: "0.32em",
          y: 0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "center center",
            scrub: 1.5,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#0A0A0A",
        color: "#F4F0E8",
        padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 64px) clamp(40px, 6vh, 60px)",
        borderTop: "1px solid rgba(200, 183, 156, 0.15)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "85vh",
        overflow: "hidden",
      }}
    >
      {/* Top subtle grid links */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "40px",
          borderBottom: "1px solid rgba(200, 183, 156, 0.12)",
          paddingBottom: "48px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.35em",
              color: "#C8B79C",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "12px",
            }}
          >
            VIỆN THỜI TRANG HAUTE COUTURE
          </span>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "20px",
              letterSpacing: "0.08em",
              color: "rgba(244, 240, 232, 0.7)",
              maxWidth: "360px",
            }}
          >
            Hành trình kiếm tìm bất tận về hình thể, bản chất và cấu trúc nét đẹp của Nàng.
          </p>
        </div>

        <div style={{ display: "flex", gap: "clamp(32px, 6vw, 80px)", flexWrap: "wrap" }}>
          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "#C8B79C",
                display: "block",
                marginBottom: "16px",
              }}
            >
              DANH MỤC
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { name: "BỘ SƯU TẬP TÚI XÁCH", id: "collection" },
                { name: "CHẾ TÁC TÚI DA", id: "bag-experience" },
                { name: "CHIẾN DỊCH OLIUS", id: "editorial" },
                { name: "XƯỞNG THỦ CÔNG", id: "atelier" },
                { name: "CỬA HÀNG & BÁO GIÁ", href: "/boutique" },
              ].map((item) => (
                <a
                  key={item.id || item.href}
                  href={item.href || `#${item.id}`}
                  data-cursor="pointer"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    color: "rgba(244, 240, 232, 0.6)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C8B79C")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 240, 232, 0.6)")}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "#C8B79C",
                display: "block",
                marginBottom: "16px",
              }}
            >
              SALON TRƯNG BÀY
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "rgba(244, 240, 232, 0.6)", letterSpacing: "0.1em" }}>
              <span>QUẢNG TRƯỜNG SIGNORIA, FIRENZE</span>
              <span>ĐẠI LỘ FAUBOURG, PARIS</span>
              <span>ĐƯỜNG MONTENAPOLEONE, MILAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monumental Central Logo */}
      <div
        style={{
          margin: "clamp(48px, 8vh, 96px) 0",
          textAlign: "center",
        }}
      >
        <h2
          ref={logoRef}
          onClick={scrollToTop}
          data-cursor="pointer"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(54px, 16vw, 240px)",
            fontWeight: 300,
            letterSpacing: "0.25em",
            color: "#F4F0E8",
            lineHeight: 0.9,
            cursor: "pointer",
            margin: 0,
            textIndent: "0.25em",
            transition: "color 0.4s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8B79C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#F4F0E8")}
        >
          OLIUS
        </h2>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(16px, 2.5vw, 32px)",
            letterSpacing: "0.15em",
            color: "#C8B79C",
            marginTop: "16px",
          }}
        >
          Nghệ Thuật Của Nàng
        </p>
      </div>

      {/* Final Chapter Sign-off */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
          borderTop: "1px solid rgba(200, 183, 156, 0.12)",
          paddingTop: "24px",
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "rgba(244, 240, 232, 0.4)",
        }}
      >
        <span>© 2026 OLIUS PARIS. BẢN QUYỀN ĐÃ ĐƯỢC BẢO HỘ.</span>
        <span
          style={{
            color: "#C8B79C",
            fontFamily: "var(--font-serif)",
            fontSize: "14px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          HẸN GẶP LẠI NÀNG TRONG CHƯƠNG KẾ TIẾP.
        </span>
        <button
          onClick={scrollToTop}
          data-cursor="pointer"
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(244, 240, 232, 0.6)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8B79C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 240, 232, 0.6)")}
        >
          VỀ ĐẦU TRANG ↑
        </button>
      </div>
    </footer>
  );
}
