import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar/Navbar";

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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="pb-20 sm:pb-0">
          {children}
        </div>
        <Navbar />
      </body>
    </html>
  );
}