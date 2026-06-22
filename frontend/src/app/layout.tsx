import type { Metadata } from "next";
import "../i18n";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar/Navbar";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { AuthProvider } from "@/src/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Breezy",
  description: "Un réseau social léger et réactif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-200 dark:bg-gray-900 transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-[#121212] shadow-2xl relative transition-colors duration-300">
              <main className="pb-20">
                {children}
              </main>
              <Navbar />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}