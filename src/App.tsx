import "antd/dist/antd.min.css";
import "flag-icons/css/flag-icons.min.css";

import { HashRouter as Router } from "react-router-dom";

import { LanguageProvider } from "./modules/languageProvider";
import { AppRouter } from "./routing/AppRouter";

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
