import type { Metadata } from "next";
import "../i18n";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import ChangePasswordGuard from "@/src/components/ChangePasswordGuard/ChangePasswordGuard";

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
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0b0b0c] transition-colors duration-300 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <AuthProvider>
            <ChangePasswordGuard />
            <div className="w-full min-h-screen transition-colors duration-300">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}