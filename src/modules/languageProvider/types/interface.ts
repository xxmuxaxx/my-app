export type LanguageContextType = {
  language: Languages;
  changeLanguage: (language: Languages) => void;
};

export enum Languages {
  russian = "ru",
  english = "en",
  georgian = "ge",
}
