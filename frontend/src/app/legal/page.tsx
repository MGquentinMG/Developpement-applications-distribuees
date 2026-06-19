"use client";

import { useTranslation } from "react-i18next";
import "../../i18n";
import BackButton from "../../components/BackButton/BackButton";
import AccordionItem from "../../components/AccordionItem/AccordionItem";

export default function LegalPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] pb-10 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white dark:bg-[#121212] z-10 border-b border-gray-100 dark:border-gray-800 mb-6 transition-colors duration-300">
        <div className="w-10">
          <BackButton />
        </div>
        <div className="bg-[#EAE5F3] dark:bg-[#2A2438] px-6 py-2 rounded-xl transition-colors duration-300">
          <h1 className="text-[#1E1E40] dark:text-[#F9F9FB] font-bold text-sm transition-colors duration-300">{t("legal.title")}</h1>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col">
        <AccordionItem title={t("legal.section1")} defaultOpen={true} variant="legal">
          <p className="text-sm text-[#1E1E40] dark:text-gray-300 mb-4 transition-colors duration-300">
            La société avec laquelle vous concluez un contrat dépend de votre lieu de résidence ou de votre lieu d'activité principal :
          </p>
          
          <ul className="list-disc pl-5 text-sm text-[#1E1E40] dark:text-gray-300 flex flex-col gap-4 mb-4 transition-colors duration-300">
            <li>
              Si vous résidez dans l'un des pays de <span className="text-[#A395DA] dark:text-[#C4B5E8] underline cursor-pointer">l'Espace économique européen (« EEE »)</span> ou en Suisse, votre contrat est conclu avec Breezy Technology Limited. Cette société est immatriculée en République d'Irlande, dont le siège social est sis The Sorting Office, Ropemaker Place, Arras 2, D02 HD23, France et dont le numéro d'immatriculation est 67676767.
            </li>
            <li>
              Si vous résidez au Royaume-Uni, votre contrat est conclu avec Breezy Information Technologies UK Limited. Cette société est immatriculée en Angleterre dont le siège social est sis 4 Lindsey Street, Barbican, Londres, EC1A 9HP, Royaume-Uni et dont le numéro d'immatriculation est 10165711.
            </li>
          </ul>

          <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">
            Nous, ainsi que les sociétés qui nous sont affiliées (telles que Breezy Information Technologies UK Limited, Breezy Inc. et Breezy Pte. Ltd.) (« Sociétés affiliées ») fournissons la Plateforme dans le monde entier.
          </p>
        </AccordionItem>

        <AccordionItem title={t("legal.section2")} variant="legal">
          <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">Contenu de la section 2...</p>
        </AccordionItem>

        <AccordionItem title={t("legal.section3")} variant="legal">
          <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">Contenu de la section 3...</p>
        </AccordionItem>

        <AccordionItem title={t("legal.section4")} variant="legal">
          <p className="text-sm text-[#1E1E40] dark:text-gray-300 transition-colors duration-300">Contenu de la section 4...</p>
        </AccordionItem>
      </div>
    </main>
  );
}