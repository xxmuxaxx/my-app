import React from "react";
import { HashRouter as Router } from "react-router-dom";
import "antd/dist/antd.min.css";

import { AppRouter } from "./routing/AppRouter";
import { LanguageProvider } from "./modules/languageProvider";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRouter />
      </Router>
    </LanguageProvider>
  );
}

export default App;
