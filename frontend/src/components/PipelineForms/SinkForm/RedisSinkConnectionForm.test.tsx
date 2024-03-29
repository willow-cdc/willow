import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../styles/Theme";
import RedisSinkConnectionForm from "./RedisSinkConnectionForm";
import { SideBarSelectionContextProvider } from "../../../context/SideBarSelectionContext";
vi.mock("../../../services/sink");

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

const mockedUseNavigate = vi.fn();
const mockedUseLocation = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
    useLocation: () => mockedUseLocation,
  };
});

test("All textfields render", () => {
  const mockData = {
    url: "this/is/the/redis/url",
    username: "user",
    password: "psw",
  };

  const showAlertSnackbar = vi.fn();
  render(
    <ThemeProvider theme={theme}>
      <RedisSinkConnectionForm
        topics={[]}
        url={mockData.url}
        username={mockData.username}
        password={mockData.password}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const connectionNameTextfield = screen.getByRole("textbox", {
    name: "connection name",
  });

  expect(connectionNameTextfield).toBeInTheDocument();
});

test("redirects occurs when completing the pipeline creation process", async () => {
  const mockData = {
    url: "this/is/the/redis/url",
    username: "user",
    password: "psw",
  };
  const showAlertSnackbar = vi.fn();
  render(
    <SideBarSelectionContextProvider>
      <ThemeProvider theme={theme}>
        <RedisSinkConnectionForm
          topics={["topic1.table"]}
          url={mockData.url}
          username={mockData.username}
          password={mockData.password}
          showAlertSnackbar={showAlertSnackbar}
        />
      </ThemeProvider>
    </SideBarSelectionContextProvider>
  );

  const button = screen.getByRole("button", {
    name: "Create Connection",
  });

  const user = userEvent.setup();
  const connectionNameTextfield = screen.getByRole("textbox", {
    name: "connection name",
  });
  await user.type(connectionNameTextfield, "testit");
  await user.click(button);
  act(() => vi.runAllTimers());
  expect(mockedUseNavigate).toHaveBeenCalled();
});
