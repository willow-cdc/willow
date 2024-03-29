import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
vi.mock("./services/pipelines");
import { getAllPipelines } from "./services/pipelines";

import App from "./App";

test("WELCOME TO WILLOW displays", () => {
  render(<App />, { wrapper: BrowserRouter });
  const welcomeMessage = screen.getByText("WELCOME TO");
  const title = screen.getByText("WILLOW");
  expect(welcomeMessage).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

test("Create a CDC Pipeline button displays", () => {
  render(<App />, { wrapper: BrowserRouter });
  const createButton = screen.getByRole("link", {
    name: "Create a CDC Pipeline",
  });
  expect(createButton).toBeInTheDocument();
});

test("Pipeline page display when clicking on Pipelines sidebar button", async () => {
  vi.mocked(getAllPipelines).mockResolvedValue([]);
  render(<App />, { wrapper: BrowserRouter });
  const welcomeMessage = screen.getByText("WELCOME TO");
  const title = screen.getByText("WILLOW");
  expect(welcomeMessage).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  const user = userEvent.setup();

  await user.click(screen.getByText(/Pipelines/i));
  expect(screen.getByText("Source")).toBeInTheDocument();
  expect(screen.getByText("Sink")).toBeInTheDocument();
  expect(screen.getByText("Pipeline")).toBeInTheDocument();
});

test("Initial form page display when clicking Createe a CDC Pipeline", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const user = userEvent.setup();
  const createButton = screen.getByRole("link", {
    name: "Create a CDC Pipeline",
  });
  await user.click(createButton);
  expect(
    screen.getByRole("heading", { name: "CONNECT TO SOURCE" })
  ).toBeInTheDocument();
});
