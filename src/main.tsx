import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

const client = new Client({
  url: "https://graphql.primodium.ai/v1/graphql",
  exchanges: [cacheExchange, fetchExchange],
});
export default App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider value={client}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
