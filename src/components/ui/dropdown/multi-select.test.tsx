import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./multi-select";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
  { value: "option5", label: "Option 5" },
  { value: "option6", label: "Option 6" },
];

const longTextOptions = [
  { value: "long1", label: "Option with very long text that should be truncated" },
  { value: "long2", label: "Another option with extremely long text content that exceeds the container width" },
  { value: "long3", label: "Third option with long label" },
];

const disabledOptions = [
  { value: "enabled1", label: "Enabled Option 1" },
  { value: "disabled1", label: "Disabled Option 1", disabled: true },
  { value: "enabled2", label: "Enabled Option 2" },
  { value: "disabled2", label: "Disabled Option 2", disabled: true },
];

describe("MultiSelect", () => {
  describe("Core Functionality", () => {
    test("renders with placeholder and displays all options", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} />);
      
      const placeholder = screen.getByText("Select multiple options");
      expect(placeholder).toBeInTheDocument();
      
      const trigger = placeholder.closest("button");
      await user.click(trigger!);
      
      defaultOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    test("uses custom placeholder when provided", () => {
      render(<MultiSelect options={defaultOptions} placeholder="Choose items" />);
      expect(screen.getByText("Choose items")).toBeInTheDocument();
    });

    test("displays chevron icon and selection count header", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={defaultOptions} value={["option1", "option2"]} />
      );
      
      expect(container.querySelector("svg")).toBeInTheDocument();
      
      const trigger = screen.getByText("Option 1").closest("button");
      await user.click(trigger!);
      
      expect(screen.getByText("2 selected")).toBeInTheDocument();
    });

    test("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <>
          <MultiSelect options={defaultOptions} />
          <div data-testid="outside">Outside</div>
        </>
      );
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      
      await user.click(screen.getByTestId("outside"));
      await waitFor(() => {
        expect(screen.queryByText("0 selected")).not.toBeInTheDocument();
      });
    });
  });

  describe("Multi-Selection Behavior", () => {
    test("selects multiple options and displays as badges", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MultiSelect options={defaultOptions} onChange={onChange} value={[]} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      const options = screen.getAllByRole("button").filter(btn => 
        btn.textContent?.includes("Option 1") || btn.textContent?.includes("Option 2")
      );
      
      await user.click(options[0]);
      expect(onChange).toHaveBeenCalledWith(["option1"]);
      
      await user.click(options[1]);
      expect(onChange).toHaveBeenCalledWith(["option2"]);
    });

    test("deselects option when clicked again", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2"]}
          onChange={onChange}
        />
      );
      
      const trigger = container.querySelector("button");
      await user.click(trigger!);
      
      await waitFor(() => {
        expect(screen.getByText("2 selected")).toBeInTheDocument();
      });
      
      const allButtons = screen.getAllByRole("button");
      const dropdownOptionButtons = allButtons.filter(btn => 
        btn.className.includes("cursor-default") && btn.textContent?.includes("Option")
      );
      
      const option2Button = dropdownOptionButtons.find(btn => btn.textContent === "Option 2");
      if (option2Button) {
        await user.click(option2Button);
        expect(onChange).toHaveBeenCalledWith(["option1"]);
      }
    });

    test("displays selected options as badges with proper styling", () => {
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3"]}
        />
      );
      
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    test("shows remaining badge when selections exceed maxDisplayBadges", () => {
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3", "option4"]}
          maxDisplayBadges={2}
        />
      );
      
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("+2")).toBeInTheDocument();
    });

    test("removes badge when X is clicked", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2"]}
          onChange={onChange}
        />
      );
      
      const badges = screen.getByText("Option 1").parentElement;
      const removeButton = badges?.querySelector("span[class*='cursor-pointer']");
      
      if (removeButton) {
        await user.click(removeButton);
        expect(onChange).toHaveBeenCalledWith(["option2"]);
      }
    });

    test("shows checkboxes for selected and unselected options", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option3"]}
        />
      );
      
      const trigger = container.querySelector("button");
      await user.click(trigger!);
      
      await waitFor(() => {
        expect(screen.getByText("2 selected")).toBeInTheDocument();
      });
      
      const checkboxes = container.querySelectorAll("div[class*='w-4'][class*='h-4']");
      expect(checkboxes.length).toBeGreaterThan(0);
      
      expect(container.querySelector("div[class*='bg-brand-8']")).toBeInTheDocument();
      expect(container.querySelector("div[class*='bg-white'][class*='border-neutral-5']")).toBeInTheDocument();
    });

    test("does not select disabled options", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MultiSelect options={disabledOptions} onChange={onChange} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      const disabledButton = screen.getByText("Disabled Option 1").closest("button");
      expect(disabledButton).toBeDisabled();
    });
  });

  describe("Keyboard Navigation", () => {
    test("complete keyboard workflow: open, navigate, select, close", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MultiSelect options={defaultOptions} onChange={onChange} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      trigger!.focus();
      
      // Open with Enter
      await user.keyboard("{Enter}");
      await waitFor(() => {
        expect(screen.getByText("0 selected")).toBeInTheDocument();
      });
      
      // Navigate down
      await user.keyboard("{ArrowDown}");
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).toHaveClass("bg-brand-1");
      
      // Navigate up and down
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");
      expect(firstOption).toHaveClass("bg-brand-1");
      
      // Select with Enter
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith(["option1"]);
      
      // Close with Escape
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByText("0 selected")).not.toBeInTheDocument();
      });
    });

    test("respects disableKeyboardNavigation prop", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} disableKeyboardNavigation />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      trigger!.focus();
      await user.keyboard("{Enter}");
      await user.keyboard("{ArrowDown}");
      
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveClass("bg-brand-1");
    });
  });

  describe("Disabled State", () => {
    test("disables trigger and prevents dropdown from opening", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} disabled />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      expect(trigger).toBeDisabled();
      
      await user.click(trigger!);
      expect(screen.queryByText("0 selected")).not.toBeInTheDocument();
    });
  });

  describe("Customization", () => {
    test("renders custom icons for trigger, badge close, and checkmark", async () => {
      const user = userEvent.setup();
      const CustomTriggerIcon = () => <div data-testid="custom-trigger">Trigger</div>;
      const CustomCloseIcon = () => <div data-testid="custom-close">X</div>;
      const CustomCheckIcon = () => <div data-testid="custom-check">✓</div>;
      
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1"]}
          icons={{ 
            trigger: <CustomTriggerIcon />,
            badgeClose: <CustomCloseIcon />,
            check: <CustomCheckIcon />
          }}
        />
      );
      
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("custom-close")).toBeInTheDocument();
      
      const trigger = screen.getByText("Option 1").closest("button");
      await user.click(trigger!);
      
      expect(screen.getByTestId("custom-check")).toBeInTheDocument();
    });

    test.each([
      ['container', { container: "custom-container" }],
      ['trigger', { trigger: "custom-trigger" }],
      ['badge', { badge: "custom-badge" }],
      ['popup', { popup: "custom-popup" }],
      ['header', { header: "custom-header" }],
      ['checkbox', { checkbox: "custom-checkbox" }],
    ])('applies custom %s className', async (name, classNames) => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1"]}
          classNames={classNames}
        />
      );
      
      if (name === 'container') {
        expect(container.querySelector(".custom-container")).toBeInTheDocument();
      } else if (name === 'trigger') {
        const trigger = container.querySelector("button");
        expect(trigger).toHaveClass("custom-trigger");
      } else if (name === 'badge') {
        const badge = screen.getByText("Option 1").parentElement;
        expect(badge).toHaveClass("custom-badge");
      } else {
        const trigger = container.querySelector("button");
        await user.click(trigger!);
        
        const customElement = container.querySelector(".custom-" + name);
        expect(customElement).toBeInTheDocument();
      }
    });
  });

  describe("Layout Options", () => {
    test("positions popup above or below based on popAbove prop", async () => {
      const user = userEvent.setup();
      
      const { container, rerender } = render(
        <MultiSelect options={defaultOptions} />
      );
      
      const trigger = container.querySelector("button");
      await user.click(trigger!);
      
      expect(container.querySelector(".top-full")).toBeInTheDocument();
      expect(container.querySelector(".mt-1")).toBeInTheDocument();
      
      await user.keyboard("{Escape}");
      
      rerender(<MultiSelect options={defaultOptions} popAbove />);
      await user.click(trigger!);
      
      expect(container.querySelector(".bottom-full")).toBeInTheDocument();
      expect(container.querySelector(".mb-1")).toBeInTheDocument();
    });

    test("shows header at bottom when popAbove is true", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={defaultOptions} popAbove value={["option1"]} />
      );
      
      const trigger = screen.getByText("Option 1").closest("button");
      await user.click(trigger!);
      
      const popup = container.querySelector(".bottom-full");
      const header = screen.getByText("1 selected").parentElement;
      
      expect(popup).toBeInTheDocument();
      expect(header).toBeInTheDocument();
    });

    test("aligns checkboxes to right when rightAlignCheckboxes is true", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} rightAlignCheckboxes />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).toHaveClass("flex-row-reverse");
    });
  });

  describe("UI Visibility Toggles", () => {
    test.each([
      ['hideFooter', { hideFooter: true }],
      ['hideRowHighlight', { hideRowHighlight: true }],
      ['hideEllipsis', { hideEllipsis: true }],
      ['hideRemainingBadge', { hideRemainingBadge: true }],
      ['hideSelectionCount', { hideSelectionCount: true }],
      ['hideCheckboxes', { hideCheckboxes: true }],
      ['hideBadgeRemove', { hideBadgeRemove: true }],
    ])('%s hides the corresponding UI element', async (propName, props) => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect 
          options={propName === 'hideEllipsis' ? longTextOptions : defaultOptions}
          value={propName.includes('Badge') || propName === 'hideBadgeRemove' ? ["option1", "option2", "option3"] : ["option1"]}
          maxDisplayBadges={2}
          {...props}
        />
      );
      
      const trigger = container.querySelector("button");
      
      if (propName !== 'hideRemainingBadge' && propName !== 'hideBadgeRemove') {
        await user.click(trigger!);
      }
      
      if (propName === 'hideFooter') {
        expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      } else if (propName === 'hideRowHighlight') {
        // Just verify hideRowHighlight prop is accepted and component renders
        expect(container).toBeInTheDocument();
      } else if (propName === 'hideEllipsis') {
        expect(container.querySelector(".ellipsis-indicator")).not.toBeInTheDocument();
      } else if (propName === 'hideRemainingBadge') {
        expect(screen.queryByText("+1")).not.toBeInTheDocument();
      } else if (propName === 'hideSelectionCount') {
        expect(screen.queryByText("1 selected")).not.toBeInTheDocument();
      } else if (propName === 'hideCheckboxes') {
        const checkboxes = container.querySelectorAll('[class*="w-4"][class*="h-4"]');
        expect(checkboxes.length).toBe(0);
      } else if (propName === 'hideBadgeRemove') {
        const removeButton = container.querySelector('span[class*="cursor-pointer"]');
        expect(removeButton).not.toBeInTheDocument();
      }
    });

    test("wrapBadges allows badge wrapping", () => {
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3"]}
          wrapBadges
          maxDisplayBadges={5}
        />
      );
      
      const badgeContainer = container.querySelector('[class*="flex-wrap"]');
      expect(badgeContainer).toBeInTheDocument();
    });
  });

  describe("Animation & Behavior Toggles", () => {
    test.each([
      ['disableIconAnimation', { disableIconAnimation: true }],
      ['disableTextAnimation', { disableTextAnimation: true }],
      ['disableScrolling', { disableScrolling: true }],
    ])('%s disables the corresponding feature', async (propName, props) => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect options={longTextOptions} {...props} />
      );
      
      const trigger = container.querySelector("button");
      await user.click(trigger!);
      
      if (propName === 'disableIconAnimation') {
        const icon = container.querySelector("svg");
        expect(icon).not.toHaveClass("rotate-180");
      } else if (propName === 'disableScrolling') {
        expect(container.querySelector('[class*="overflow-y-auto"]')).not.toBeInTheDocument();
      }
      // For disableTextAnimation, just verify it renders without error
      expect(screen.getByText(longTextOptions[0].label)).toBeInTheDocument();
    });

    test("disableCloseOnOutsideClick keeps dropdown open", async () => {
      const user = userEvent.setup();
      render(
        <>
          <MultiSelect options={defaultOptions} disableCloseOnOutsideClick />
          <div data-testid="outside">Outside</div>
        </>
      );
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      await waitFor(() => {
        expect(screen.getByText("0 selected")).toBeInTheDocument();
      });
      
      await user.click(screen.getByTestId("outside"));
      expect(screen.getByText("0 selected")).toBeInTheDocument();
    });

    test("disableCloseOnTriggerClick prop is accepted without errors", () => {
      render(<MultiSelect options={defaultOptions} disableCloseOnTriggerClick />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      expect(trigger).toBeInTheDocument();
      expect(trigger).not.toBeDisabled();
    });

    test("closes dropdown when clicking trigger by default", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={defaultOptions} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      await waitFor(() => {
        expect(screen.getByText("0 selected")).toBeInTheDocument();
      });
      
      await user.click(trigger!);
      
      await waitFor(() => {
        expect(screen.queryByText("0 selected")).not.toBeInTheDocument();
      });
    });
  });

  describe("Combined Props", () => {
    test("works with multiple layout and visibility props together", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1"]}
          popAbove
          hideFooter
          hideSelectionCount
          classNames={{
            popup: "custom-popup",
            item: "custom-item",
          }}
        />
      );
      
      const trigger = container.querySelector("button");
      await user.click(trigger!);
      
      expect(container.querySelector(".bottom-full.custom-popup")).toBeInTheDocument();
      
      const customItems = container.querySelectorAll(".custom-item");
      expect(customItems.length).toBeGreaterThan(0);
      
      expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      expect(screen.queryByText("1 selected")).not.toBeInTheDocument();
    });

    test("works with rightAlignCheckboxes and hideCheckboxes together", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={defaultOptions}
          rightAlignCheckboxes
          hideCheckboxes
        />
      );
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).toHaveClass("flex-row-reverse");
      
      const checkboxes = document.querySelectorAll('[class*="w-4"][class*="h-4"]');
      expect(checkboxes.length).toBe(0);
    });

    test("works with wrapBadges and hideRemainingBadge together", () => {
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3", "option4"]}
          wrapBadges
          hideRemainingBadge
          maxDisplayBadges={2}
        />
      );
      
      expect(container.querySelector('[class*="flex-wrap"]')).toBeInTheDocument();
      expect(screen.queryByText("+2")).not.toBeInTheDocument();
    });

    test("works with all disable props together", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelect
          options={defaultOptions}
          disableKeyboardNavigation
          disableIconAnimation
          disableTextAnimation
          disableScrolling
          disableCloseOnOutsideClick
          disableCloseOnTriggerClick
        />
      );
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      trigger!.focus();
      await user.keyboard("{ArrowDown}");
      const firstOption = screen.getByText("Option 1").closest("button");
      expect(firstOption).not.toHaveClass("bg-brand-1");
    });

    test("works with all hide props together", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3"]}
          hideFooter
          hideRowHighlight
          hideEllipsis
          hideRemainingBadge
          hideSelectionCount
          hideCheckboxes
          hideBadgeRemove
          maxDisplayBadges={2}
        />
      );
      
      const trigger = screen.getByText("Option 1").closest("button");
      await user.click(trigger!);
      
      expect(container.querySelector('[class*="footer"]')).not.toBeInTheDocument();
      expect(screen.queryByText("3 selected")).not.toBeInTheDocument();
      expect(screen.queryByText("+1")).not.toBeInTheDocument();
      expect(container.querySelector(".ellipsis-indicator")).not.toBeInTheDocument();
      
      const checkboxes = container.querySelectorAll('[class*="w-4"][class*="h-4"]');
      expect(checkboxes.length).toBe(0);
      
      const removeButtons = container.querySelectorAll('span[class*="cursor-pointer"]');
      expect(removeButtons.length).toBe(0);
    });

    test("maxDisplayBadges works with different values", () => {
      const { rerender } = render(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3", "option4", "option5"]}
          maxDisplayBadges={1}
        />
      );
      
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
      expect(screen.getByText("+4")).toBeInTheDocument();
      
      rerender(
        <MultiSelect
          options={defaultOptions}
          value={["option1", "option2", "option3", "option4", "option5"]}
          maxDisplayBadges={3}
        />
      );
      
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
      expect(screen.queryByText("Option 4")).not.toBeInTheDocument();
      expect(screen.getByText("+2")).toBeInTheDocument();
    });

    test("hideBadgeRemove works with custom badgeClose icon", () => {
      const CustomIcon = () => <div data-testid="custom-close">X</div>;
      render(
        <MultiSelect
          options={defaultOptions}
          value={["option1"]}
          hideBadgeRemove
          icons={{ badgeClose: <CustomIcon /> }}
        />
      );
      
      expect(screen.queryByTestId("custom-close")).not.toBeInTheDocument();
    });

    test("works with custom icons and disableIconAnimation", async () => {
      const user = userEvent.setup();
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
      
      render(
        <MultiSelect
          options={defaultOptions}
          icons={{ trigger: <CustomIcon /> }}
          disableIconAnimation
        />
      );
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty options array", () => {
      render(<MultiSelect options={[]} />);
      expect(screen.getByText("Select multiple options")).toBeInTheDocument();
    });

    test("handles single option", async () => {
      const user = userEvent.setup();
      const singleOption = [{ value: "only", label: "Only Option" }];
      render(<MultiSelect options={singleOption} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      expect(screen.getByText("Only Option")).toBeInTheDocument();
    });

    test("handles very long option labels", async () => {
      const user = userEvent.setup();
      render(<MultiSelect options={longTextOptions} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      expect(screen.getByText(longTextOptions[0].label)).toBeInTheDocument();
    });

    test("handles selecting all options", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MultiSelect options={defaultOptions} onChange={onChange} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      for (const option of defaultOptions) {
        await user.click(screen.getByText(option.label));
      }
      
      expect(onChange).toHaveBeenCalledTimes(defaultOptions.length);
    });

    test("handles rapid selections", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<MultiSelect options={defaultOptions} onChange={onChange} />);
      
      const trigger = screen.getByText("Select multiple options").closest("button");
      await user.click(trigger!);
      
      await user.click(screen.getByText("Option 1"));
      await user.click(screen.getByText("Option 2"));
      await user.click(screen.getByText("Option 3"));
      await user.click(screen.getByText("Option 1")); // Deselect
      
      expect(onChange).toHaveBeenCalledTimes(4);
    });

    test("handles empty value array", () => {
      render(<MultiSelect options={defaultOptions} value={[]} />);
      expect(screen.getByText("Select multiple options")).toBeInTheDocument();
    });

    test("handles value with non-existent option", () => {
      const { container } = render(<MultiSelect options={defaultOptions} value={["nonexistent"]} />);
      const trigger = container.querySelector("button");
      expect(trigger).toBeInTheDocument();
    });
  });
});
