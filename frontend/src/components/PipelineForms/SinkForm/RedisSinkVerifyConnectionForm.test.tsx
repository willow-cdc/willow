import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../styles/Theme";
import RedisSinkVerifyConnectionForm from "./RedisSinkVerifyConnectionForm";
vi.mock("../../../services/sink");

test("Submission not handled if an input value is missing", async () => {
  const mockData = {
    url: "url",
    username: "user",
    password: "",
  };
  const setIsValidConnection = vi.fn();
  const setFormStateObj = vi.fn();
  const showAlertSnackbarts = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <RedisSinkVerifyConnectionForm
        isValidConnection={false}
        formStateObj={mockData}
        setIsValidConnection={setIsValidConnection}
        setFormStateObj={setFormStateObj}
        showAlertSnackbar={showAlertSnackbarts}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: "Verify Connection" });
  await user.click(button);
  expect(setIsValidConnection).not.toHaveBeenCalled();
});

test("Submission handled if all input values included", async () => {
  const mockData = {
    url: "url",
    username: "user",
    password: "psws",
  };

  const setIsValidConnection = vi.fn();
  const setFormStateObj = vi.fn();
  const showAlertSnackbarts = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <RedisSinkVerifyConnectionForm
        isValidConnection={false}
        formStateObj={mockData}
        setIsValidConnection={setIsValidConnection}
        setFormStateObj={setFormStateObj}
        showAlertSnackbar={showAlertSnackbarts}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: "Verify Connection" });
  await user.click(button);

  expect(setIsValidConnection).toHaveBeenCalled();
});

test("Verify button is not displayed when connection verified is valid", async () => {
  const mockData = {
    url: "url",
    username: "user",
    password: "psws",
  };

  const setIsValidConnection = vi.fn();
  const setFormStateObj = vi.fn();
  const showAlertSnackbarts = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <RedisSinkVerifyConnectionForm
        isValidConnection={true}
        formStateObj={mockData}
        setIsValidConnection={setIsValidConnection}
        setFormStateObj={setFormStateObj}
        showAlertSnackbar={showAlertSnackbarts}
      />
    </ThemeProvider>
  );

  let nonExist = false;
  try {
    await screen.findByRole("button", { name: "Verify Connection" });
  } catch (error) {
    nonExist = true;
  }

  expect(nonExist).toBeTruthy();
});

test("All textfields render", () => {
  const mockData = {
    url: "",
    username: "",
    password: "",
  };

  const setIsValidConnection = vi.fn();
  const setFormStateObj = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <RedisSinkVerifyConnectionForm
        isValidConnection={false}
        setIsValidConnection={setIsValidConnection}
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const urlTextfield = screen.getByRole("textbox", { name: "url" });
  const usernameTextfield = screen.getByRole("textbox", { name: "username" });
  const passwordTextfield = screen.getByLabelText("password *");

  expect(urlTextfield).toBeInTheDocument();
  expect(usernameTextfield).toBeInTheDocument();
  expect(passwordTextfield).toBeInTheDocument();
});
