import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BDPriceGear - Best Price Comparison",
  description: "Find the best deals and compare prices across multiple stores in Bangladesh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 min-h-screen`}
      >
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
