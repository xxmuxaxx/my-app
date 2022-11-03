import React from "react";
import { HashRouter as Router } from "react-router-dom";
import "antd/dist/antd.min.css";

import { Layout } from "./components/layout";
import { AppRouter } from "./routing/AppRouter";

function App() {
  return (
    <Router>
      <Layout>
        <AppRouter />
      </Layout>
    </Router>
  );
}

export default App;
