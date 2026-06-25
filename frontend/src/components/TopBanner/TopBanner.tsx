"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; 
import Logo from "../Logo/Logo"; 
import Button from "../Button/Button";

interface TopBannerProps {
  onLoginClick?: () => void;
}

export default function TopBanner({ onLoginClick }: TopBannerProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-[#A395DA]/[0.14] dark:bg-[#1A1A2E] pt-6 pb-6 px-5 md:py-10 md:px-12 border-b border-[#A395DA]/20 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-[24px] md:text-[32px] font-black leading-tight text-[#492775] dark:text-[#D0C9E8] tracking-tight transition-colors duration-300">
            {t("topBanner.title1")}<br />
            {t("topBanner.title2")}<br />
            {t("topBanner.title3")}
          </h1>
          <div className="h-1.5 md:h-2 w-24 md:w-32 bg-[#492775] dark:bg-[#A395DA] mt-3 md:mt-4 rounded-full transition-colors duration-300"></div>
          <p className="text-[#492775] dark:text-[#A395DA] text-[12px] md:text-[14px] font-medium mt-3 md:mt-4 max-w-[160px] md:max-w-[250px] leading-snug transition-colors duration-300">
            {t("topBanner.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-12 md:gap-16 mt-1">
          <Button
            label={t("topBanner.login")}
            isHashtag={false}
            variant="action"
            onClick={onLoginClick ?? (() => router.push("/login"))}
          />
          <div className="flex justify-end mr-2 md:mr-6 transform scale-[2] md:scale-[2.5] origin-right drop-shadow-sm hover:scale-[1.8] md:hover:scale-[2.2] transition-transform duration-300">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}