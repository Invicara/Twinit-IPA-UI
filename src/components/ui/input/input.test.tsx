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

  test("applies fitContent layout on the outer wrapper", () => {
    const { container } = render(<Input fitContent placeholder="compact" />);

    expect(container.firstChild).toHaveAttribute("data-fit-content", "true");
    expect(container.firstChild).toHaveClass(styles.inputFitContent);
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

  test("applies data-size for default size", () => {
    render(<Input />);
    const input = screen.getByTestId("ipa_input");
    expect(input).toHaveAttribute("data-size", "default");
  });

  test("applies data-size for sm and lg sizes", () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByTestId("ipa_input")).toHaveAttribute("data-size", "sm");

    rerender(<Input size="lg" />);
    expect(screen.getByTestId("ipa_input")).toHaveAttribute("data-size", "lg");
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

    test("password mode keeps type=password when type=text is also passed", () => {
      render(<Input password type="text" />);
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

  describe("Clearable mode", () => {
    test("does not show clear button when empty", () => {
      render(<Input clearable placeholder="Search" />);

      expect(screen.queryByTestId("ipa_input_clear")).not.toBeInTheDocument();
    });

    test("shows clear button when the field has a value", () => {
      render(<Input clearable defaultValue="hello" />);

      expect(screen.getByTestId("ipa_input_clear")).toBeInTheDocument();
      expect(screen.getByLabelText("Clear input").querySelector("svg")).toBeInTheDocument();
    });

    test("clears an uncontrolled input when X is clicked", async () => {
      const user = userEvent.setup();
      render(<Input clearable defaultValue="hello" />);

      const input = screen.getByTestId("ipa_input");
      await user.click(screen.getByLabelText("Clear input"));

      expect(input).toHaveValue("");
      expect(screen.queryByTestId("ipa_input_clear")).not.toBeInTheDocument();
    });

    test("calls onChange with an empty value when X is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<Input clearable value="hello" onChange={onChange} />);

      await user.click(screen.getByLabelText("Clear input"));

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.at(-1)?.[0].target.value).toBe("");
    });

    test("applies clear padding when clear button is visible", () => {
      render(<Input clearable defaultValue="hello" />);

      expect(screen.getByTestId("ipa_input")).toHaveClass(styles.withClear);
    });

    test("does not show clear button for textarea", () => {
      render(<Input clearable textarea defaultValue="hello" />);

      expect(screen.queryByTestId("ipa_input_clear")).not.toBeInTheDocument();
    });

    test("does not show clear button when disabled", () => {
      render(<Input clearable defaultValue="hello" disabled />);

      expect(screen.queryByTestId("ipa_input_clear")).not.toBeInTheDocument();
    });

    test("shows clear button when typing in an uncontrolled input", async () => {
      const user = userEvent.setup();
      render(<Input clearable placeholder="Search" />);

      expect(screen.queryByTestId("ipa_input_clear")).not.toBeInTheDocument();
      await user.type(screen.getByTestId("ipa_input"), "Ada");

      expect(screen.getByTestId("ipa_input_clear")).toBeInTheDocument();
    });

    test("shows clear button to the left of the password toggle", () => {
      render(<Input clearable password defaultValue="secret" />);

      expect(screen.getByTestId("ipa_input_clear")).toBeInTheDocument();
      expect(screen.getByLabelText("Show password")).toBeInTheDocument();
      expect(screen.getByTestId("ipa_input")).toHaveClass(
        styles.withPassword,
        styles.withClear
      );
    });

    test("clears password input when X is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Input clearable password defaultValue="secret" onChange={onChange} />
      );

      await user.click(screen.getByLabelText("Clear input"));

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.at(-1)?.[0].target.value).toBe("");
    });
  });
});
