import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./styles/App.css";
import FormStepper from "./components/FormStepper";
import { TopicsContextProvider } from "./context/TopicsContext";
import SideBar from "./components/SideBar";
import { Container, alpha } from "@mui/material";
import Home from "./components/Home";

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
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: alpha("#a0cc9a", 0.3), // Change selected color here
            color: "white",
            "&:hover": {
              backgroundColor: alpha("#a0cc9a", 0.3), // Change hover color for selected item here
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <>
      <BrowserRouter>
        <TopicsContextProvider>
          <ThemeProvider theme={theme}>
            <SideBar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<FormStepper />} />
                <Route path="*" element={<p>NOT FOUND ROUTE TO MAKE??</p>} />
              </Routes>
            </Container>
          </ThemeProvider>
        </TopicsContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
