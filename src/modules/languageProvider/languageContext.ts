import { createContext } from 'react';
import { LanguageContextType } from './types/interface';

export const LanguageContext = createContext<LanguageContextType>(
  {} as LanguageContextType,
);
