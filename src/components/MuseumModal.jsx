"use client";

import { useEffect, useState } from "react";

export default function MuseumModal({ exhibitId, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!exhibitId) return null;

  const catalog = {
    noir: {
      name: "OLIUS NOIR 01 — KIẾN TRÚC BÓNG TỐI",
      edition: "KIỆT TÁC 01 / 03",
      category: "TÚI XÁCH TAY / DA BÊ MILL BOX / VÀNG 24K",
      tagline: "Kiến trúc của bóng tối & sự im lặng sang trọng.",
      description: "Được chế tác từ da bê vân hạt Mill Box tuyển chọn từ các xưởng thuộc da danh tiếng vùng Tuscany. Phom dáng hình học cứng cáp, góc cắt sắc nét tôn vinh vẻ đẹp tự tin, quyền lực của người phụ nữ hiện đại.",
      material: "Da Bê Mill Box & Lót Nhung Cừu",
      craft: "Khóa Kim Loại Mạ Vàng 24K PVD",
      year: "2026",
      origin: "Tuscany, Ý & Hà Nội, Việt Nam",
      image: "/assets/hero_bag_noir_cutout.png",
    },
    eclat: {
      name: "OLIUS ÉCLAT 02 — ÁNH SÁNG BAN MAI",
      edition: "KIỆT TÁC 02 / 03",
      category: "TÚI XÁCH TAY / DA BÊ CHAMPAGNE / VÀNG NHẠT",
      tagline: "Ánh sáng ngưng đọng trên từng thớ da mềm mại.",
      description: "Tông màu champagne beige thanh khiết phản chiếu vẻ đẹp tinh khôi và sang trọng. Chi tiết kim loại mạ vàng nhạt được đánh bóng thủ công, tạo nên điểm nhấn bắt trọn mọi ánh nhìn trong những buổi dạ tiệc.",
      material: "Da Bê Mịn Champagne & Kim Loại",
      craft: "Gia Công Viền Thủ Công 38 Giờ",
      year: "2026",
      origin: "Tuscany, Ý & Hà Nội, Việt Nam",
      image: "/assets/bag_eclat_cutout.png",
    },
    rose: {
      name: "OLIUS ROSE 03 — TUYÊN NGÔN DỊU DÀNG",
      edition: "KIỆT TÁC 03 / 03",
      category: "TÚI XÁCH TAY / DUSTY ROSE / VÀNG CHAMPAGNE",
      tagline: "Tuyên ngôn của sự dịu dàng không khoan nhượng.",
      description: "Sắc hồng dusty rose đằm thắm kết hợp cùng chất da bê mềm như lụa. Khóa bấm kim loại mạ vàng champagne mờ mang lại cảm giác hoài cổ mà thời thượng cho những quý cô yêu cái đẹp tinh tế.",
      material: "Da Bê Dusty Rose & Nhung Suede",
      craft: "Khóa Vàng Champagne Mờ Độc Bản",
      year: "2026",
      origin: "Tuscany, Ý & Hà Nội, Việt Nam",
      image: "/assets/bag_rose_cutout.png",
    },
    handbag: {
      name: "OLIUS NOIR 01 — KIẾN TRÚC BÓNG TỐI",
      edition: "KIỆT TÁC 01 / 03",
      category: "TÚI XÁCH TAY / DA BÊ MILL BOX / VÀNG 24K",
      tagline: "Kiến trúc của bóng tối & sự im lặng sang trọng.",
      description: "Được chế tác từ da bê vân hạt Mill Box tuyển chọn từ các xưởng thuộc da danh tiếng vùng Tuscany. Phom dáng hình học cứng cáp, góc cắt sắc nét tôn vinh vẻ đẹp tự tin, quyền lực của người phụ nữ hiện đại.",
      material: "Da Bê Mill Box & Lót Nhung Cừu",
      craft: "Khóa Kim Loại Mạ Vàng 24K PVD",
      year: "2026",
      origin: "Tuscany, Ý & Hà Nội, Việt Nam",
      image: "/assets/hero_bag_noir_cutout.png",
    },
  };

  const item = catalog[exhibitId] || catalog.noir;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLensPos({ x, y });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99995,
        backgroundColor: "rgba(10, 10, 10, 0.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(24px, 4vh, 48px) clamp(24px, 5vw, 64px)",
        overflowY: "auto",
        animation: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Top Bar: Curatorial Header & Close Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(200, 183, 156, 0.2)",
          paddingBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "24px",
              letterSpacing: "0.2em",
              color: "#F4F0E8",
            }}
          >
            {item.name}
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "#C8B79C",
            }}
          >
            CHIÊM NGƯỠNG HIỆN VẬT
          </span>
        </div>

        <button
          onClick={onClose}
          data-cursor="pointer"
          aria-label="Close Museum View"
          style={{
            background: "transparent",
            border: "1px solid rgba(200, 183, 156, 0.4)",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            color: "#F4F0E8",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#C8B79C";
            e.currentTarget.style.color = "#0A0A0A";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#F4F0E8";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          ✕
        </button>
      </div>

      {/* Main Exhibition Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(30px, 6vw, 80px)",
          alignItems: "center",
          margin: "clamp(24px, 4vh, 48px) 0",
        }}
      >
        {/* Exhibit Visual with Interactive Loupe Zoom */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomLevel(1.5)}
          onMouseLeave={() => setZoomLevel(1)}
          data-cursor="view"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/3",
            maxHeight: "56vh",
            overflow: "hidden",
            borderRadius: "4px",
            border: "1px solid rgba(200, 183, 156, 0.25)",
            backgroundColor: "#050505",
            cursor: "crosshair",
          }}
        >
            {/* Soft Ambient Contact Shadow */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "70%",
                height: "30px",
                borderRadius: "50%",
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(200, 183, 156, 0.1) 40%, transparent 70%)",
                filter: "blur(12px)",
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
                padding: "24px",
                transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                transform: `scale(${zoomLevel})`,
                transition: zoomLevel === 1 ? "transform 0.4s ease" : "none",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))",
                position: "relative",
                zIndex: 2,
              }}
            />

          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "20px",
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(244, 240, 232, 0.6)",
              backgroundColor: "rgba(10, 10, 10, 0.8)",
              padding: "4px 10px",
              borderRadius: "12px",
            }}
          >
            {zoomLevel > 1 ? "ĐANG BẬT KÍNH LÚP [1.5X]" : "RÊ CHUỘT ĐỂ PHÓNG TO CHI TIẾT"}
          </div>
        </div>

        {/* Museum Curatorial Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#C8B79C",
                display: "block",
                marginBottom: "8px",
              }}
            >
              {item.category}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 4.5vw, 56px)",
                fontWeight: 300,
                letterSpacing: "0.1em",
                color: "#F4F0E8",
                margin: 0,
              }}
            >
              {item.name}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(18px, 2vw, 24px)",
                color: "rgba(200, 183, 156, 0.9)",
                marginTop: "6px",
              }}
            >
              "{item.tagline}"
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
            {item.description}
          </p>

          {/* Curatorial Spec Sheet */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              borderTop: "1px solid rgba(200, 183, 156, 0.15)",
              borderBottom: "1px solid rgba(200, 183, 156, 0.15)",
              padding: "20px 0",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#C8B79C",
                  display: "block",
                }}
              >
                CHẤT LIỆU
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "#F4F0E8",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {item.material}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#C8B79C",
                  display: "block",
                }}
              >
                KỸ NGHỆ
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "#F4F0E8",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {item.craft}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#C8B79C",
                  display: "block",
                }}
              >
                NĂM SÁNG TÁC
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "#F4F0E8",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {item.year}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  color: "#C8B79C",
                  display: "block",
                }}
              >
                XUẤT XỨ XƯỞNG
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "#F4F0E8",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                {item.origin}
              </span>
            </div>
          </div>

          {/* Luxury Action (No Buy Now, pure curation) */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              onClick={onClose}
              data-cursor="explore"
              style={{
                backgroundColor: "#C8B79C",
                color: "#0A0A0A",
                border: "none",
                borderRadius: "24px",
                padding: "14px 32px",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "0.25em",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.3s ease, background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              KHÁM PHÁ CHI TIẾT →
            </button>

            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(244, 240, 232, 0.4)",
              }}
            >
              LƯU TRỮ ẤN BẢN 2026
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Spec Note */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-sans)",
          fontSize: "10px",
          letterSpacing: "0.25em",
          color: "rgba(244, 240, 232, 0.35)",
          borderTop: "1px solid rgba(200, 183, 156, 0.15)",
          paddingTop: "16px",
        }}
      >
        <span>VIỆN LƯU TRỮ SỐ OLIUS</span>
        <span>NHẤN ESC HOẶC ✕ ĐỂ ĐÓNG</span>
      </div>
    </div>
  );
}
