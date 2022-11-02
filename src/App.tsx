import React from "react";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";

import { Layout } from "./components/layout";
import { AppRouter } from "./routing/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
