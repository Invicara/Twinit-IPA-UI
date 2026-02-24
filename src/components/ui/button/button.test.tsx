import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./button";

describe("Button", () => {
  test("renders the Button component", () => {
    render(<Button variant="default" testIdPrefix="button">default</Button>);

    expect(screen.getByTestId("button").innerHTML).toEqual("default");
  });

  test("click the button", async () => {
    const onClick = jest.fn();
    render(<Button variant="default" testIdPrefix="button" onClick={onClick}>default</Button>);

    const element = screen.getByTestId("button");
    userEvent.click(element);
    await waitFor(() => expect(onClick).toHaveBeenCalled());
  });
});
