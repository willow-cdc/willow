import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Pipelines from "./Pipelines";
import { getAllPipelines } from "../../services/pipelines";
import { MemoryRouter } from "react-router-dom";
vi.mock("../../services/pipelines");

test("Pipelines table renders with data", async () => {
  vi.mocked(getAllPipelines).mockResolvedValue([
    { pipeline_id: "1", source_name: "hello", sink_name: "hello" },
  ]);

  render(
    <MemoryRouter initialEntries={["/pipelines"]}>
      <Pipelines />
    </MemoryRouter>
  );

  expect(await screen.findByText("1")).toBeInTheDocument();
});

test("Pipelines table renders no data", async () => {
  vi.mocked(getAllPipelines).mockResolvedValue([]);
  render(
    <MemoryRouter initialEntries={["/pipelines"]}>
      <Pipelines />
    </MemoryRouter>
  );

  let nonExist = false;
  try {
    await screen.findByText("1");
  } catch (error) {
    nonExist = true;
  }

  expect(nonExist).toEqual(true);
});
