"use client";

import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { InputField } from "./InputField";
import { ErrorMessage } from "./ErrorMessage";
import { AuthFormProps } from "../../types/AuthType";
import { useAuthLogic } from "../../hooks/useAuthLogic";
import "../../i18n";

export function RegisterForm({ onSwitchMode, onClose }: AuthFormProps) {
  const { t } = useTranslation();
  const { register, isLoading, error } = useAuthLogic();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // États pour la date de naissance
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>, 
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms || !day || !month || !year) return;

    // Calcul de l'âge selon la date de naissance
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    
    const success = await register({ 
      username: pseudo, 
      email, 
      password, 
      age: calculatedAge
    });
    
    if (success) onClose();
  };

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full max-w-[400px] p-8 pt-10 relative transition-colors duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 cursor-pointer border-none bg-transparent">X</button>

      <div className="text-center mb-8">
        <h2 className="text-[32px] font-bold text-black dark:text-[#F9F9FB]">{t("auth.registerTitle")}</h2>
        <h1 className="text-[34px] font-bold text-[#A69ACA] dark:text-[#8B7BB5] mt-1 tracking-wider uppercase">BREEZY</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-2">
        <InputField type="text" placeholder={t("auth.pseudoPlaceholder")} value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
        <InputField type="email" placeholder={t("auth.emailLabel")} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <InputField type="password" placeholder={t("auth.passwordLabel")} value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {/* Ajout des sélecteurs de date de naissance */}
        <div>
          <label className="block text-sm text-gray-900 dark:text-[#F9F9FB] mb-1">{t("auth.dobLabel")}</label>
          <div className="flex gap-2">
            <div className="relative w-full">
              <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={day} onChange={(e) => handleSelectChange(e, setDay)} required>
                <option value="">{t("auth.day")}</option>
                {Array.from({length: 31}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
              </select>
              <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            
            <div className="relative w-full">
              <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={month} onChange={(e) => handleSelectChange(e, setMonth)} required>
                <option value="">{t("auth.month")}</option>
                {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div className="relative w-full">
              <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={year} onChange={(e) => handleSelectChange(e, setYear)} required>
                <option value="">{t("auth.year")}</option>
                {Array.from({length: 100}, (_, i) => { const y = new Date().getFullYear() - i; return <option key={y} value={y}>{y}</option> })}
              </select>
              <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input 
            type="checkbox" 
            id="terms"
            className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer"
            checked={acceptTerms} 
            onChange={(e) => setAcceptTerms(e.target.checked)} 
            required 
          />
          <label htmlFor="terms" className="text-[10px] text-gray-500 dark:text-[#A395DA] leading-tight cursor-pointer">{t("auth.terms")}</label>
        </div>

        <ErrorMessage message={error || undefined} />
        
        <button type="submit" disabled={isLoading} className="w-full bg-[#A69ACA] dark:bg-[#492775] text-white font-medium rounded-full text-sm px-5 py-3 mt-2 hover:bg-[#9084b8] dark:hover:bg-[#3a1f5d] transition-colors cursor-pointer">
          {isLoading ? t("auth.loading") : t("auth.submit")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={onSwitchMode} className="text-[#A69ACA] cursor-pointer bg-transparent border-none hover:underline">
          {t("auth.hasAccount")} {t("auth.signIn")}
        </button>
      </div>
    </div>
  );
}