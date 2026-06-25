"use client";

import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { InputField } from "./InputField";
import { ErrorMessage } from "./ErrorMessage";
import { AuthFormProps } from "../../types/AuthType";
import { useAuth } from "../../contexts/AuthContext";
import "../../i18n";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-gray-500 dark:text-[#D0C9E8]">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export function RegisterForm({ onSwitchMode, onClose }: AuthFormProps) {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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

    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setIsLoading(true);
    setError(null);
    try {
      await register({ username: pseudo, email, password, age: calculatedAge });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

  return (
    <div className="bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-xl w-full max-w-[500px] p-10 pt-12 relative transition-colors duration-300">
      <button onClick={onClose} className="absolute top-5 right-5 bg-gray-200 dark:bg-[#2A2438] hover:bg-gray-300 dark:hover:bg-[#3A304D] rounded-full w-8 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors cursor-pointer border-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div className="text-center mb-10">
        <h2 className="text-[36px] font-black text-black dark:text-[#F9F9FB] tracking-tight leading-tight">{t("auth.registerTitle")}</h2>
        <h1 className="text-[38px] font-black text-[#A69ACA] dark:text-[#8B7BB5] mt-1 tracking-wider uppercase">BREEZY</h1>
      </div>

      {step === 1 ? (
        <div className="space-y-5 px-2">
          <button type="button" className="w-full flex items-center justify-center gap-4 bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-800 dark:text-[#F9F9FB] font-bold rounded-full text-base px-6 py-4 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors cursor-pointer border-none">
            <GoogleIcon /> {t("auth.googleRegister")}
          </button>
          <button type="button" onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-4 bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-800 dark:text-[#F9F9FB] font-bold rounded-full text-base px-6 py-4 hover:bg-gray-200 dark:hover:bg-[#3A304D] transition-colors cursor-pointer border-none">
            <UserIcon /> {t("auth.emailRegister")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 px-2">
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-1">{t("auth.pseudoLabel")}</label>
            <InputField type="text" placeholder={t("auth.pseudoPlaceholder")} value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-1">{t("auth.emailLabel")}</label>
            <InputField type="email" placeholder={t("auth.emailLabel")} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-1">{t("auth.passwordLabel")}</label>
            <InputField type="password" placeholder={t("auth.passwordLabel")} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-[#F9F9FB] mb-1">{t("auth.dobLabel")}</label>
            <div className="flex gap-3">
              <div className="relative w-full">
                <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm font-medium rounded-lg p-3 w-full outline-none appearance-none cursor-pointer pr-8" value={day} onChange={(e) => handleSelectChange(e, setDay)} required>
                  <option value="">{t("auth.day")}</option>
                  {Array.from({length: 31}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
                <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              
              <div className="relative w-full">
                <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm font-medium rounded-lg p-3 w-full outline-none appearance-none cursor-pointer pr-8" value={month} onChange={(e) => handleSelectChange(e, setMonth)} required>
                  <option value="">{t("auth.month")}</option>
                  {months.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
                <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              <div className="relative w-full">
                <select className="bg-[#F3F4F6] dark:bg-[#2A2438] text-gray-500 dark:text-[#F9F9FB] text-sm font-medium rounded-lg p-3 w-full outline-none appearance-none cursor-pointer pr-8" value={year} onChange={(e) => handleSelectChange(e, setYear)} required>
                  <option value="">{t("auth.year")}</option>
                  {Array.from({length: 100}, (_, i) => { const y = new Date().getFullYear() - i; return <option key={y} value={y}>{y}</option> })}
                </select>
                <div className="pointer-events-none inset-y-0 right-0 absolute flex items-center px-2 text-gray-600 dark:text-[#A395DA]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input 
              type="checkbox" 
              id="terms"
              className="mt-1 w-5 h-5 rounded border-gray-300 cursor-pointer text-[#A69ACA] focus:ring-[#A69ACA]"
              checked={acceptTerms} 
              onChange={(e) => setAcceptTerms(e.target.checked)} 
              required 
            />
            <label htmlFor="terms" className="text-[11px] text-gray-500 dark:text-[#A395DA] leading-tight cursor-pointer">
              {t("auth.terms")}
            </label>
          </div>

          <p></p>
          <ErrorMessage message={error || undefined} />
          
          <button type="submit" disabled={isLoading} className="w-full bg-[#A69ACA] dark:bg-[#492775] text-white font-bold rounded-full text-base px-5 py-4 mt-2 hover:bg-[#9084b8] dark:hover:bg-[#3a1f5d] transition-colors cursor-pointer border-none">
            {isLoading ? t("auth.loading") : t("auth.submit")}
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="mt-10 text-center text-[10px] text-gray-400 px-6 leading-tight">
          {t("auth.termsShort")}
        </div>
      )}

      <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-800 dark:text-gray-300">
          {t("auth.hasAccount")} <br/>
          <button onClick={onSwitchMode} className="text-[#A69ACA] dark:text-[#8B7BB5] hover:underline cursor-pointer bg-transparent border-none mt-2 font-bold text-base">
            {t("auth.signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}