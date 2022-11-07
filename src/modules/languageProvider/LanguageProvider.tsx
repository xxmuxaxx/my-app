import React, { FC, createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import { Languages } from "./types/interface";

export const LanguageContext = createContext<{
  language: Languages;
  setLanguage: React.Dispatch<React.SetStateAction<Languages>>;
}>({
  language: Languages.english,
  setLanguage: () => {},
});

type LanguageProviderProps = {
  children: React.ReactElement;
};

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Languages>(Languages.english);
  const value = { language, setLanguage };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
