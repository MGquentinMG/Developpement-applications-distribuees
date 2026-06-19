"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import "../../i18n";
import Avatar from "../../components/Avatar/Avatar";
import AccordionItem from "../../components/AccordionItem/AccordionItem";
import BackButton from "../../components/BackButton/BackButton";
import Toggle from "../../components/Toggle/Toggle";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifShares, setNotifShares] = useState(false);
  const [notifFollows, setNotifFollows] = useState(true);

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] pb-32 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white dark:bg-[#121212] z-10 border-b border-gray-50 dark:border-gray-800 transition-colors duration-300">
        <div className="w-10">
          <BackButton />
        </div>
        <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-[19px]">{t("settings.title")}</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-6 flex items-center gap-4 mb-2">
        <div className="w-16 h-16 shrink-0">
          <Avatar />
        </div>
        <div className="flex flex-col">
          <span className="text-[#1E1E40] dark:text-[#F9F9FB] text-[19px] font-bold">User name</span>
          <button className="flex items-center text-[#8B7BB5] dark:text-[#A395DA] text-sm mt-0.5 hover:underline">
            {t("settings.editProfile")} <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="px-6 flex flex-col">
        <Link 
          href="#"
          className="flex items-center justify-between py-4 text-[#1E1E40] dark:text-[#F9F9FB] text-[17px] hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors"
        >
          <span>{t("settings.accountSettings")}</span>
          <ChevronRight size={20} className="text-[#1E1E40] dark:text-[#F9F9FB]" />
        </Link>

        <AccordionItem title={t("settings.appearance")} variant="settings">
          <div className="flex gap-4 px-2">
            <button 
              onClick={() => toggleTheme("light")}
              className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all ${
                theme === "light" 
                  ? "border-[#492775] text-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:border-[#D0C9E8]" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              {t("settings.themeLight")}
            </button>
            <button 
              onClick={() => toggleTheme("dark")}
              className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all ${
                theme === "dark" 
                  ? "border-[#492775] text-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:border-[#D0C9E8]" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              {t("settings.themeDark")}
            </button>
          </div>
        </AccordionItem>

        <AccordionItem title={t("settings.notification")} variant="settings">
          <div className="px-2">
            <Toggle label={t("settings.notifLikes")} checked={notifLikes} onChange={() => setNotifLikes(!notifLikes)} />
            <Toggle label={t("settings.notifComments")} checked={notifComments} onChange={() => setNotifComments(!notifComments)} />
            <Toggle label={t("settings.notifShares")} checked={notifShares} onChange={() => setNotifShares(!notifShares)} />
            <Toggle label={t("settings.notifFollows")} checked={notifFollows} onChange={() => setNotifFollows(!notifFollows)} />
          </div>
        </AccordionItem>

        <AccordionItem title={t("settings.language")} variant="settings">
          <div className="flex gap-4 px-2">
            <button 
              onClick={() => i18n.changeLanguage('fr')}
              className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all ${
                i18n.language === "fr" 
                  ? "border-[#492775] text-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:border-[#D0C9E8]" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              Français
            </button>
            <button 
              onClick={() => i18n.changeLanguage('en')}
              className={`flex-1 py-2.5 rounded-xl border-2 font-bold transition-all ${
                i18n.language === "en" 
                  ? "border-[#492775] text-[#492775] bg-[#F5F0FF] dark:bg-[#2A2438] dark:text-[#D0C9E8] dark:border-[#D0C9E8]" 
                  : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
              }`}
            >
              English
            </button>
          </div>
        </AccordionItem>

        <AccordionItem title={t("settings.contactSupport")} variant="settings">
          <div className="text-[14px] text-[#4A4A4A] dark:text-gray-300 flex flex-col gap-2 px-2 bg-[#F9F9FB] dark:bg-[#1A1A2E] p-4 rounded-xl transition-colors">
            <p><strong>Mail:</strong> contactbrizzy@brizzy.com</p>
            <p><strong>Phone:</strong> 0145420126</p>
          </div>
        </AccordionItem>

        <button className="text-left py-4 text-[#E50000] dark:text-[#FF6B6B] font-bold text-[17px] mt-2 hover:bg-gray-50 dark:hover:bg-[#1A1A2E] transition-colors">
          {t("settings.signOut")}
        </button>
        
        <Link href="/legal" className="text-left py-4 text-[#8B7BB5] dark:text-[#A395DA] text-[15px] hover:underline transition-colors">
          {t("settings.legalNotice")}
        </Link>
      </div>
    </main>
  );
}