
import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const AdminCMS = () => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {language === 'fr' ? 'CMS Homepage' : 'Homepage CMS'}
        </h1>
        <p className="text-sm text-white/60 max-w-2xl">
          {language === 'fr'
            ? "Maquette d'interface CMS pour modifier les textes de la homepage. (Démo visuelle uniquement, sans sauvegarde réelle.)"
            : 'CMS interface mockup to edit homepage texts. (Visual demo only, no real saving.)'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-blue-600/40 text-sm font-semibold text-white/60 cursor-not-allowed"
            disabled
          >
            {language === 'fr'
              ? 'Sauvegarder (démo)'
              : 'Save (demo)'}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-white/5 text-sm font-semibold text-white/60 border border-white/10 cursor-not-allowed"
            disabled
          >
            {language === 'fr' ? 'Réinitialiser (démo)' : 'Reset (demo)'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          {language === 'fr' ? 'Section Hero' : 'Hero section'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Ligne 1 sous le titre'
                : 'Line 1 under title'}
            </label>
            <input
              type="text"
              value={
                language === 'fr'
                  ? 'Le festival de courts-métrages de 60 secondes réalisés par IA.'
                  : 'The festival of 60 second short films made by AI.'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Ligne 2 sous le titre'
                : 'Line 2 under title'}
            </label>
            <input
              type="text"
              value={
                language === 'fr'
                  ? "2 jours d'immersion au cœur de Marseille."
                  : '2 days of immersion in the heart of Marseille.'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Texte du bouton principal'
                : 'Primary button label'}
            </label>
            <input
              type="text"
              value={
                language === 'fr' ? 'VOIR LES FILMS' : 'SEE THE FILMS'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 opacity-70">
            <label className="text-xs font-semibold text-white/70">
              {language === 'fr'
                ? 'Texte du bouton secondaire'
                : 'Secondary button label'}
            </label>
            <input
              type="text"
              value={
                language === 'fr' ? 'SOUMETTRE UN FILM' : 'SUBMIT A FILM'
              }
              readOnly
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          {language === 'fr'
            ? 'Cartes "Features"'
            : '"Features" cards'}
        </h2>
        <p className="text-xs text-white/50 mb-2">
          {language === 'fr'
            ? 'Modifie les titres et descriptions des 4 cartes sous le hero.'
            : 'Edit the titles and descriptions of the 4 cards under the hero.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 opacity-70"
            >
              <div className="text-xs font-semibold text-white/60">
                {language === 'fr'
                  ? `Carte #${index}`
                  : `Card #${index}`}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/70">
                  {language === 'fr' ? 'Titre' : 'Title'}
                </label>
                <input
                  type="text"
                  value={
                    language === 'fr'
                      ? 'EXEMPLE DE TITRE'
                      : 'SAMPLE TITLE'
                  }
                  readOnly
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-white/70">
                  {language === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  value={
                    language === 'fr'
                      ? 'Texte de description de la carte (exemple).'
                      : 'Card description text (example).'
                  }
                  readOnly
                  rows={3}
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminCMS;

