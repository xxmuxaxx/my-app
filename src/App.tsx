import "antd/dist/antd.min.css";
import "flag-icons/css/flag-icons.min.css";

import { Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";

import { LanguageProvider } from "./modules/languageProvider";
import { AppRouter } from "./routing/AppRouter";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouter />
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
