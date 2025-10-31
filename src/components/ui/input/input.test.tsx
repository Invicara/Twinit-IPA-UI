import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bell } from "lucide-react";
import Input from "./input";

describe("Input", () => {
  test("renders the Input component", () => {
    render(<Input testIdPrefix="input" placeholder="test input" />);

    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("test input")).toBeInTheDocument();
  });

  test("renders with label", () => {
    render(<Input label="Test Label" testIdPrefix="input" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("renders with helper text", () => {
    render(<Input helperText="Helper text" testIdPrefix="input" />);

    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  test("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input testIdPrefix="input" />);

    const input = screen.getByTestId("input");
    await user.type(input, "test value");

    expect(input).toHaveValue("test value");
  });

  test("handles focus and blur events", async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    
    render(<Input onFocus={onFocus} onBlur={onBlur} testIdPrefix="input" />);

    const input = screen.getByTestId("input");
    
    await user.click(input);
    expect(onFocus).toHaveBeenCalled();

    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  test("applies correct dimensions", () => {
    render(<Input testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    // Figma Section 1 spec: 36px height, 4px border radius
    expect(input).toHaveClass("h-[36px]", "rounded-[4px]");
  });

  test("applies correct state classes for default state", () => {
    render(<Input state="default" testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-neutral-5");
    // Focus styling is applied via CSS :focus pseudo-class
    expect(input).toHaveClass("focus:border-brand-6");
  });

  test("applies correct state classes for error state", () => {
    render(<Input state="error" testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-alert-7");
    // Focus styling makes border lighter
    expect(input).toHaveClass("focus:border-alert-5");
  });

  test("applies correct state classes for success state", () => {
    render(<Input state="success" testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-positive-7");
    // Focus styling makes border lighter
    expect(input).toHaveClass("focus:border-positive-5");
  });

  test("applies correct state classes for warning state", () => {
    render(<Input state="warning" testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-warning-9");
    // Focus styling makes border lighter
    expect(input).toHaveClass("focus:border-warning-7");
  });

  test("applies correct state classes for readonly state", () => {
    render(<Input state="readonly" testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-neutral-3", "bg-neutral-1", "text-neutral-5");
    expect(input).toHaveAttribute("readOnly");
  });

  test("disabled prop disables the input", () => {
    render(<Input disabled testIdPrefix="input" />);
    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");
  });

  test("error state changes label and helper text color", () => {
    render(
      <Input 
        label="Label" 
        helperText="Status Label"
        state="error"
        testIdPrefix="input" 
      />
    );

    const label = screen.getByText("Label");
    const helperText = screen.getByText("Status Label");
    
    expect(label).toHaveClass("text-alert-7");
    expect(helperText).toHaveClass("text-alert-7");
  });

  test("success state changes label and helper text color", () => {
    render(
      <Input 
        label="Label" 
        helperText="Status Label"
        state="success"
        testIdPrefix="input" 
      />
    );

    const label = screen.getByText("Label");
    const helperText = screen.getByText("Status Label");
    
    expect(label).toHaveClass("text-positive-7");
    expect(helperText).toHaveClass("text-positive-7");
  });

  test("has proper accessibility attributes", () => {
    render(
      <Input 
        label="Test Label" 
        helperText="Helper text"
        testIdPrefix="input" 
      />
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-describedby");
  });

  describe("Password mode", () => {
    test("renders password input with type='password' by default", () => {
      render(<Input password testIdPrefix="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveAttribute("type", "password");
    });

    test("renders eye icon toggle button", () => {
      render(<Input password testIdPrefix="input" />);
      const toggleButton = screen.getByLabelText("Show password");
      expect(toggleButton).toBeInTheDocument();
    });

    test("toggles password visibility when eye icon is clicked", async () => {
      const user = userEvent.setup();
      render(<Input password testIdPrefix="input" />);
      
      const input = screen.getByTestId("input");
      const toggleButton = screen.getByLabelText("Show password");
      
      // Initially password is hidden
      expect(input).toHaveAttribute("type", "password");
      
      // Click to show password
      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
      
      // Click again to hide password
      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
      expect(screen.getByLabelText("Show password")).toBeInTheDocument();
    });

    test("applies correct padding for password toggle icon", () => {
      render(<Input password testIdPrefix="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("pr-[36px]");
    });
  });

  describe("Textarea mode", () => {
    test("renders textarea element instead of input", () => {
      render(<Input textarea testIdPrefix="input" />);
      const textarea = screen.getByTestId("input");
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    test("applies correct textarea classes", () => {
      render(<Input textarea testIdPrefix="input" />);
      const textarea = screen.getByTestId("input");
      expect(textarea).toHaveClass("min-h-[80px]", "resize-y");
    });

    test("handles textarea input", async () => {
      const user = userEvent.setup();
      render(<Input textarea testIdPrefix="input" />);
      
      const textarea = screen.getByTestId("input");
      await user.type(textarea, "Multi-line\ntext content");
      
      expect(textarea).toHaveValue("Multi-line\ntext content");
    });
  });

  describe("Icon mode", () => {
    test("renders icon on the left side", () => {
      const { container } = render(<Input icon={Bell} testIdPrefix="input" />);
      const iconContainer = container.querySelector(".absolute.left-\\[12px\\]");
      expect(iconContainer).toBeInTheDocument();
    });

    test("applies correct padding when icon is present", () => {
      render(<Input icon={Bell} testIdPrefix="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("pl-[36px]");
    });

    test("icon does not interfere with input", async () => {
      const user = userEvent.setup();
      render(<Input icon={Bell} testIdPrefix="input" />);
      
      const input = screen.getByTestId("input");
      await user.type(input, "test");
      
      expect(input).toHaveValue("test");
    });
  });

  describe("Combined features", () => {
    test("password mode with icon applies both paddings", () => {
      render(<Input password icon={Bell} testIdPrefix="input" />);
      const input = screen.getByTestId("input");
      expect(input).toHaveClass("pl-[36px]", "pr-[36px]");
    });

    test("password toggle works with icon present", async () => {
      const user = userEvent.setup();
      render(<Input password icon={Bell} testIdPrefix="input" />);
      
      const input = screen.getByTestId("input");
      const toggleButton = screen.getByLabelText("Show password");
      
      expect(input).toHaveAttribute("type", "password");
      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");
    });
  });
});
