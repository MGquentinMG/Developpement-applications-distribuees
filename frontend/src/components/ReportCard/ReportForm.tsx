'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
// On réutilise l'InputField de la LoginCard !
import { InputField } from '../LoginCard/common/InputField'; 

export function ReportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason) return; // Empêcher l'envoi sans motif
    console.log('Signalement envoyé:', { reason, description });
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[400px] p-8 pt-10 relative">
      
      {/* Bouton Fermer */}
      <button className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-gray-600 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-[32px] font-bold text-black tracking-tight leading-tight">Signalement</h2>
      </div>

      {isSubmitted ? (
        /* Écran 3 : Message de succès */
        <div className="text-center py-10 space-y-2">
          <p className="text-gray-900 font-medium">Merci de votre signalement</p>
          <p className="text-gray-900">:)</p>
        </div>
      ) : (
        /* Écran 1 & 2 : Formulaire avec menu déroulant */
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-900 mb-2">
              Motif du signalement
            </label>
            <div className="relative w-full">
              <select 
                className="bg-[#F3F4F6] text-gray-500 text-sm rounded-lg p-3 w-full outline-none appearance-none cursor-pointer pr-8" 
                value={reason} 
                onChange={handleSelectChange}
                required
              >
                <option value="" disabled hidden>Sélectionner un motif...</option>
                <option value="Incitation à la haine">Incitation à la haine</option>
                <option value="Violence">Violence</option>
                <option value="Désinformation">Désinformation</option>
                <option value="Activités illégal">Activités illégal</option>
                <option value="Fraudes">Fraudes</option>
                <option value="Autres">Autres</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-900 mb-2">
              Description :
            </label>
            <InputField 
              type="text" 
              placeholder="..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mt-6 text-[8px] text-gray-500 leading-tight">
            Merci de noter que le fait d'effectuer sciemment un signalement de contenu peut être puni par la loi. Si tu signales fréquemment du contenu de manière manifestement infondée, nous nous réservons le droit de suspendre ta capacité à effectuer des signalements ou de bannir définitivement ton compte.
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="bg-[#A69ACA] text-white font-medium rounded-full text-sm px-6 py-2 hover:bg-[#9084b8] transition-colors"
            >
              Signaler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}