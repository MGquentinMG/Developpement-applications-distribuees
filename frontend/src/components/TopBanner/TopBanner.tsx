"use client";

import { useTranslation } from "react-i18next"; 
import Logo from "../Logo/Logo"; 
import Button from "../Button/Button";
import { TopBannerProps } from "../../types/TopBannerType";
import "../../i18n";

export default function TopBanner({ onLoginClick }: TopBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-[#A395DA]/[0.14] dark:bg-[#1A1A2E] pt-6 pb-6 px-5 border-b border-[#A395DA]/20 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-black leading-tight text-[#492775] dark:text-[#D0C9E8] tracking-tight transition-colors duration-300">
            {t("topBanner.title1")}<br />
            {t("topBanner.title2")}<br />
            {t("topBanner.title3")}
          </h1>
          <div className="h-1.5 w-24 bg-[#492775] dark:bg-[#A395DA] mt-3 rounded-full transition-colors duration-300"></div>
          <p className="text-[#492775] dark:text-[#A395DA] text-[12px] font-medium mt-3 max-w-[160px] leading-snug transition-colors duration-300">
            {t("topBanner.subtitle")}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <Button 
            label={t("topBanner.login")} 
            isHashtag={false} 
            variant="action" 
            onClick={onLoginClick}
          />
          <div className="w-28 h-28 mr-1 mt-3">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}