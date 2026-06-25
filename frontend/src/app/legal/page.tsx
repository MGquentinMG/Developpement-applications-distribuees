"use client";
import { useTranslation } from "react-i18next";
import "../../i18n";
import BackButton from "../../components/BackButton/BackButton";
import AccordionItem from "../../components/AccordionItem/AccordionItem";
import Navbar from "../../components/Navbar/Navbar";
export default function LegalPage() {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <aside className="hidden lg:block w-[350px] shrink-0" />
      <div className="flex-1 flex justify-center w-full min-h-screen">
        <main className="w-full max-w-3xl min-h-screen bg-white dark:bg-[#121212] border-x border-gray-100 dark:border-gray-800 pb-10 transition-colors duration-300 px-4 md:px-6">
          <div className="flex items-center justify-between px-2 py-4 sticky top-0 bg-white dark:bg-[#121212] z-10 border-b border-gray-100 dark:border-gray-800 mb-6 transition-colors duration-300">
            <div className="w-10">
              <BackButton />
            </div>
            <div className="bg-[#EAE5F3] dark:bg-[#2A2438] px-6 py-2 rounded-xl transition-colors duration-300">
              <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-sm transition-colors duration-300">{t("legal.title")}</h1>
            </div>
            <div className="w-10"></div>
          </div>
          <div className="flex flex-col gap-2">
            <AccordionItem title={t("legal.section1")} defaultOpen={true} variant="legal">
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 mb-4 transition-colors duration-300">
                {t("legal.section1_intro")}
              </p>
              <ul className="list-disc pl-5 text-sm text-[#1E1E40] dark:text-gray-300 flex flex-col gap-4 mb-4 transition-colors duration-300">
                <li>{t("legal.section1_li1")}</li>
                <li>{t("legal.section1_li2")}</li>
              </ul>
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">
                {t("legal.section1_outro")}
              </p>
            </AccordionItem>

            <AccordionItem title={t("legal.section2")} variant="legal">
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 mb-4 transition-colors duration-300">
                {t("legal.section2_intro")}
              </p>
              <ul className="list-disc pl-5 text-sm text-[#1E1E40] dark:text-gray-300 flex flex-col gap-4 mb-4 transition-colors duration-300">
                <li>{t("legal.section2_li1")}</li>
                <li>{t("legal.section2_li2")}</li>
                <li>{t("legal.section2_li3")}</li>
              </ul>
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">
                {t("legal.section2_outro")}
              </p>
            </AccordionItem>

            <AccordionItem title={t("legal.section3")} variant="legal">
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 mb-4 transition-colors duration-300">
                {t("legal.section3_intro")}
              </p>
              <ul className="list-disc pl-5 text-sm text-[#1E1E40] dark:text-gray-300 flex flex-col gap-4 mb-4 transition-colors duration-300">
                <li>{t("legal.section3_li1")}</li>
                <li>{t("legal.section3_li2")}</li>
                <li>{t("legal.section3_li3")}</li>
              </ul>
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">
                {t("legal.section3_outro")}
              </p>
            </AccordionItem>

            <AccordionItem title={t("legal.section4")} variant="legal">
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 mb-4 transition-colors duration-300">
                {t("legal.section4_intro")}
              </p>
              <ul className="list-disc pl-5 text-sm text-[#1E1E40] dark:text-gray-300 flex flex-col gap-4 mb-4 transition-colors duration-300">
                <li>{t("legal.section4_li1")}</li>
                <li>{t("legal.section4_li2")}</li>
                <li>{t("legal.section4_li3")}</li>
              </ul>
              <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">
                {t("legal.section4_outro")}
              </p>
            </AccordionItem>
          </div>
        </main>
      </div>
      <Navbar />
    </div>
  );
}