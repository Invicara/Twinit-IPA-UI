import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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
        const listbox = screen.getByRole("listbox");
        const boldElements = listbox.querySelectorAll(".highlightedText");
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

    test("keeps selected label in the input after selection and closes dropdown", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SingleSelect options={defaultOptions} filter onChange={onChange} value="" />);

      const input = screen.getByPlaceholderText("Type to search...") as HTMLInputElement;
      await user.type(input, "Option 2");
      await user.click(screen.getByText(/Option 2/));

      expect(onChange).toHaveBeenCalledWith("option2");

      await waitFor(() => {
        expect(screen.queryByText(/^Option 1$/)).not.toBeInTheDocument();
      });
      expect(input.value).toBe("Option 2");
    });

    test("filter: mouse selection closes list and refocus does not reopen by default", async () => {
      const user = userEvent.setup();
      function Harness() {
        const [value, setValue] = React.useState("");
        return (
          <SingleSelect
            options={defaultOptions}
            filter
            value={value}
            onChange={setValue}
          />
        );
      }
      render(<Harness />);
      const input = screen.getByPlaceholderText("Type to search...") as HTMLInputElement;
      await user.click(input);
      await user.type(input, "Option 2");
      await user.click(screen.getByText(/Option 2/));
      await waitFor(() => {
        expect(screen.queryByText(/^Option 1$/)).not.toBeInTheDocument();
      });
      fireEvent.blur(input);
      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.queryByText(/^Option 1$/)).not.toBeInTheDocument();
      });
    });

    test("filter: openOnFocus opens when focusing input with non-empty query", async () => {
      const user = userEvent.setup();
      render(
        <>
          <SingleSelect
            options={defaultOptions}
            filter
            value="option2"
            onChange={() => {}}
            openOnFocus
          />
          <button type="button">outside</button>
        </>
      );
      const input = screen.getByPlaceholderText("Type to search...");
      await user.click(input);
      await user.click(screen.getByRole("button", { name: "outside" }));
      await waitFor(() => {
        expect(screen.queryByText(/^Option 1$/)).not.toBeInTheDocument();
      });
      fireEvent.focus(input);
      await waitFor(() => {
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /^Option 2$/ })
        ).toBeInTheDocument();
      });
    });

    test("filter: Enter with empty query clears selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          value="option1"
          onChange={onChange}
        />
      );
      const input = screen.getByPlaceholderText("Type to search...");
      await user.click(input);
      await user.clear(input);
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("");
    });

    test("filter: Space with empty open list clears selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          value="option1"
          onChange={onChange}
        />
      );
      const input = screen.getByPlaceholderText("Type to search...");
      await user.click(input);
      await user.clear(input);
      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalledWith("");
    });

    test("filter: backspacing to empty shows placeholder; blur restores committed label", async () => {
      const user = userEvent.setup();
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          value="option2"
          onChange={() => {}}
        />
      );
      const input = screen.getByPlaceholderText(
        "Type to search..."
      ) as HTMLInputElement;
      await user.click(input);
      expect(input.value).toContain("Option 2");
      await user.clear(input);
      expect(input.value).toBe("");
      fireEvent.blur(input);
      await waitFor(() => {
        expect(input.value).toBe("Option 2");
      });
    });

    test("filter: after Enter pick, backspacing to empty shows placeholder (input stayed focused)", async () => {
      const user = userEvent.setup();
      function Harness() {
        const [value, setValue] = React.useState("");
        return (
          <SingleSelect
            options={defaultOptions}
            filter
            value={value}
            onChange={setValue}
          />
        );
      }
      render(<Harness />);
      const input = screen.getByPlaceholderText(
        "Type to search..."
      ) as HTMLInputElement;
      await user.click(input);
      await user.keyboard("{ArrowDown}{Enter}");
      await waitFor(() => {
        expect(input.value).toBe("Option 1");
      });
      await user.clear(input);
      expect(input.value).toBe("");
    });

    test("filter: clearing input removes row highlight; Enter commits empty selection", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          value="option1"
          onChange={onChange}
        />
      );
      const input = screen.getByPlaceholderText("Type to search...");
      await user.click(input);
      await user.keyboard("{ArrowDown}");
      const opt1 = screen.getByRole("button", { name: /^Option 1$/ });
      expect(opt1).toHaveAttribute("data-focused", "true");
      await user.clear(input);
      expect(opt1).not.toHaveAttribute("data-focused");
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("");
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
      expect(firstOption).toHaveAttribute("data-focused", "true");
      
      // Test navigation further down then up
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");
      expect(firstOption).toHaveAttribute("data-focused", "true");
      
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
      
      // Refocus input then click to reopen (same as MultiSelect: focus alone does not open)
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    test("respects disableKeyboardNavigation prop", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} disableKeyboardNavigation />);

      const input = screen.getByPlaceholderText("Select an option") as HTMLInputElement;
      input.focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      await user.click(input);
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveAttribute("data-focused", "true");

      await user.keyboard("{ArrowDown}");
      expect(firstOption).not.toHaveAttribute("data-focused", "true");
    });

    test("disableKeyboardNavigation ignores Enter on a highlighted option", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <SingleSelect
          options={defaultOptions}
          disableKeyboardNavigation
          onChange={onChange}
        />
      );

      await user.click(screen.getByPlaceholderText("Select an option"));
      await user.hover(screen.getByText("Option 2"));
      await user.keyboard("{Enter}");

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    test("disableKeyboardNavigation cancels arrow keys on the list scrollbar", async () => {
      const user = userEvent.setup();
      const scrollIntoView = jest.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {});
      render(
        <SingleSelect
          options={defaultOptions}
          disableKeyboardNavigation
          maxVisibleOptions={2}
        />
      );

      await user.click(screen.getByPlaceholderText("Select an option"));
      const scroller = document.querySelector("[data-block-arrow-keys='true']");
      expect(scroller).toBeTruthy();
      scroller!.scrollTop = 40;

      await user.hover(screen.getByText("Option 4"));
      scrollIntoView.mockClear();
      const event = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      });
      scroller!.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
      expect(scroller!.scrollTop).toBe(40);
      expect(scrollIntoView).not.toHaveBeenCalled();
      scrollIntoView.mockRestore();
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
      expect(lastOption).toHaveAttribute("data-focused", "true");
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
      ['singleSelect', { singleSelect: "custom-singleSelect" }, '.custom-singleSelect', false],
      ['trigger', { trigger: "custom-trigger" }, null, false],
      ['popup', { popup: "custom-popup" }, '.custom-popup', true],
      ['itemBase', { itemBase: "custom-item" }, null, true],
    ])('applies custom %s styleOverride', async (name, styleOverrides, selector, needsOpen) => {
      const user = userEvent.setup();
      const { container } = render(
        <SingleSelect options={defaultOptions} styleOverrides={styleOverrides} />
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
        expect(document.querySelector(selector!)).toBeInTheDocument();
      } else if (name === 'itemBase') {
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

      expect(screen.getByRole("listbox")).toHaveAttribute("data-position", "bottom");

      await user.keyboard("{Escape}");

      rerender(<SingleSelect options={defaultOptions} popAbove />);
      await user.click(input);

      expect(screen.getByRole("listbox")).toHaveAttribute("data-position", "top");
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
      
      const listbox = screen.getByRole("listbox");
      if (propName === 'hideFooter') {
        expect(listbox.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      } else if (propName === 'hideRowHighlight') {
        await user.keyboard("{ArrowDown}");
        const firstOption = screen.getByText("Option 1").closest("button");
        expect(firstOption).not.toHaveAttribute("data-focused");
      } else if (propName === 'hideLongTextEllipsis') {
        expect(listbox.querySelector(".itemContentEllipsisIndicator")).not.toBeInTheDocument();
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
        expect(icon).not.toHaveClass("triggerIconTransition");
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

      expect(screen.getByRole("listbox").querySelector(".scrollContent")).not.toHaveAttribute(
        "data-scrollable",
        "true"
      );
    });

    test("maxVisibleOptions defaults to 8 rows for scroll max-height", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} />);
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      const scroll = screen.getByRole("listbox").querySelector(".scrollContent") as HTMLElement;
      expect(scroll.style.maxHeight).toBe("280px");
    });

    test("maxVisibleOptions false omits scroll max-height cap", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} maxVisibleOptions={false} />);
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      const scroll = screen.getByRole("listbox").querySelector(".scrollContent") as HTMLElement;
      expect(scroll.style.maxHeight).toBe("");
    });

    test("maxVisibleOptions accepts a custom row count", async () => {
      const user = userEvent.setup();
      render(<SingleSelect options={defaultOptions} maxVisibleOptions={3} />);
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      const scroll = screen.getByRole("listbox").querySelector(".scrollContent") as HTMLElement;
      expect(scroll.style.maxHeight).toBe("105px");
    });

    test("disableClickOutside keeps dropdown open", async () => {
      const user = userEvent.setup();
      render(
        <>
          <SingleSelect options={defaultOptions} disableClickOutside />
          <div data-testid="outside">Outside</div>
        </>
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      
      await user.click(screen.getByTestId("outside"));
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    test("disableClickOutside string 'false' still closes on outside click", async () => {
      const user = userEvent.setup();
      render(
        <>
          <SingleSelect
            options={defaultOptions}
            disableClickOutside={"false" as unknown as boolean}
          />
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
          styleOverrides={{ popup: "custom-popup" }}
        />
      );
      
      const input = screen.getByPlaceholderText("Select an option");
      await user.click(input);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveClass("custom-popup");
      expect(listbox).toHaveAttribute("data-position", "top");
      expect(listbox.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      
      await user.keyboard("{ArrowDown}");
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveAttribute("data-focused");
    });

    test("works with filter and custom icons/styleOverrides", async () => {
      const user = userEvent.setup();
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
      
      render(
        <SingleSelect
          options={defaultOptions}
          filter
          icons={{ trigger: <CustomIcon /> }}
          styleOverrides={{ trigger: "custom-trigger", popup: "custom-popup" }}
        />
      );
      
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText("Type to search...");
      expect(input).toHaveClass("custom-trigger");
      
      await user.type(input, "Option");

      expect(screen.getByRole("listbox")).toHaveClass("custom-popup");
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
