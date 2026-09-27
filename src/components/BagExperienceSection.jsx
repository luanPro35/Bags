"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BagExperienceSection({ onInspect }) {
  const containerRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      step: "01",
      title: "LỚP DA BÊ NGOÀI",
      subtitle: "Da Bê Mill Box Từ Vùng Tuscany",
      description: "Từng tấm da bê được tuyển chọn khắt khe từ vùng Tuscany nước Ý. Vân hạt tự nhiên, đàn hồi tuyệt hảo và phát triển lớp patina bóng bẩy theo năm tháng.",
      image: "/assets/hero_bag_noir_cutout.png",
      tag: "TUSCANY · Ý",
      zoom: "scale(1.25) translate(6%, -5%)",
    },
    {
      step: "02",
      title: "KHÓA KIM LOẠI MẠ VÀNG",
      subtitle: "Đồng Thau Mạ Vàng 24K Chải Xước",
      description: "Gia công từ đồng thau nguyên khối, mạ vàng 24K đa lớp bằng công nghệ PVD tiên tiến. Chống xước tuyệt đối và cho tiếng 'click' êm ái thỏa mãn.",
      image: "/assets/macro_hardware.jpg",
      tag: "MẠ VÀNG 24K · PVD",
      zoom: "scale(1.35) translate(-4%, 4%)",
    },
    {
      step: "03",
      title: "NỘI THẤT NHUNG DA CỪU",
      subtitle: "Lót Trong Lambskin Suede Siêu Mềm",
      description: "Lót trong toàn bộ bằng da cừu suede mềm mại, bảo vệ hoàn hảo từng món tư trang của Nàng. Tích hợp ngăn thẻ dập chìm số hiệu riêng biệt.",
      image: "/assets/macro_interior.jpg",
      tag: "LAMBSKIN SUEDE · Ý",
      zoom: "scale(1.22) translate(0%, -5%)",
    },
    {
      step: "04",
      title: "CẤU TRÚC HOÀN CHỈNH",
      subtitle: "Kiệt Tác Sau 38 Giờ Thủ Công",
      description: "Hơn 38 giờ lao động miệt mài của các nghệ nhân bậc thầy để kết hợp từng chi tiết thành một tác phẩm nghệ thuật hoàn chỉnh sẵn sàng đồng hành cùng Nàng.",
      image: "/assets/hero_bag_noir_cutout.png",
      tag: "38 GIỜ CHẾ TÁC · HOÀN THIỆN",
      zoom: "scale(1.05) translate(0%, 0%)",
    },
  ];

  const activeLayerRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=280%",
        pin: true,
        scrub: 1.8,
        anticipatePin: 1,
        fastScrollEnd: 1500,
        onUpdate: (self) => {
          const progress = self.progress;
          const newLayer = Math.min(Math.floor(progress * 4), 3);
          if (newLayer !== activeLayerRef.current) {
            activeLayerRef.current = newLayer;
            setActiveLayer(newLayer);
          }
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const current = layers[activeLayer];

  return (
    <section
      id="bag-experience"
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#080808",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(95px, 12vh, 125px) clamp(24px, 5vw, 64px) clamp(30px, 4vh, 48px)",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200, 183, 156, 0.07) 0%, rgba(8, 8, 8, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header & Layer Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 10,
          borderBottom: "1px solid rgba(200, 183, 156, 0.15)",
          paddingBottom: "20px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "#C8B79C",
              display: "block",
              marginBottom: "4px",
            }}
          >
            PHẦN 03 — GIẢI PHẪU TÚI XÁCH OLIUS
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3.5vw, 42px)",
              letterSpacing: "0.15em",
              fontWeight: 400,
              color: "#F4F0E8",
              margin: 0,
            }}
          >
            CẤU TRÚC TÚI DA NGHỆ THUẬT OLIUS
          </h2>
        </div>

        {/* Layer Pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {layers.map((layer, idx) => (
            <button
              key={layer.step}
              onClick={() => setActiveLayer(idx)}
              data-cursor="pointer"
              style={{
                background: activeLayer === idx ? "#C8B79C" : "rgba(200, 183, 156, 0.08)",
                color: activeLayer === idx ? "#0A0A0A" : "rgba(244, 240, 232, 0.6)",
                border: "1px solid rgba(200, 183, 156, 0.25)",
                borderRadius: "16px",
                padding: "6px 14px",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                fontWeight: activeLayer === idx ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              {layer.step} {layer.title.split(" ")[1] || layer.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(24px, 5vw, 64px)",
          alignItems: "center",
          flex: 1,
          zIndex: 10,
          margin: "clamp(10px, 1.6vh, 24px) 0",
        }}
      >
        {/* Handbag macro visual */}
        <div
          data-cursor="view"
          onClick={() => onInspect && onInspect("noir")}
          style={{
            position: "relative",
            width: "100%",
            maxHeight: "clamp(240px, 44vh, 420px)",
            aspectRatio: "1",
            overflow: "hidden",
            borderRadius: "4px",
            border: "1px solid rgba(200, 183, 156, 0.18)",
            backgroundColor: "#050505",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            key={current.image}
            src={current.image}
            alt={current.title}
            style={{
              width: "90%",
              height: "90%",
              objectFit: "contain",
              transform: current.zoom,
              transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8)) contrast(1.04) brightness(1.02)",
              willChange: "transform, filter",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "#C8B79C",
              backgroundColor: "rgba(10, 10, 10, 0.8)",
              padding: "4px 10px",
              borderRadius: "12px",
              border: "1px solid rgba(200, 183, 156, 0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            {current.tag}
          </div>
        </div>

        {/* Editorial storytelling */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "520px" }}>
          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                letterSpacing: "0.2em",
                color: "#C8B79C",
                fontWeight: 500,
              }}
            >
              TẦNG {current.step} / 04
            </span>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(28px, 3.8vw, 50px)",
                letterSpacing: "0.1em",
                color: "#F4F0E8",
                fontWeight: 400,
                marginTop: "4px",
                lineHeight: 1.15,
              }}
            >
              {current.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(16px, 1.9vw, 22px)",
                color: "rgba(200, 183, 156, 0.9)",
                marginTop: "6px",
              }}
            >
              {current.subtitle}
            </p>
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: 1.8,
              letterSpacing: "0.05em",
              color: "rgba(244, 240, 232, 0.75)",
            }}
          >
            {current.description}
          </p>

          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => onInspect && onInspect("noir")}
              data-cursor="explore"
              style={{
                background: "transparent",
                border: "1px solid #C8B79C",
                color: "#F4F0E8",
                padding: "12px 28px",
                borderRadius: "24px",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C8B79C";
                e.currentTarget.style.color = "#0A0A0A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#F4F0E8";
              }}
            >
              CHIÊM NGƯỠNG CHI TIẾT ↗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
