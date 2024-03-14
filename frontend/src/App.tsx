// import { useState } from "react";
import willowLogo from "./assets/Willow Logo Transparent.png";
import "./styles/App.css";

import Form from "./components/Form";

function App() {
  return (
    <>
      <div>
        <img src={willowLogo} className="logo" alt="Willow logo" />
        <Form />
      </div>
    </>
  );
}

export default App;
