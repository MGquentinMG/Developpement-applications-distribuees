
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

export function useSettings() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  const [currentLang, setCurrentLang] = useState<string>(i18n.language || "fr");
  
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifShares, setNotifShares] = useState(false);
  const [notifFollows, setNotifFollows] = useState(true);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  return {
    t,
    theme,
    toggleTheme,
    currentLang,
    handleLanguageChange,
    notifLikes,
    setNotifLikes,
    notifComments,
    setNotifComments,
    notifShares,
    setNotifShares,
    notifFollows,
    setNotifFollows
  };
}