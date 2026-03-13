import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bell } from "lucide-react";
import { Input } from "./input";
import styles from "./input.module.css";

describe("Input", () => {
  test("renders the Input component", () => {
    render(<Input placeholder="test input" />);

    expect(screen.getByTestId("ipa_input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("test input")).toBeInTheDocument();
  });

  test("renders with label", () => {
    render(<Input label="Test Label" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("renders with helper text", () => {
    render(<Input helperText="Helper text" />);

    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  test("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByTestId("ipa_input");
    await user.type(input, "test value");

    expect(input).toHaveValue("test value");
  });

  test("handles focus and blur events", async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    
    render(<Input onFocus={onFocus} onBlur={onBlur} />);

    const input = screen.getByTestId("ipa_input");
    
    await user.click(input);
    expect(onFocus).toHaveBeenCalled();

    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  test("applies correct dimensions (base and variant classes)", () => {
    render(<Input />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveClass(styles.inputBox, styles.variantInput);
  });

  test("applies data-state for default state", () => {
    render(<Input state="default" />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-state", "default");
  });

  test("applies data-state for error state", () => {
    render(<Input state="error" />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-state", "error");
  });

  test("applies data-state for success state", () => {
    render(<Input state="success" />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-state", "success");
  });

  test("applies data-state for warning state", () => {
    render(<Input state="warning" />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-state", "warning");
  });

  test("applies data-state and readOnly for readonly state", () => {
    render(<Input state="readonly" />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-state", "readonly");
    expect(input).toHaveAttribute("readOnly");
  });

  test("disabled prop disables the input", () => {
    render(<Input disabled />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("data-disabled", "true");
  });

  test("error state sets data-state on label and helper text", () => {
    render(
      <Input 
        label="Label" 
        helperText="Status Label"
        state="error"
      />
    );

    const label = screen.getByText("Label");
    const helperText = screen.getByText("Status Label");
    
    expect(label).toHaveAttribute("data-state", "error");
    expect(helperText).toHaveAttribute("data-state", "error");
  });

  test("success state sets data-state on label and helper text", () => {
    render(
      <Input 
        label="Label" 
        helperText="Status Label"
        state="success"
      />
    );

    const label = screen.getByText("Label");
    const helperText = screen.getByText("Status Label");
    
    expect(label).toHaveAttribute("data-state", "success");
    expect(helperText).toHaveAttribute("data-state", "success");
  });

  test("has proper accessibility attributes", () => {
    render(
      <Input 
        label="Test Label" 
        helperText="Helper text"
      />
    );

    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("aria-describedby");
  });

  describe("Password mode", () => {
    test("renders password input with type='password' by default", () => {
      render(<Input password />);
      const input = screen.getByTestId("ipa_input");
      expect(input).toHaveAttribute("type", "password");
    });

    test("renders eye icon toggle button", () => {
      render(<Input password />);
      const toggleButton = screen.getByLabelText("Show password");
      expect(toggleButton).toBeInTheDocument();
    });

    test("toggles password visibility when eye icon is clicked", async () => {
      const user = userEvent.setup();
      render(<Input password />);
      
      const input = screen.getByTestId("ipa_input");
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
      render(<Input password />);
      const input = screen.getByTestId("ipa_input");
      expect(input).toHaveClass(styles.withPassword);
    });
  });

  describe("Textarea mode", () => {
    test("renders textarea element instead of input", () => {
      render(<Input textarea />);
      const textarea = screen.getByTestId("ipa_input");
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    test("applies correct textarea classes", () => {
      render(<Input textarea />);
      const textarea = screen.getByTestId("ipa_input");
      expect(textarea).toHaveClass(styles.variantTextarea);
    });

    test("handles textarea input", async () => {
      const user = userEvent.setup();
      render(<Input textarea />);
      
      const textarea = screen.getByTestId("ipa_input");
      await user.type(textarea, "Multi-line\ntext content");
      
      expect(textarea).toHaveValue("Multi-line\ntext content");
    });
  });

  describe("Icon mode", () => {
    test("renders icon on the left side", () => {
      const { container } = render(<Input icon={<Bell />} />);
      const input = screen.getByTestId("ipa_input");
      const iconContainer = input.previousElementSibling;
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toContainElement(container.querySelector("svg"));
    });

    test("applies correct padding when icon is present", () => {
      render(<Input icon={<Bell />} />);
      const input = screen.getByTestId("ipa_input");
      expect(input).toHaveClass(styles.withIcon);
    });

    test("icon does not interfere with input", async () => {
      const user = userEvent.setup();
      render(<Input icon={<Bell />} />);
      
      const input = screen.getByTestId("ipa_input");
      await user.type(input, "test");
      
      expect(input).toHaveValue("test");
    });
  });

  describe("Combined features", () => {
    test("password mode with icon applies both paddings", () => {
      render(<Input password icon={<Bell />} />);
      const input = screen.getByTestId("ipa_input");
      expect(input).toHaveClass(styles.withIcon, styles.withPassword);
    });

    test("password toggle works with icon present", async () => {
      const user = userEvent.setup();
      render(<Input password icon={<Bell />} />);
      
      const input = screen.getByTestId("ipa_input");
      const toggleButton = screen.getByLabelText("Show password");
      
      expect(input).toHaveAttribute("type", "password");
      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");
    });
  });
});
