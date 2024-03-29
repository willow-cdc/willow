import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../../styles/Theme";
import SourceForm from "./SourceForm";
vi.mock("../../../services/source");

test("Submission not handled if an input value is missing (apart from connection name value)", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const setFormStateObj = vi.fn();
  const setIsValidSourceConnection = vi.fn();
  const setrawTablesAndColumnsData = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SourceForm
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        setIsValidSourceConnection={setIsValidSourceConnection}
        setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: "Connect" });
  await user.click(button);

  expect(setIsValidSourceConnection).not.toHaveBeenCalled();
  expect(setrawTablesAndColumnsData).not.toHaveBeenCalled();
  expect(showAlertSnackbar).not.toHaveBeenCalled();
});

test("Submission is handled if all input value are included (apart from connection name value)", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "psw",
    connectionName: "",
  };

  const setFormStateObj = vi.fn();
  const setIsValidSourceConnection = vi.fn();
  const setrawTablesAndColumnsData = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SourceForm
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        setIsValidSourceConnection={setIsValidSourceConnection}
        setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const button = screen.getByRole("button", { name: "Connect" });
  await user.click(button);

  expect(setIsValidSourceConnection).toHaveBeenCalled();
  expect(setrawTablesAndColumnsData).toHaveBeenCalled();
  expect(showAlertSnackbar).toHaveBeenCalled();
});

test("Port input field doesn't handle non numeric values", async () => {
  const mockData = {
    host: "host",
    port: "",
    dbName: "db",
    user: "user",
    password: "psw",
    connectionName: "",
  };

  const setFormStateObj = vi.fn();
  const setIsValidSourceConnection = vi.fn();
  const setrawTablesAndColumnsData = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SourceForm
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        setIsValidSourceConnection={setIsValidSourceConnection}
        setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const portField = screen.getByRole("textbox", { name: "port" });
  await user.type(portField, "aaa");

  expect(setFormStateObj).not.toHaveBeenCalled();
});

test("Port input field handles numeric values", async () => {
  const mockData = {
    host: "host",
    port: "",
    dbName: "db",
    user: "user",
    password: "psw",
    connectionName: "",
  };

  const setFormStateObj = vi.fn();
  const setIsValidSourceConnection = vi.fn();
  const setrawTablesAndColumnsData = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SourceForm
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        setIsValidSourceConnection={setIsValidSourceConnection}
        setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const portField = screen.getByRole("textbox", { name: "port" });
  await user.type(portField, "1");

  expect(setFormStateObj).toHaveBeenCalled();
});

test("All textfields render", () => {
  const mockData = {
    host: "",
    port: "",
    dbName: "",
    user: "",
    password: "",
    connectionName: "",
  };

  const setFormStateObj = vi.fn();
  const setIsValidSourceConnection = vi.fn();
  const setrawTablesAndColumnsData = vi.fn();
  const showAlertSnackbar = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SourceForm
        formStateObj={mockData}
        setFormStateObj={setFormStateObj}
        setIsValidSourceConnection={setIsValidSourceConnection}
        setrawTablesAndColumnsData={setrawTablesAndColumnsData}
        showAlertSnackbar={showAlertSnackbar}
      />
    </ThemeProvider>
  );

  const hostTextfield = screen.getByRole("textbox", { name: "host" });
  const portTextfield = screen.getByRole("textbox", { name: "port" });
  const databaseNameTextfield = screen.getByRole("textbox", {
    name: "database name",
  });
  const userTextfield = screen.getByRole("textbox", { name: "user" });
  const passwordTextfield = screen.getByLabelText("password *");

  expect(hostTextfield).toBeInTheDocument();
  expect(portTextfield).toBeInTheDocument();
  expect(databaseNameTextfield).toBeInTheDocument();
  expect(userTextfield).toBeInTheDocument();
  expect(passwordTextfield).toBeInTheDocument();
});
