import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "OLIUS — Nghệ Thuật Túi Xách Da Thủ Công Xa Xỉ | Haute Maroquinerie Paris",
  description: "Khám phá bộ sưu tập túi xách da thủ công đỉnh cao OLIUS — da bê Ý Mill Box, da cá sấu quý hiếm, khóa mạ vàng 24K chế tác tại Paris. Triển lãm thời trang số tương tác 3D và boutique niêm yết giá.",
  keywords: ["OLIUS", "OLIUS Paris", "Túi xách cao cấp", "Túi da thủ công", "Thời trang xa xỉ", "Haute Maroquinerie", "Triển lãm túi xách 3D", "Boutique OLIUS"],
  openGraph: {
    title: "OLIUS — Nghệ Thuật Túi Xách Da Thủ Công Xa Xỉ",
    description: "Triển lãm thời trang số tương tác 3D & Boutique cao cấp. Da bê Ý, khóa mạ vàng 24K. Chế tác để lưu dấu vĩnh cửu.",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
