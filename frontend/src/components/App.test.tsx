import { render, screen } from "@testing-library/react";

import App from "../App";

it("WELCOME TO WILLOW displays", () => {
  render(<App />);
  const welcomeMessage = screen.getByText("WELCOME TO");
  const title = screen.getByText("WILLOW");
  expect(welcomeMessage).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

it("Create a CDC Pipeline button displays", () => {
  render(<App />);
  const createButton = screen.getByRole("link", {
    name: "Create a CDC Pipeline",
  });
  expect(createButton).toBeInTheDocument();
});
