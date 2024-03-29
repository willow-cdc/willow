import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { getPipeLineById } from "../../services/pipelines";
import IndividualPipeline from "./IndividualPipeline";
vi.mock("../../services/pipelines");

test("Invidual Pipeline details are correctly rendered", async () => {
  const mockData = {
    source_name: "sourceName",
    sink_name: "sinkName",
    pipeline_id: "1",
    source_database: "source",
    source_host: "sourceHost",
    source_port: 5432,
    source_user: "sourceUser",
    sink_url: "sinkURL",
    sink_user: "sinkUser",
    tables: ["table1", "table2"],
  };

  vi.mocked(getPipeLineById).mockResolvedValue(mockData);
  render(<IndividualPipeline />);
  expect(await screen.findByText("Pipeline 1"));
  expect(await screen.findByText("Source name:"));
  expect(await screen.findByText("sourceName"));
  expect(await screen.findByText("Database:"));
  expect(await screen.findByText("source"));
  expect(await screen.findByText("Host:"));
  expect(await screen.findByText("sourceHost"));
  expect(await screen.findByText("Port name:"));
  expect(await screen.findByText("5432"));
  expect(await screen.findByText("User:"));
  expect(await screen.findByText("sourceUser"));
  expect(await screen.findByText("Tables:"));
  expect(await screen.findByText("table1"));
  expect(await screen.findByText("table2"));
  expect(await screen.findByText("Sink Name:"));
  expect(await screen.findByText("sinkName"));
  expect(await screen.findByText("Sink Url:"));
  expect(await screen.findByText("sinkURL"));
  expect(await screen.findByText("Sink User:"));
  expect(await screen.findByText("sinkUser"));
});
