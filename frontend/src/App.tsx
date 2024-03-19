import willowLogo from "./assets/Willow Logo Transparent.png";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Augment the palette to include an willowGreen color
declare module "@mui/material/styles" {
  interface Palette {
    willowGreen: Palette["primary"];
  }

  interface PaletteOptions {
    willowGreen?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    willowBrown: Palette["secondary"];
  }

  interface PaletteOptions {
    willowBrown?: PaletteOptions["secondary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    willowGreen: true;
  }
}

declare module "@mui/material/Switch" {
  interface SwitchPropsColorOverrides {
    willowGreen: true;
  }
}

const theme = createTheme({
  palette: {
    willowGreen: {
      main: "#409935",
      light: "#a0cc9a",
      dark: "#265c20",
      contrastText: "#FFFFFF",
    },
    willowBrown: {
      main: "#7C7955",
      light: "#b0af99",
      dark: "#4a4933",
      contrastText: "#FFFFFF",
    },
  },
});

import "./styles/App.css";

import FormStepper from "./components/FormStepper";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <img src={willowLogo} className="logo" alt="Willow logo" />
        <FormStepper />
      </ThemeProvider>
    </>
  );
}

export default App;
