import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./styles/App.css";
import FormStepper from "./components/PipelineForms/FormStepper";
import { TopicsContextProvider } from "./context/TopicsContext";
import { SideBarSelectionContextProvider } from "./context/SideBarSelectionContext";
import SideBar from "./components/SideBar";
import { Container } from "@mui/material";
import Home from "./components/Home";
import Pipelines from "./components/Pipelines/Pipelines";
import IndividualPipeline from "./components/Pipelines/IndividualPipeline";
import UnknownRoute from "./components/UnknownRoute";
import { theme } from "./styles/Theme";

function App() {
  return (
    <>
      <SideBarSelectionContextProvider>
        <TopicsContextProvider>
          <ThemeProvider theme={theme}>
            <Container sx={{ display: "flex", height: '100%' }}>
              <SideBar />
              <Container sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/new" element={<FormStepper />} />
                  <Route path="/pipelines">
                    <Route index element={<Pipelines />} />
                    <Route
                      path=":pipeline_id"
                      element={<IndividualPipeline />}
                    />
                  </Route>
                  <Route path="*" element={<UnknownRoute />} />
                </Routes>
              </Container>
            </Container>
          </ThemeProvider>
        </TopicsContextProvider>
      </SideBarSelectionContextProvider>
    </>
  );
}

export default App;
