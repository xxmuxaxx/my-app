import "antd/dist/reset.css";
import "flag-icons/css/flag-icons.min.css";

import { Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";

import { LanguageProvider } from "./modules/languageProvider";
import { ThemeProvider } from "./modules/theme";
import { AppRouter } from "./routing/AppRouter";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <AppRouter />
          </Suspense>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
