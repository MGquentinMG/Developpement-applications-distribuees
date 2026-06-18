"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; 
import Logo from "../Logo/Logo"; 
import Button from "../Button/Button";

export default function TopBanner() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-[#A395DA]/[0.14] pt-6 pb-6 px-5 border-b border-[#A395DA]/20 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-black leading-tight text-[#492775] tracking-tight">
            {t("topBanner.title1")}<br />
            {t("topBanner.title2")}<br />
            {t("topBanner.title3")}
          </h1>
          <div className="h-1.5 w-24 bg-[#492775] mt-3 rounded-full"></div>
          <p className="text-[#492775] text-[12px] font-medium mt-3 max-w-[160px] leading-snug">
            {t("topBanner.subtitle")}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <Button 
            label={t("topBanner.login")} 
            isHashtag={false} 
            variant="action" 
            onClick={() => router.push("/login")}
          />
          <div className="w-28 h-28 mr-1 mt-3">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}