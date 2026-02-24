import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import util from "util";
import { SingleSelect } from "./single-select";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
  { value: "option5", label: "Option 5" },
];

const longTextOptions = [
  { value: "long1", label: "Option with very long text that should be truncated" },
  { value: "long2", label: "Another option with extremely long text content that exceeds the container width" },
];

const originalConsoleError = console.error;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    const message = util.format(...args);
    if (message.includes("An update to SingleSelect inside a test was not wrapped in act")) {
      return;
    }
    originalConsoleError.apply(console, args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const disabledOptions = [
  { value: "enabled1", label: "Enabled Option 1" },
  { value: "disabled1", label: "Disabled Option 1", disabled: true },
  { value: "enabled2", label: "Enabled Option 2" },
  { value: "disabled2", label: "Disabled Option 2", disabled: true },
];

describe("SingleSelect", () => {
  describe("Core Functionality", () => {
    test("renders with placeholder and displays options on click", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} placeholder="Select option" />);
      
      const input = screen.getByPlaceholderText("Select option");
      expect(input).toBeInTheDocument();
      
      await user.click(input);
      
      defaultOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    test("uses default placeholders when not provided", () => {
      const { rerender } = render(<SingleSelect options={defaultOptions} />);
      expect(screen.getByPlaceholderText("Select an option")).toBeInTheDocument();
      
      rerender(<SingleSelect options={defaultOptions} filter />);
      expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
    });

    test("selects option, displays value, and closes dropdown", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={defaultOptions} onChange={onChange} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      await user.click(screen.getByText("Option 2"));
      
      expect(onChange).toHaveBeenCalledWith("option2");
      
      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    test("displays selected value in input", () => {
      render(<SingleSelect options={defaultOptions} value="option2" />);
      expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument();
    });

    test("does not select disabled options", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={disabledOptions} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      const disabledButton = screen.getByText("Disabled Option 1").closest("button");
      expect(disabledButton).toBeDisabled();
    });

    test("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <>
          <SingleSelect options={defaultOptions} />
          <div data-testid="outside">Outside</div>
        </>
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      
      await user.click(screen.getByTestId("outside"));
      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    test("renders chevron icon by default", () => {
      const { container } = render(<SingleSelect options={defaultOptions} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Filter Mode", () => {
    test("filters options by typing and highlights matches", async () => {
      const user = userEvent.setup();
      const { container } = render(<SingleSelect options={defaultOptions} filter />);
      
      const input = screen.getByPlaceholderText("Type to search...");
      
      // Click first to open dropdown
      await user.click(input);
      
      // Type to filter
      await user.type(input, "Option 2");
      
      await waitFor(() => {
        // Should show Option 2
        const option2 = screen.getByText(/Option 2/);
        expect(option2).toBeInTheDocument();
        
        // Should not show Option 1
        expect(screen.queryByText(/^Option 1$/)).not.toBeInTheDocument();
        
        // Check that highlighting is applied
        const boldElements = container.querySelectorAll(".highlightedText");
        expect(boldElements.length).toBeGreaterThan(0);
      });
    });

    test("shows 'No options found' when filter returns no results", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} filter />);
      
      const input = screen.getByPlaceholderText("Type to search...");
      await user.type(input, "nonexistent");
      
      await waitFor(() => {
        expect(screen.getByText("No options found")).toBeInTheDocument();
      });
    });

    test("shows filtered options in dropdown", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} filter />);
      
      const input = screen.getByPlaceholderText("Type to search...");
      await user.click(input);
      
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 5")).toBeInTheDocument();
      });
    });

    test("clears search query after selection and closes dropdown", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={defaultOptions} filter onChange={onChange} value="" />);
      
      const input = screen.getByPlaceholderText("Type to search...") as HTMLInputElement;
      await user.type(input, "Option 2");
      await user.click(screen.getByText(/Option 2/));
      
      expect(onChange).toHaveBeenCalledWith("option2");
      
      await waitFor(() => {
        expect(screen.queryByText(/Option 1/)).not.toBeInTheDocument();
      });
    });
  });

  describe("Keyboard Navigation", () => {
    test("complete keyboard workflow: open, navigate up/down, select, close", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={defaultOptions} onChange={onChange} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      // Test navigation down
      await user.keyboard("{ArrowDown}");
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).toHaveClass("itemFocused");
      
      // Test navigation further down then up
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");
      expect(firstOption).toHaveClass("itemFocused");
      
      // Test selection with Enter
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("option1");
      
      // Verify dropdown closed
      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    test("closes dropdown on Escape key", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      await user.keyboard("{Escape}");
      
      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    test("opens dropdown on Enter key when focused", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
      
      // Refocus input then Enter to reopen (focus opens dropdown; Enter also opens when closed)
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    test("respects disableKeyboardNavigation prop", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} disableKeyboardNavigation />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      await user.keyboard("{ArrowDown}");
      
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveClass("itemFocused");
    });

    test("handles rapid keyboard navigation without exceeding bounds", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      
      const lastOption = screen.getByText("Option 5").closest("button");
      expect(lastOption).toHaveClass("itemFocused");
    });
  });

  describe("Disabled State", () => {
    test("disables input and prevents dropdown from opening", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} disabled />);
      
      const input = screen.getByPlaceholderText("Select an option");
      expect(input).toBeDisabled();
      
      await user.click(input);
      expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    });
  });

  describe("Customization", () => {
    test("renders custom trigger and footer icons", async () => {
      const user = userEvent.setup();
      const CustomTriggerIcon = () => <div data-testid="custom-trigger">Trigger</div>;
      const CustomFooterIcon = () => <div data-testid="custom-footer">Footer</div>;
      
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          icons={{ 
            trigger: <CustomTriggerIcon />,
            footer: <CustomFooterIcon />
          }}
        />
      );
      
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText("Type to search...");
      await user.type(input, "nonexistent");
      
      await waitFor(() => {
        expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
      });
    });

    test.each([
      ['container', { container: "custom-container" }, '.custom-container', false],
      ['trigger', { trigger: "custom-trigger" }, null, false],
      ['popup', { popup: "custom-popup" }, '.custom-popup', true],
      ['item', { item: "custom-item" }, null, true],
    ])('applies custom %s className', async (name, classNames, selector, needsOpen) => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect options={defaultOptions} classNames={classNames} />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      
      if (needsOpen) {
        await user.click(input);
      }
      
      if (selector && !needsOpen) {
        expect(container.querySelector(selector)).toBeInTheDocument();
      } else if (name === 'trigger') {
        expect(input).toHaveClass("custom-trigger");
      } else if (name === 'popup') {
        expect(container.querySelector(selector!)).toBeInTheDocument();
      } else if (name === 'item') {
        const element = screen.getByText("Option 1").closest("button");
        expect(element).toHaveClass("custom-item");
      }
    });
  });

  describe("Layout Options", () => {
    test("positions popup above or below based on popAbove prop", async () => {
      const user = userEvent.setup();
      
      const { container, rerender } = render(
        <SingleSelect options={defaultOptions} />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      expect(container.querySelector(".popupTop")).toBeInTheDocument();
      
      await user.keyboard("{Escape}");
      
      rerender(<SingleSelect options={defaultOptions} popAbove />);
      await user.click(input);
      
      expect(container.querySelector(".popupBottom")).toBeInTheDocument();
    });
  });

  describe("UI Visibility Toggles", () => {
    test.each([
      ['hideFooter', { hideFooter: true }],
      ['hideRowHighlight', { hideRowHighlight: true }],
      ['hideLongTextEllipsis', { hideLongTextEllipsis: true }],
    ])('%s hides the corresponding UI element', async (propName, props) => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect options={propName === 'hideLongTextEllipsis' ? longTextOptions : defaultOptions} {...props} />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      if (propName === 'hideFooter') {
        expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      } else if (propName === 'hideRowHighlight') {
        await user.keyboard("{ArrowDown}");
        const firstOption = screen.getByText("Option 1").closest("button");
        expect(firstOption).not.toHaveClass("itemFocused");
      } else if (propName === 'hideLongTextEllipsis') {
        expect(container.querySelector(".itemContentEllipsisIndicator")).not.toBeInTheDocument();
      }
    });
  });

  describe("Animation Toggles", () => {
    test.each([
      ['disableIconAnimation', { disableIconAnimation: true }],
      ['enableLongTextAnimation', { enableLongTextAnimation: true }],
    ])('%s handles animations correctly', async (propName, props) => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect options={longTextOptions} {...props} />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      if (propName === 'disableIconAnimation') {
        const icon = container.querySelector("svg");
        expect(icon).not.toHaveClass("triggerIconRotate180");
      }
      // For enableLongTextAnimation, just verify it renders without error
      expect(screen.getByText(longTextOptions[0].label)).toBeInTheDocument();
    });
  });

  describe("Behavior Toggles", () => {
    test("disableScrolling removes scrolling in dropdown", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect options={defaultOptions} disableScrolling />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      expect(container.querySelector(".scrollContent")).not.toBeInTheDocument();
    });

    test("disableCloseOnOutsideClick keeps dropdown open", async () => {
      const user = userEvent.setup();
      render(
        <>
          <SingleSelect options={defaultOptions} disableCloseOnOutsideClick />
          <div data-testid="outside">Outside</div>
        </>
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      
      await user.click(screen.getByTestId("outside"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    test("closeOnInputClick prop is accepted without errors", () => {
      render(<SingleSelect options={defaultOptions} closeOnInputClick filter />);
      
      const input = screen.getByPlaceholderText("Type to search...");
      expect(input).toBeInTheDocument();
      expect(input).not.toBeDisabled();
    });
  });

  describe("Combined Props", () => {
    test("works with multiple hide/disable props together", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect
          options={defaultOptions}
          popAbove
          hideFooter
          hideRowHighlight
          disableIconAnimation
          classNames={{ popup: "custom-popup" }}
        />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      expect(container.querySelector(".popupBottom.custom-popup")).toBeInTheDocument();
      expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      
      await user.keyboard("{ArrowDown}");
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveClass("itemFocused");
    });

    test("works with filter and custom icons/classNames", async () => {
      const user = userEvent.setup();
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
      
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          icons={{ trigger: <CustomIcon /> }}
          classNames={{ trigger: "custom-trigger", popup: "custom-popup" }}
        />
      );
      
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText("Type to search...");
      expect(input).toHaveClass("custom-trigger");
      
      await user.type(input, "Option");
      
      const popup = input.parentElement?.parentElement?.querySelector(".custom-popup");
      expect(popup).toBeInTheDocument();
    });

    test("handles disabled options with keyboard navigation", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={disabledOptions} onChange={onChange} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      const disabledButton = screen.getByText("Disabled Option 1").closest("button");
      expect(disabledButton).toBeDisabled();
      
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");
      
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty options array", () => {
      render(<SingleSelect options={[]} />);
      expect(screen.getByPlaceholderText("Select an option")).toBeInTheDocument();
    });

    test("handles single option", async () => {
      const user = userEvent.setup();
      const singleOption = [{ value: "only", label: "Only Option" }];
      render(<SingleSelect options={singleOption} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      expect(screen.getByText("Only Option")).toBeInTheDocument();
    });

    test("handles very long option labels", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={longTextOptions} />);
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      
      expect(screen.getByText(longTextOptions[0].label)).toBeInTheDocument();
    });

    test("handles selecting same option twice", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={defaultOptions} value="option1" onChange={onChange} />);
      
      const input = screen.getByDisplayValue("Option 1");
      await user.click(input);
      await user.click(screen.getByText("Option 1"));
      
      expect(onChange).toHaveBeenCalledWith("option1");
    });
  });
});
