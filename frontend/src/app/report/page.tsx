"use client";
import { ReportForm } from "../../components/ReportCard/ReportForm";
import Navbar from "../../components/Navbar/Navbar";
export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />

      <main className="flex-1 w-full min-h-screen bg-[#F9F9FB] dark:bg-[#121212] border-x border-gray-200 dark:border-gray-800 flex items-center justify-center p-4 md:p-8 transition-colors duration-300">
        <ReportForm postId={params.id} />
      </main>

      <Navbar />
    </div>
  );
}