import React from "react";
import { AppRouter } from "./app/router/AppRouter";
import { GlobalLoadingBar } from "./shared/components/GlobalLoadingBar";

const App: React.FC = () => {
  return (
    <>
      <GlobalLoadingBar />
      <AppRouter />
    </>
  );
};

export default App;
