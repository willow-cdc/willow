import { createTheme, alpha } from "@mui/material";

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

export const theme = createTheme({
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
            color: "#409935",
            "&:hover": {
              backgroundColor: alpha("#a0cc9a", 0.3), // Change hover color for selected item here
            },
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          "&.Mui-active": {
            color: "#409935",
          },
          "&.Mui-completed": {
            color: "#265c20",
          },
        },
      },
    },
  },
});
