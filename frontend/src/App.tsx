// import { useState } from "react";
import willowLogo from "./assets/Willow Logo Transparent.png";
import "./styles/App.css";

// import Form from "./components/Form";
// import TestForm from "./components/TestForm";
import SelectDataForm from "./components/SelectDataForm";

function App() {
  return (
    <>
      <img src={willowLogo} className="logo" alt="Willow logo" />
      <SelectDataForm />
    </>
  );
}

export default App;
