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
      <body className={`${inter.className} bg-gray-200`}>
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative">
          <main className="pb-20"> 
            {children}
          </main>
          <Navbar />
        </div>
      </body>
    </html>
  );
}