"use client";

import { useState } from "react";

export default function EditorialSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="editorial"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(95px, 12vh, 130px) clamp(20px, 4vw, 48px) clamp(40px, 6vh, 60px)",
        overflow: "hidden",
      }}
    >
      {/* Background Ambience */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "80vw",
          background: "radial-gradient(circle, rgba(200, 183, 156, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Editorial Frame (occupies 80% screen width) */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-cursor="explore"
        style={{
          position: "relative",
          width: "min(84vw, 1100px)",
          aspectRatio: "3/4",
          maxHeight: "82vh",
          overflow: "hidden",
          borderRadius: "4px",
          border: "1px solid rgba(200, 183, 156, 0.2)",
          cursor: "pointer",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* Editorial Image with B&W to Color Transition */}
        <img
          src="/assets/editorial_campaign.jpg"
          alt="OLIUS Haute Couture Editorial Lookbook"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isHovered
              ? "grayscale(0%) contrast(1.04) brightness(1.02) saturate(1.1) blur(0px)"
              : "grayscale(100%) contrast(1.18) brightness(0.88) blur(0.3px)",
            transform: isHovered ? "scale(1.045)" : "scale(1)",
            transition: "filter 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform, filter",
          }}
        />

        {/* Ambient Dark Gradient Bottom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.1) 40%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Floating Editorial Meta */}
        <div
          style={{
            position: "absolute",
            top: "clamp(20px, 3vw, 40px)",
            left: "clamp(20px, 3vw, 40px)",
            right: "clamp(20px, 3vw, 40px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            color: "rgba(244, 240, 232, 0.75)",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          <span>CHIẾN DỊCH THU / ĐÔNG</span>
          <span>LƯU TRỮ TUẦN LỄ THỜI TRANG</span>
        </div>

        {/* Bottom Statement Quote */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(30px, 5vw, 60px)",
            left: "clamp(24px, 4vw, 56px)",
            right: "clamp(24px, 4vw, 56px)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 4.5vw, 54px)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              color: "#F4F0E8",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: "800px",
            }}
          >
            NÀNG KHÔNG ĐI THEO KHOẢNH KHẮC.
            <br />
            <span style={{ color: "#C8B79C", fontStyle: "italic" }}>NÀNG ĐỊNH NGHĨA NÓ.</span>
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "16px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: isHovered ? "#C8B79C" : "rgba(244, 240, 232, 0.4)",
              transition: "color 0.4s ease",
            }}
          >
            <span>[ RÊ CHUỘT ĐỂ MỞ DẢI MÀU QUANG PHỔ ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
