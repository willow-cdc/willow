// import { useState } from "react";
import willowLogo from "./assets/Willow Logo Transparent.png";
import "./styles/App.css";

import SignUp from "./components/SourceForm";

function App() {
  return (
    <>
      <div>
        <img src={willowLogo} className="logo" alt="Willow logo" />
      </div>
      <SignUp />
    </>
  );
}

export default App;
