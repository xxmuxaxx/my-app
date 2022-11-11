import "./i18n";

import { ConfigProvider } from "antd";
import en_US from "antd/es/locale/en_US";
import ka_GE from "antd/es/locale/ka_GE";
import ru_RU from "antd/es/locale/ru_RU";
import { Locale } from "antd/lib/locale-provider";
import React, { createContext, FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Languages } from "./types/interface";

const antLocales: Record<string, Locale> = {
  [Languages.russian]: ru_RU,
  [Languages.english]: en_US,
  [Languages.georgian]: ka_GE,
};

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
      <ConfigProvider locale={antLocales[language]}>{children}</ConfigProvider>
    </LanguageContext.Provider>
  );
};
