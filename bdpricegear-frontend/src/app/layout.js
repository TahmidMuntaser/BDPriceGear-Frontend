import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/AuthContext";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Suspense fallback={
            <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 h-16"></div>
            </nav>
          }>
            <Navbar />
          </Suspense>
          <main className="relative flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
