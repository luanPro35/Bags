"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";

export default function BoutiquePage() {
  const [currency, setCurrency] = useState("VND"); // VND | USD | EUR
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [initials, setInitials] = useState("O.P");
  const [stampStyle, setStampStyle] = useState("gold"); // gold | blind

  // Form states for VIP reservation
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [packagingOption, setPackagingOption] = useState("lacquer");

  const products = [
    {
      id: "noir",
      num: "01",
      code: "OLS-NR-01",
      name: "OLIUS NOIR 01",
      frenchTitle: "Le Sac Obscur",
      tag: "KIỆT TÁC BIỂU TƯỢNG",
      category: "calfskin",
      prices: { VND: 118000000, USD: 4850, EUR: 4450 },
      material: "Da Bê Ý Vân Mill Box",
      hardware: "Khóa Xoay Mạ Vàng 24K Chải Xước",
      lining: "Nhung Cừu Đỏ Rượu Burgundy",
      dimensions: "25 × 17 × 8 cm",
      edition: "Giới hạn 12 chiếc/mùa",
      image: "/assets/hero_bag_noir.jpg",
      description: "Được tôi luyện từ thớ da bê Ý Mill Box góc cạnh và sắc nét. Mặt trước chần bông quả trám Matelassé kết hợp quai xách điêu khắc tạo nên vẻ đẹp bí ẩn, quyền uy và trường tồn.",
    },
    {
      id: "eclat",
      num: "02",
      code: "OLS-EC-02",
      name: "OLIUS ÉCLAT 02",
      frenchTitle: "La Lumière Dorée",
      tag: "ĐỘC BẢN DẠ TIỆC",
      category: "calfskin",
      prices: { VND: 135000000, USD: 5500, EUR: 5050 },
      material: "Da Bê Mịn Hạt Champagne",
      hardware: "Khóa Bấm Vàng Nhạt Đánh Bóng Gương",
      lining: "Lụa Tơ Tằm Màu Kem Ngà",
      dimensions: "24 × 16 × 7 cm",
      edition: "Giới hạn 8 chiếc/mùa",
      image: "/assets/bag_eclat.jpg",
      description: "Bắt trọn ánh hào quang của những đêm dạ tiệc xa hoa. Tông màu champagne beige kết hợp chi tiết kim loại lộng lẫy và kỹ thuật gấp nếp da thủ công đỉnh cao Paris.",
    },
    {
      id: "rose",
      num: "03",
      code: "OLS-RS-03",
      name: "OLIUS ROSE 03",
      frenchTitle: "La Vie En Rose",
      tag: "SẮC HỒNG PHÁP",
      category: "nappa",
      prices: { VND: 125000000, USD: 5100, EUR: 4700 },
      material: "Da Nappa Mềm Sắc Dusty Rose",
      hardware: "Phụ Kiện Mạ Vàng Hồng 18K Mờ",
      lining: "Nhung Da Lộn Suede Êm Ái",
      dimensions: "22 × 15 × 6 cm",
      edition: "Giới hạn 10 chiếc/mùa",
      image: "/assets/bag_rose.jpg",
      description: "Dành riêng cho những tâm hồn duy mỹ yêu chuộng vẻ đẹp thơ mộng. Chất da nappa mềm tựa lụa được gia công tỉ mỉ suốt 38 giờ dưới bàn tay nghệ nhân bậc thầy vùng Tuscany.",
    },
    {
      id: "celeste",
      num: "04",
      code: "OLS-CL-04",
      name: "OLIUS CÉLESTE 04",
      frenchTitle: "Le Bleu Nuit Croco",
      tag: "DA CÁ SẤU QUÝ HIẾM",
      category: "croco",
      prices: { VND: 165000000, USD: 6750, EUR: 6200 },
      material: "Da Cá Sấu Niloticus Xanh Bóng Đêm",
      hardware: "Ổ Khóa Nạm Đá Sapphire & Vàng Trắng Au750",
      lining: "Da Cừu Chevre Pháp",
      dimensions: "28 × 20 × 10 cm",
      edition: "Độc bản 5 chiếc toàn cầu",
      image: "/assets/bag_celeste.jpg",
      description: "Tuyệt tác da cá sấu quý hiếm được xử lý qua 28 công đoạn đánh bóng đá mã não truyền thống. Sắc xanh bóng đêm huyền bí cùng ổ khóa trang sức nạm đá sapphire cao cấp.",
    },
    {
      id: "vendome",
      num: "05",
      code: "OLS-VD-05",
      name: "OLIUS VENDÔME 05",
      frenchTitle: "Édition Spéciale",
      tag: "PHIÊN BẢN GIỚI HẠN 07/12",
      category: "limited",
      prices: { VND: 185000000, USD: 7600, EUR: 7000 },
      material: "Da Thuộc Thảo Mộc Pháp Màu Cognac Gold",
      hardware: "Dây Xích Đúc Nguyên Khối & Khóa Xoay 24K",
      lining: "Nhung Tơ Tằm Hoàng Gia",
      dimensions: "26 × 18 × 9 cm",
      edition: "Giới hạn 6 chiếc/năm",
      image: "/assets/bag_vendome.jpg",
      description: "Biểu tượng tối thượng của nghệ thuật làm đồ da Paris. Chất da thuộc thảo mộc tự nhiên thơm ngát càng dùng càng bóng đẹp theo thời gian cùng dây xích đúc thủ công tinh xảo.",
    },
    {
      id: "soiree",
      num: "06",
      code: "OLS-SR-06",
      name: "OLIUS SOIRÉE 06",
      frenchTitle: "Petite Pochette",
      tag: "TÚI DẠ TIỆC MINI",
      category: "nappa",
      prices: { VND: 68000000, USD: 2800, EUR: 2550 },
      material: "Da Bê Đen Tuyền Ép Bóng",
      hardware: "Khóa Monogram OLIUS Mạ Vàng 24K",
      lining: "Lụa Satin Đen Tuyền",
      dimensions: "19 × 12 × 5 cm",
      edition: "Giới hạn 20 chiếc/mùa",
      image: "/assets/editorial_campaign.jpg",
      description: "Mẫu clutch đeo chéo thanh thoát, tôn vinh thần thái yêu kiều trong từng sải bước. Dây xích vàng tháo rời linh hoạt biến đổi từ túi đeo vai sang clutch dạ hội sang trọng.",
    },
  ];

  const formatPrice = (priceObj) => {
    const val = priceObj[currency];
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN").format(val) + " ₫";
    } else if (currency === "USD") {
      return "$" + new Intl.NumberFormat("en-US").format(val);
    } else {
      return "€" + new Intl.NumberFormat("de-DE").format(val);
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenOrder = (product) => {
    setSelectedProductForOrder(product);
    setOrderSubmitted(false);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
  };

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        color: "#F4F0E8",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <CustomCursor />

      {/* Boutique Top Navigation Bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "rgba(10, 10, 10, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(200, 183, 156, 0.2)",
          padding: "16px clamp(20px, 4vw, 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back to 3D Showroom */}
        <Link
          href="/"
          data-cursor="pointer"
          style={{
            textDecoration: "none",
            color: "rgba(244, 240, 232, 0.8)",
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            letterSpacing: "0.22em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8B79C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 240, 232, 0.8)")}
        >
          <span>←</span>
          <span>TRIỂN LÃM 3D SHOWROOM</span>
        </Link>

        {/* Central Brand */}
        <Link
          href="/"
          data-cursor="pointer"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            letterSpacing: "0.35em",
            color: "#F4F0E8",
            fontWeight: 400,
            textIndent: "0.35em",
          }}
        >
          OLIUS
        </Link>

        {/* Currency Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(200, 183, 156, 0.7)",
              marginRight: "4px",
            }}
          >
            TIỀN TỆ:
          </span>
          {["VND", "USD", "EUR"].map((curr) => {
            const isActive = currency === curr;
            return (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                data-cursor="pointer"
                style={{
                  background: isActive ? "rgba(200, 183, 156, 0.25)" : "transparent",
                  border: isActive ? "1px solid #C8B79C" : "1px solid rgba(255, 255, 255, 0.15)",
                  color: isActive ? "#F4F0E8" : "rgba(244, 240, 232, 0.55)",
                  padding: "4px 10px",
                  borderRadius: "14px",
                  fontSize: "10px",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                {curr === "VND" ? "₫ VNĐ" : curr === "USD" ? "$ USD" : "€ EUR"}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Boutique Container */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(40px, 6vh, 80px) clamp(20px, 4vw, 56px)" }}>
        {/* Boutique Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vh, 72px)" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "0.45em",
              color: "#C8B79C",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "12px",
            }}
          >
            BOUTIQUE & HAUTE MAROQUINERIE · PARIS
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(32px, 5.5vw, 68px)",
              letterSpacing: "0.15em",
              fontWeight: 300,
              color: "#F4F0E8",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            BỘ SƯU TẬP TÚI XÁCH & BÁO GIÁ NIÊM YẾT
          </h1>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2vw, 22px)",
              color: "rgba(200, 183, 156, 0.9)",
              maxWidth: "760px",
              margin: "18px auto 0",
              lineHeight: 1.6,
            }}
          >
            &ldquo;Mỗi tạo tác OLIUS là một tác phẩm điêu khắc độc bản được chế tác thủ công từ các loại da quý hiếm nhất thế giới và phụ kiện mạ vàng 24K.&rdquo;
          </p>
        </div>

        {/* Personalized Monogram Interactive Feature */}
        <div
          style={{
            backgroundColor: "rgba(18, 18, 18, 0.75)",
            border: "1px solid rgba(200, 183, 156, 0.25)",
            borderRadius: "16px",
            padding: "24px clamp(20px, 4vw, 40px)",
            marginBottom: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "#E8C872",
                display: "block",
                marginBottom: "4px",
              }}
            >
              ✦ ĐẶC QUYỀN THƯỢNG KHÁCH
            </span>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "20px",
                color: "#F4F0E8",
                fontWeight: 400,
                margin: 0,
              }}
            >
              Chạm Khắc Chữ Viết Tắt Cá Nhân Hóa (Monogram Hot-Stamping)
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "rgba(244, 240, 232, 0.6)",
                marginTop: "6px",
                maxWidth: "600px",
              }}
            >
              Mỗi chiếc túi OLIUS được tặng kèm dịch vụ dập chữ nhũ vàng 24K lên tag da clochette bởi nghệ nhân chuyên biệt.
            </p>
          </div>

          {/* Interactive Monogram Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "90px",
                height: "60px",
                backgroundColor: "#161616",
                border: "1px solid rgba(200, 183, 156, 0.4)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(0,0,0,0.6)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "20px",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: stampStyle === "gold" ? "#F5D061" : "rgba(244, 240, 232, 0.5)",
                  textShadow: stampStyle === "gold" ? "0 0 10px rgba(245, 208, 97, 0.6)" : "none",
                }}
              >
                {initials || "O.P"}
              </span>
              <span style={{ fontSize: "8px", color: "rgba(200, 183, 156, 0.6)", letterSpacing: "0.1em" }}>
                PARIS
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <input
                type="text"
                maxLength={4}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="Nhập chữ cái (ví dụ: K.L)"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(200, 183, 156, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  color: "#F4F0E8",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  outline: "none",
                  width: "160px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setStampStyle("gold")}
                  style={{
                    background: stampStyle === "gold" ? "rgba(200, 183, 156, 0.3)" : "transparent",
                    border: "1px solid rgba(200, 183, 156, 0.4)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    color: "#F5D061",
                    fontSize: "9px",
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                  }}
                >
                  Nhũ Vàng 24K
                </button>
                <button
                  type="button"
                  onClick={() => setStampStyle("blind")}
                  style={{
                    background: stampStyle === "blind" ? "rgba(200, 183, 156, 0.3)" : "transparent",
                    border: "1px solid rgba(200, 183, 156, 0.4)",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    color: "#F4F0E8",
                    fontSize: "9px",
                    fontFamily: "var(--font-sans)",
                    cursor: "pointer",
                  }}
                >
                  Dập Chìm Tự Nhiên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px",
            borderBottom: "1px solid rgba(200, 183, 156, 0.15)",
            paddingBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { id: "all", label: "TẤT CẢ TÁC PHẨM (6)" },
              { id: "calfskin", label: "DA BÊ Ý MILL BOX" },
              { id: "nappa", label: "DA NAPPA MỀM" },
              { id: "croco", label: "DA CÁ SẤU QUÝ HIẾM" },
              { id: "limited", label: "PHIÊN BẢN GIỚI HẠN" },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  data-cursor="pointer"
                  style={{
                    background: isSelected ? "rgba(200, 183, 156, 0.22)" : "transparent",
                    border: isSelected ? "1px solid #C8B79C" : "1px solid rgba(255, 255, 255, 0.12)",
                    color: isSelected ? "#F4F0E8" : "rgba(244, 240, 232, 0.6)",
                    padding: "7px 16px",
                    borderRadius: "20px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "rgba(200, 183, 156, 0.7)",
              letterSpacing: "0.15em",
            }}
          >
            HIỂN THỊ {filteredProducts.length} TÁC PHẨM HOÀN MỸ
          </span>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "clamp(24px, 4vw, 44px)",
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: "#111113",
                border: "1px solid rgba(200, 183, 156, 0.2)",
                borderRadius: "14px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.6)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 24px 60px rgba(0, 0, 0, 0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(200, 183, 156, 0.2)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Product Image Stage */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  backgroundColor: "#080808",
                  overflow: "hidden",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Badge Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    backgroundColor: "rgba(10, 10, 10, 0.85)",
                    border: "1px solid rgba(200, 183, 156, 0.35)",
                    borderRadius: "16px",
                    padding: "4px 12px",
                    fontSize: "9px",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.2em",
                    color: "#C8B79C",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {p.tag}
                </div>

                {/* Edition Number */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    backgroundColor: "rgba(10, 10, 10, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "4px 10px",
                    fontSize: "9px",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.15em",
                    color: "rgba(244, 240, 232, 0.65)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {p.edition}
                </div>
              </div>

              {/* Product Info Content */}
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  gap: "20px",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        letterSpacing: "0.25em",
                        color: "#C8B79C",
                      }}
                    >
                      {p.code}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        color: "rgba(244, 240, 232, 0.45)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {p.dimensions}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "24px",
                      letterSpacing: "0.1em",
                      color: "#F4F0E8",
                      margin: "6px 0 2px",
                      fontWeight: 400,
                    }}
                  >
                    {p.name}
                  </h2>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "14px",
                      color: "rgba(200, 183, 156, 0.85)",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    {p.frenchTitle}
                  </span>

                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: "rgba(244, 240, 232, 0.68)",
                      margin: "0 0 16px",
                    }}
                  >
                    {p.description}
                  </p>

                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.35)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      fontSize: "11px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(200, 183, 156, 0.8)" }}>Chất liệu:</span>
                      <span style={{ color: "#F4F0E8" }}>{p.material}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(200, 183, 156, 0.8)" }}>Phụ kiện:</span>
                      <span style={{ color: "#F4F0E8" }}>{p.hardware}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Order Buttons */}
                <div
                  style={{
                    borderTop: "1px solid rgba(200, 183, 156, 0.15)",
                    paddingTop: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        color: "rgba(244, 240, 232, 0.5)",
                        textTransform: "uppercase",
                      }}
                    >
                      GIÁ NIÊM YẾT:
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "24px",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        color: "#E8C872",
                      }}
                    >
                      {formatPrice(p.prices)}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button
                      onClick={() => handleOpenOrder(p)}
                      data-cursor="pointer"
                      style={{
                        background: "linear-gradient(135deg, rgba(200, 183, 156, 0.3) 0%, rgba(200, 183, 156, 0.1) 100%)",
                        border: "1px solid #C8B79C",
                        color: "#F4F0E8",
                        padding: "10px 14px",
                        borderRadius: "20px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
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
                      SỞ HỮU TÁC PHẨM
                    </button>

                    <Link
                      href="/#hero"
                      data-cursor="explore"
                      style={{
                        textDecoration: "none",
                        background: "transparent",
                        border: "1px solid rgba(255, 255, 255, 0.18)",
                        color: "rgba(244, 240, 232, 0.8)",
                        padding: "10px 14px",
                        borderRadius: "20px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        cursor: "pointer",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C8B79C";
                        e.currentTarget.style.color = "#F4F0E8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                        e.currentTarget.style.color = "rgba(244, 240, 232, 0.8)";
                      }}
                    >
                      <span>XEM 3D</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Haute Couture VIP Concierge Reservation Modal */}
      {selectedProductForOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedProductForOrder(null)}
        >
          <div
            style={{
              backgroundColor: "#111113",
              border: "1px solid rgba(200, 183, 156, 0.4)",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "clamp(24px, 4vh, 40px)",
              position: "relative",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProductForOrder(null)}
              data-cursor="pointer"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#F4F0E8",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {!orderSubmitted ? (
              <form onSubmit={handleConfirmOrder}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    color: "#C8B79C",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  PHIẾU YÊU CẦU ĐẶT HÀNG CAO CẤP · OLIUS PARIS
                </span>

                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "26px",
                    color: "#F4F0E8",
                    fontWeight: 400,
                    margin: "0 0 4px",
                  }}
                >
                  {selectedProductForOrder.name}
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "#E8C872",
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "20px",
                  }}
                >
                  Giá niêm yết: {formatPrice(selectedProductForOrder.prices)}
                </span>

                {/* Packaging selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      color: "rgba(200, 183, 156, 0.8)",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    LỰA CHỌN QUY CÁCH ĐÓNG GÓI HOÀNG GIA:
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { id: "lacquer", title: "Hộp Sơn Mài OLIUS & Khăn Lụa Tơ Tằm", sub: "Khắc tên người nhận mạ vàng kèm chứng thư độc bản" },
                      { id: "leather", title: "Hộp Bọc Da Nhập Khẩu & Ruy Băng Vàng", sub: "Kèm bao túi lót nhung chống ẩm chuyên biệt" },
                    ].map((pack) => (
                      <div
                        key={pack.id}
                        onClick={() => setPackagingOption(pack.id)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: packagingOption === pack.id ? "1px solid #C8B79C" : "1px solid rgba(255,255,255,0.1)",
                          backgroundColor: packagingOption === pack.id ? "rgba(200, 183, 156, 0.12)" : "rgba(0,0,0,0.3)",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#F4F0E8", fontWeight: 500 }}>{pack.title}</span>
                        <span style={{ fontSize: "10px", color: "rgba(244, 240, 232, 0.5)", display: "block" }}>{pack.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer input fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "rgba(244, 240, 232, 0.7)", display: "block", marginBottom: "4px" }}>
                      Họ và Tên Quý Khách *
                    </label>
                    <input
                      required
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ví dụ: Bà Hoàng Ngọc Anh"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(200, 183, 156, 0.3)",
                        borderRadius: "8px",
                        color: "#F4F0E8",
                        outline: "none",
                        fontSize: "12px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", color: "rgba(244, 240, 232, 0.7)", display: "block", marginBottom: "4px" }}>
                      Số Điện Thoại / Zalo VIP *
                    </label>
                    <input
                      required
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ví dụ: 0988 123 456"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(200, 183, 156, 0.3)",
                        borderRadius: "8px",
                        color: "#F4F0E8",
                        outline: "none",
                        fontSize: "12px",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", color: "rgba(244, 240, 232, 0.7)", display: "block", marginBottom: "4px" }}>
                      Lời Nhắn Riêng Cho Nghệ Nhân (Tùy chọn)
                    </label>
                    <textarea
                      rows={2}
                      value={clientNote}
                      onChange={(e) => setClientNote(e.target.value)}
                      placeholder="Ghi chú về khắc tên, địa điểm nhận hoặc hẹn giờ chuyên viên tư vấn riêng..."
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(200, 183, 156, 0.3)",
                        borderRadius: "8px",
                        color: "#F4F0E8",
                        outline: "none",
                        fontSize: "12px",
                        resize: "none",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  data-cursor="pointer"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #C8B79C 0%, #A89575 100%)",
                    border: "none",
                    borderRadius: "24px",
                    padding: "14px",
                    color: "#0A0A0A",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, filter 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1.0)")}
                >
                  XÁC NHẬN GỬI YÊU CẦU SỞ HỮU ➔
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: "2px solid #C8B79C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    color: "#E8C872",
                    fontSize: "24px",
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "26px",
                    color: "#F4F0E8",
                    margin: "0 0 8px",
                  }}
                >
                  YÊU CẦU ĐÃ ĐƯỢC TIẾP NHẬN
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "rgba(244, 240, 232, 0.7)",
                    lineHeight: 1.6,
                    maxWidth: "460px",
                    margin: "0 auto 24px",
                  }}
                >
                  Trân trọng cảm ơn quý khách <strong>{clientName || "Thượng Khách"}</strong>. Chuyên viên tư vấn riêng của Maison OLIUS sẽ liên hệ qua số <strong>{clientPhone}</strong> trong vòng 30 phút để xác nhận chi tiết chế tác và quy cách bàn giao tác phẩm <strong>{selectedProductForOrder.name}</strong>.
                </p>
                <button
                  onClick={() => setSelectedProductForOrder(null)}
                  data-cursor="pointer"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(200, 183, 156, 0.4)",
                    color: "#F4F0E8",
                    padding: "10px 24px",
                    borderRadius: "20px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                  }}
                >
                  HOÀN TẤT & ĐÓNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Boutique Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(200, 183, 156, 0.15)",
          padding: "40px clamp(20px, 4vw, 56px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          fontFamily: "var(--font-sans)",
          fontSize: "11px",
          color: "rgba(244, 240, 232, 0.45)",
          letterSpacing: "0.2em",
        }}
      >
        <span>© 2026 OLIUS PARIS. MAISON DE HAUTE MAROQUINERIE.</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <span>PARIS</span>
          <span>FLORENCE</span>
          <span>HÀ NỘI</span>
        </div>
      </footer>
    </div>
  );
}
