import type { Metadata } from "next";
import { Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew"],
  weight: ["400", "700", "900"],
  variable: "--font-frank-ruhl",
});

export const metadata: Metadata = {
  title: "מפת 3 חודשים אישית | גלית גרינשטיין",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={frankRuhl.variable}>
      <body className="bg-[#f5f0ea] min-h-screen">{children}</body>
    </html>
  );
}
