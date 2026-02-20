import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

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
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(31, 41, 55, 0.95)',
              color: '#fff',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '0.5rem',
              padding: '12px 16px',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(8px)',
            },
            success: {
              duration: 3000,
              style: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
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
