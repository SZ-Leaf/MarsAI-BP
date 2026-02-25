import { getFEATURES } from './homepage';

// Configuration CMS par défaut pour la homepage.
// Utilisée comme base dans l'admin CMS et pouvant être surchargée via localStorage.
export const HOMEPAGE_CMS_DEFAULT = {
  hero: {
    descriptionLines: {
      fr: [
        "Le festival de courts-métrages de 60 secondes réalisés par IA.",
        "2 jours d'immersion au cœur de Marseille.",
      ],
      en: [
        "The festival of 60 second short films made by AI.",
        "2 days of immersion in the heart of Marseille.",
      ],
    },
    primaryCtaLabel: {
      fr: "VOIR LES FILMS",
      en: "SEE THE FILMS",
    },
    secondaryCtaLabel: {
      fr: "SOUMETTRE UN FILM",
      en: "SUBMIT A FILM",
    },
  },
  features: {
    fr: getFEATURES('fr').map(({ title, description, className }) => ({
      title,
      description,
      className,
    })),
    en: getFEATURES('en').map(({ title, description, className }) => ({
      title,
      description,
      className,
    })),
  },
};

