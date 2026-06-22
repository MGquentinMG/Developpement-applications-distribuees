'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { InputField } from './common/InputField';
import { useAuth } from '../../contexts/AuthContext';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="text-gray-500">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

function calcAge(day: string, month: string, year: string): number {
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function RegisterForm() {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => setter(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms) return;
    setError('');
    setLoading(true);
    try {
      const age = calcAge(day, month, year);
      await register({ username: pseudo, email, password, age });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[400px] p-8 pt-10 relative">
      <button className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-gray-600 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-[32px] font-bold text-black tracking-tight leading-tight">Inscription à</h2>
        <h1 className="text-[34px] font-bold text-[#A69ACA] mt-1 tracking-wider uppercase">BREEZY</h1>
      </div>

      {step === 1 ? (
        <div className="space-y-4 px-2">
          <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#F3F4F6] text-gray-800 font-medium rounded-full text-sm px-5 py-3 hover:bg-gray-200 transition-colors">
            <GoogleIcon />
            Inscription avec google
          </button>
          <button type="button" onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-3 bg-[#F3F4F6] text-gray-800 font-medium rounded-full text-sm px-5 py-3 hover:bg-gray-200 transition-colors">
            <UserIcon />
            Inscription avec e-mail
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-sm text-gray-900 mb-1">Pseudo</label>
            <InputField type="text" placeholder="Ton pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-1">Quelle est ton adresse e-mail ?</label>
            <InputField type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-1">Mot de passe</label>
            <InputField type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-1">Quelle est ta date de naissance ?</label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <select className="bg-[#F3F4F6] text-gray-500 text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={day} onChange={(e) => handleSelectChange(e, setDay)} required>
                  <option value="">Jour</option>
                  {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <div className="relative w-full">
                <select className="bg-[#F3F4F6] text-gray-500 text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={month} onChange={(e) => handleSelectChange(e, setMonth)} required>
                  <option value="">Mois</option>
                  {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <div className="relative w-full">
                <select className="bg-[#F3F4F6] text-gray-500 text-sm rounded-lg p-2.5 w-full outline-none appearance-none cursor-pointer pr-8" value={year} onChange={(e) => handleSelectChange(e, setYear)} required>
                  <option value="">Année</option>
                  {Array.from({ length: 100 }, (_, i) => { const y = new Date().getFullYear() - i; return <option key={y} value={y}>{y}</option>; })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-[#A69ACA] bg-gray-100 border-gray-300 rounded focus:ring-[#A69ACA] cursor-pointer"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight cursor-pointer">
              J'accepte les Conditions d'utilisation de BREEZY et confirme avoir lu la Politique de confidentialité.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A69ACA] text-white font-medium rounded-full text-sm px-5 py-3 mt-2 hover:bg-[#9084b8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Inscription...' : 'Valider'}
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="mt-8 text-center text-[8px] text-gray-500 px-8 leading-tight">
          En continuant, tu acceptes les Conditions d'utilisation de BREEZY et confirmes avoir lu la Politique de confidentialité de BREEZY.
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-800">
          Tu as déjà un compte ? <br/>
          <a href="/login" className="text-[#A69ACA] hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
