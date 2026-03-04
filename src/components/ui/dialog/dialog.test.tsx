import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import util from "util";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog } from "./dialog";
import type { DialogProps } from "./dialog"

const defaultTitle = "Sample Dialog";
const customFooter = <button data-testid="custom-footer">Custom Action</button>;

const defaultContent = <p>Dialog body content</p>;

const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((...args) => {
    const message = util.format(...args);
    if (message.includes("Missing `Description` or `aria-describedby")) {
      return;
    }
    originalWarn.apply(console, args);
  });
});

afterAll(() => {
  (console.warn as jest.Mock).mockRestore();
});

const ensureDescription = (node: React.ReactNode) => {
  if (React.isValidElement(node)) {
    if (node.type === DialogPrimitive.Description) {
      return node;
    }

    if (node.type === React.Fragment) {
      return (
        <DialogPrimitive.Description asChild>
          <div id="dialog-description" data-testid="dialog-body">
            {node.props.children}
          </div>
        </DialogPrimitive.Description>
      );
    }

    return (
      <DialogPrimitive.Description asChild>
        {React.cloneElement(node, {
          id: "dialog-description",
          "data-testid": node.props["data-testid"] ?? "dialog-body",
        })}
      </DialogPrimitive.Description>
    );
  }

  return (
    <DialogPrimitive.Description asChild>
      <div id="dialog-description" data-testid="dialog-body">
        {node}
      </div>
    </DialogPrimitive.Description>
  );
};

const renderDialog = (props: Partial<DialogProps> = {}) => {
  const {
    open = true,
    onOpenChange = jest.fn(),
    title = defaultTitle,
    children = defaultContent,
    ...rest
  } = props;

  const content = ensureDescription(children);

  const result = render(
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      aria-describedby="dialog-description"
      {...rest}
    >
      {content}
    </Dialog>
  );

  return { ...result, onOpenChange };
};

const findOverlay = () => document.body.querySelector('[data-testid="ipa_dialog_overlay"]');

describe("Dialog", () => {
  describe("Core Rendering", () => {
    test("renders title, body, and custom footer content", () => {
      renderDialog({ footer: customFooter });

      expect(screen.getByText(defaultTitle)).toBeInTheDocument();
      expect(screen.getByTestId("dialog-body")).toBeInTheDocument();
      expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test.each([
      ["sm", "sm"],
      ["default", "default"],
      ["lg", "lg"],
      ["xl", "xl"],
      ["full", "full"],
    ] as const)("applies data-size '%s'", (size, expectedDataSize) => {
      renderDialog({ size });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("data-size", expectedDataSize);
    });
  });

  describe("Open State & Closing Mechanics", () => {
    test("invokes onOpenChange when close button is clicked", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      const closeButton = screen.getByLabelText("Close");
      await user.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("invokes onOpenChange when overlay is clicked", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      const overlay = findOverlay();
      expect(overlay).toBeInTheDocument();

      await user.click(overlay as Element);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("closes when Escape is pressed by default", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      const dialog = screen.getByRole("dialog");
      dialog.focus();
      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("respects controlled closed state", () => {
      renderDialog({ open: false });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Feature Toggles", () => {
    test("hideOverlay removes the overlay element", () => {
      renderDialog({ hideOverlay: true });
      expect(findOverlay()).not.toBeInTheDocument();
    });

    test("disableCloseButton hides the close control", () => {
      renderDialog({ disableCloseButton: true });
      expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
    });

    test("disableClickOutside prevents overlay from closing dialog", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog({ disableClickOutside: true });

      const overlay = findOverlay();
      expect(overlay).toBeInTheDocument();

      await user.click(overlay as Element);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    test("disableEscapeKey prevents closing with Escape", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog({ disableEscapeKey: true });

      const dialog = screen.getByRole("dialog");
      dialog.focus();
      await user.keyboard("{Escape}");

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    test("acknowledgment renders OK button and triggers close on click", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog({ acknowledgment: true });

      const okButton = screen.getByText("OK");
      expect(okButton).toBeInTheDocument();

      await user.click(okButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("passive hides footer even when footer prop is provided", () => {
      renderDialog({ passive: true, footer: customFooter });
      expect(screen.queryByTestId("custom-footer")).not.toBeInTheDocument();
      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  });

  describe("Custom Class Names", () => {
    const footerWithButtons = (
      <div>
        <button type="button">Cancel</button>
      </div>
    );

    const classNameCases: Array<{
      key: keyof NonNullable<DialogProps["classNames"]>;
      className: string;
      query: () => Element | null;
    }> = [
      {
        key: "dialog",
        className: "custom-dialog",
        query: () => document.body.querySelector(".custom-dialog"),
      },
      {
        key: "content",
        className: "custom-content",
        query: () => screen.getByRole("dialog"),
      },
      {
        key: "header",
        className: "custom-header",
        query: () => screen.getByText(defaultTitle).closest("div"),
      },
      {
        key: "title",
        className: "custom-title",
        query: () => screen.getByText(defaultTitle),
      },
      {
        key: "closeButton",
        className: "custom-close",
        query: () => screen.getByLabelText("Close"),
      },
      {
        key: "body",
        className: "custom-body",
        query: () => screen.getByTestId("dialog-body").parentElement,
      },
      {
        key: "footer",
        className: "custom-footer",
        query: () => document.body.querySelector(".custom-footer"),
      },
    ];

    test.each(classNameCases)(
      "applies custom classNames.%s",
      ({ key, className, query }) => {
        const classNames = { [key]: className } as DialogProps["classNames"];
        renderDialog({
          classNames,
          footer: key === "footer" ? footerWithButtons : customFooter,
        });

        const element = query();
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass(className);
      }
    );

    test("applies additional className to content", () => {
      renderDialog({ className: "bordered-dialog" });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("bordered-dialog");
    });
  });

  describe("Combined props", () => {
    test("supports hideOverlay with acknowledgment and custom className", async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog({
        hideOverlay: true,
        acknowledgment: true,
        className: "rounded-dialog",
      });

      expect(findOverlay()).not.toBeInTheDocument();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("rounded-dialog");

      await user.click(screen.getByText("OK"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("supports passive dialogs with custom classNames", () => {
      renderDialog({
        passive: true,
        classNames: {
          content: "custom-content",
          body: "custom-body",
        },
      });

      expect(screen.getByRole("dialog")).toHaveClass("custom-content");
      expect(screen.getByTestId("dialog-body").parentElement).toHaveClass("custom-body");
      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("renders without footer when footer prop is omitted", () => {
      renderDialog({ footer: undefined });
      expect(screen.queryByTestId("custom-footer")).not.toBeInTheDocument();
    });

    test("renders provided children content", () => {
      renderDialog({ children: <div>Custom body</div> });
      expect(screen.getByText("Custom body")).toBeInTheDocument();
    });
  });
});

