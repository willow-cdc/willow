import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Pipelines from "./Pipelines";
import { getAllPipelines } from "../../services/pipelines";

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../services/pipelines", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../services/pipelines")>();
  return {
    ...mod,
    getAllPipelines: vi.fn(),
  };
});

it("Pipelines table renders with data", async () => {
  vi.mocked(getAllPipelines).mockResolvedValue([
    { pipeline_id: "1", source_name: "hello", sink_name: "hello" },
  ]);

  render(<Pipelines />);

  expect(await screen.findByText("1")).toBeInTheDocument();
});

it("Pipelines table renders no data", async () => {
  vi.mocked(getAllPipelines).mockResolvedValue([]);

  render(<Pipelines />);

  expect(await screen.queryByText("1")).toBe(null);
});
