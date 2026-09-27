"use client";

import { useEffect, useRef, useState } from "react";

export default function AtelierSection() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState({ years: 0, collections: 0, artisans: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Counter animations
          const duration = 2000;
          const startTime = performance.now();

          const animateCounters = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts({
              years: Math.floor(easeProgress * 24),
              collections: Math.floor(easeProgress * 17),
              artisans: Math.floor(easeProgress * 8),
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounters);
            } else {
              setCounts({ years: 24, collections: 17, artisans: 8 });
            }
          };

          requestAnimationFrame(animateCounters);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id="atelier"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#080808",
        padding: "clamp(95px, 13vh, 160px) clamp(24px, 5vw, 64px)",
        borderTop: "1px solid rgba(200, 183, 156, 0.15)",
        overflow: "hidden",
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200, 183, 156, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vh, 80px)" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.4em",
              color: "#C8B79C",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "12px",
            }}
          >
            THÁNH ĐỊA NGHỆ THUẬT THỦ CÔNG
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "0.12em",
              fontWeight: 300,
              color: "#F4F0E8",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            NƠI VẬT LIỆU
            <br />
            <span style={{ fontStyle: "italic", color: "#C8B79C" }}>HÓA THÀNH BẢN SẮC</span>
          </h2>
        </div>

        {/* Dual Layout: Workshop Imagery + Editorial Story */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(36px, 6vw, 80px)",
            alignItems: "center",
          }}
        >
          {/* Artisan Workshop Image */}
          <div
            data-cursor="explore"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(200, 183, 156, 0.2)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
            }}
          >
            <img
              src="/assets/atelier_artisan.jpg"
              alt="Master leather artisan in Florence workshop hand-stitching OLIUS handbag"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "20px",
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "#F4F0E8",
                backgroundColor: "rgba(10, 10, 10, 0.75)",
                padding: "4px 12px",
                borderRadius: "12px",
                backdropFilter: "blur(6px)",
              }}
            >
              VIA DEI TESSITORI · FIRENZE
            </div>
          </div>

          {/* Editorial Text & Numbers */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(244, 240, 232, 0.85)",
                letterSpacing: "0.02em",
              }}
            >
              Mỗi đường nét đều được phác thảo với chủ đích. Từng đường kim mũi chỉ là kết tinh của phản xạ cơ bắp truyền qua ba thế hệ nghệ nhân đồ da bậc thầy vùng Tuscany. Chúng tôi từ chối sản xuất đại trà để tạo nên những tác phẩm độc bản trường tồn cùng thời gian.
            </p>

            {/* Counter Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                borderTop: "1px solid rgba(200, 183, 156, 0.2)",
                paddingTop: "28px",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(36px, 4.5vw, 60px)",
                    fontWeight: 300,
                    color: "#C8B79C",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {String(counts.years).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(244, 240, 232, 0.5)",
                    textTransform: "uppercase",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  NĂM DI SẢN
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(36px, 4.5vw, 60px)",
                    fontWeight: 300,
                    color: "#C8B79C",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {String(counts.collections).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(244, 240, 232, 0.5)",
                    textTransform: "uppercase",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  BỘ SƯU TẬP TUYỂN CHỌN
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(36px, 4.5vw, 60px)",
                    fontWeight: 300,
                    color: "#C8B79C",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {String(counts.artisans).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(244, 240, 232, 0.5)",
                    textTransform: "uppercase",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  NGHỆ NHÂN BẬC THẦY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
