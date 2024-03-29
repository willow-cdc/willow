import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SelectDataForm from "./SelectDataForm";
import { theme } from "../../../styles/Theme";
import { ThemeProvider } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";
vi.mock("../../../services/source");

test("Component renders with table switches", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1"],
          primaryKeys: ["col1"],
        },
        {
          table_name: "table2",
          columns: ["col1"],
          primaryKeys: ["col1"],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );

  const switches = await screen.findAllByRole("checkbox");
  expect(switches).toHaveLength(2);
});

test("Component doesn't render tables with no primary key", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1"],
          primaryKeys: ["col1"],
        },
        {
          table_name: "table2",
          columns: ["col1"],
          primaryKeys: [],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );

  const switches = await screen.findAllByRole("checkbox");
  expect(switches).toHaveLength(1);
});

test("Columns render with column table selection", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1"],
          primaryKeys: ["col1"],
        },
        {
          table_name: "table2",
          columns: ["col1"],
          primaryKeys: ["col1"],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );
  const user = userEvent.setup();

  const tableButton = await screen.findByRole("button", { name: "table" });
  await user.click(tableButton);
  const switches = await screen.findAllByRole("checkbox");
  expect(switches).toHaveLength(3);
});

test("Switch for primary key in table column list is disabled", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1", "col2"],
          primaryKeys: ["col1"],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );
  const user = userEvent.setup();

  const tableButton = await screen.findByRole("button", { name: "table" });
  await user.click(tableButton);
  const switches = screen.getAllByRole("checkbox");
  expect(switches[1]).toBeDisabled();
});

test("Submission is not handled if all tables are unselected", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1", "col2"],
          primaryKeys: ["col1"],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );
  const user = userEvent.setup();

  const switchToggle = await screen.findByRole("checkbox");
  await user.click(switchToggle);
  const submitButton = screen.getByText(/submit/i);
  await user.click(submitButton);
  expect(handleNext).not.toHaveBeenCalled();
});

test("Submission is handled if at least one table is selected", async () => {
  const mockData = {
    host: "host",
    port: "1234",
    dbName: "db",
    user: "user",
    password: "",
    connectionName: "name",
  };

  const mockRawTablesAndColumnsData = [
    {
      schema_name: "schema",
      tables: [
        {
          table_name: "table",
          columns: ["col1", "col2"],
          primaryKeys: ["col1"],
        },
      ],
    },
  ];

  const handleNext = vi.fn();
  const showAlertSnackbar = vi.fn();
  const setFormStateObj = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <SelectDataForm
        rawTablesAndColumnsData={mockRawTablesAndColumnsData}
        formStateObj={mockData}
        handleNext={handleNext}
        showAlertSnackbar={showAlertSnackbar}
        setFormStateObj={setFormStateObj}
      />
    </ThemeProvider>
  );

  const user = userEvent.setup();
  const submitButton = screen.getByText(/submit/i);
  await user.click(submitButton);
  expect(handleNext).toHaveBeenCalled();
});
