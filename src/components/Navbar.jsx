"use client";

import { useState, useEffect } from "react";

export default function Navbar({ isLoaded = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePreview, setActivePreview] = useState("/assets/hero_bag_noir.jpg");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "BỘ SƯU TẬP TÚI XÁCH", id: "collection", preview: "/assets/hero_bag_noir_cutout.png" },
    { label: "CHẾ TÁC TÚI DA", id: "bag-experience", preview: "/assets/bag_eclat_cutout.png" },
    { label: "CHIẾN DỊCH OLIUS", id: "editorial", preview: "/assets/editorial_campaign.jpg" },
    { label: "XƯỞNG THỦ CÔNG", id: "atelier", preview: "/assets/atelier_artisan.jpg" },
    { label: "CỬA HÀNG & BÁO GIÁ", href: "/boutique", preview: "/assets/bag_celeste.jpg" },
  ];

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 9000,
          padding: scrolled ? "16px clamp(20px, 4vw, 48px)" : "20px clamp(20px, 4vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(-12px)",
          transition:
            "background-color 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease, opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          backgroundColor: scrolled ? "rgba(10, 10, 10, 0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(200, 183, 156, 0.12)" : "1px solid transparent",
        }}
      >
        {/* Brand Monogram / Name */}
        <a
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              scrollToSection("hero");
            }
          }}
          data-cursor="pointer"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            letterSpacing: "0.32em",
            fontWeight: 400,
            color: "#F4F0E8",
            textDecoration: "none",
          }}
        >
          OLIUS
        </a>

        {/* Desktop Quick Nav Links */}
        <nav
          style={{
            display: "none",
            gap: "36px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navLinks.slice(0, 4).map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              data-cursor="pointer"
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "rgba(244, 240, 232, 0.7)",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8B79C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 240, 232, 0.7)")}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Controls: Boutique Price Button + Menu Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href="/boutique"
            data-cursor="pointer"
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, rgba(200, 183, 156, 0.22) 0%, rgba(200, 183, 156, 0.06) 100%)",
              border: "1px solid rgba(200, 183, 156, 0.45)",
              borderRadius: "20px",
              padding: "7px 16px",
              color: "#F4F0E8",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8B79C";
              e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.45)";
              e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.22)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ color: "#E8C872", fontSize: "10px" }}>✦</span>
            <span>CỬA HÀNG & BÁO GIÁ</span>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor="plus"
            aria-label="Toggle Fullscreen Exhibition Navigation"
            style={{
              background: "transparent",
              border: "1px solid rgba(200, 183, 156, 0.3)",
              borderRadius: "20px",
              padding: "8px 18px",
              color: "#F4F0E8",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "border-color 0.3s ease, background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C8B79C";
              e.currentTarget.style.backgroundColor = "rgba(200, 183, 156, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.3)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span>{menuOpen ? "ĐÓNG" : "MENU"}</span>
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: menuOpen ? "#C8B79C" : "#F4F0E8",
                transition: "transform 0.3s ease",
                transform: menuOpen ? "rotate(45deg) scale(1.3)" : "scale(1)",
              }}
            />
          </button>
        </div>
      </header>

      {/* Responsive helper for desktop nav */}
      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
        }
      `}</style>

      {/* Fullscreen Curtain Navigation Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 8990,
          backgroundColor: "#0A0A0A",
          display: "flex",
          pointerEvents: menuOpen ? "all" : "none",
          clipPath: menuOpen
            ? "circle(150% at calc(100% - 60px) 40px)"
            : "circle(0% at calc(100% - 60px) 40px)",
          transition: "clip-path 1.05s cubic-bezier(0.76, 0, 0.24, 1)",
          overflow: "hidden",
          willChange: "clip-path",
        }}
      >
        {/* Ambient Backdrop preview on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${activePreview})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            filter: "blur(30px) brightness(0.6)",
            transform: "scale(1.1)",
            transition: "background-image 0.5s ease",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(100px, 12vh, 140px) clamp(24px, 6vw, 80px) clamp(30px, 5vh, 60px)",
            zIndex: 2,
          }}
        >
          {/* Top Label */}
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#C8B79C",
              textTransform: "uppercase",
            }}
          >
            DANH MỤC TRIỂN LÃM SỐ
          </div>

          {/* Links list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 3vh, 32px)" }}>
            {navLinks.map((link, idx) => (
              <div
                key={link.id || link.href}
                onMouseEnter={() => setActivePreview(link.preview)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setMenuOpen(false);
                  if (link.href) {
                    window.location.href = link.href;
                  } else {
                    if (window.location.pathname !== "/") {
                      window.location.href = `/#${link.id}`;
                    } else {
                      scrollToSection(link.id);
                    }
                  }
                }}
                data-cursor="explore"
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "rgba(200, 183, 156, 0.5)",
                    letterSpacing: "0.15em",
                  }}
                >
                  0{idx + 1}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(32px, 5.5vw, 64px)",
                    fontWeight: 300,
                    letterSpacing: "0.08em",
                    color: "#F4F0E8",
                    transition: "color 0.3s ease, transform 0.3s ease",
                    display: "inline-block",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#C8B79C";
                    e.currentTarget.style.transform = "translateX(12px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#F4F0E8";
                    e.currentTarget.style.transform = "translateX(0px)";
                  }}
                >
                  {link.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Footer Info inside Menu */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid rgba(200, 183, 156, 0.15)",
              paddingTop: "24px",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(244, 240, 232, 0.4)",
            }}
          >
            <span>FLORENCE · PARIS · MILAN</span>
            <span>ẤN BẢN 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
