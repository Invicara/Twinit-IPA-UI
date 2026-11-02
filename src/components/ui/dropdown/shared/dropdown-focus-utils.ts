/**
 * After closing a dropdown from the keyboard, move focus to the next/previous
 * focusable in tab order. Excludes portaled dropdown list items.
 * Uses tabIndex + document order (HTML tab order) so the next field matches browser Tab.
 */
export function moveFocusAfterCloseFromElement(
  origin: HTMLElement | null,
  e: Pick<KeyboardEvent, "shiftKey">
): void {
  const collect = (): HTMLElement[] =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      if (el.closest("[data-ipa-ui-dropdown-floating]")) return false;
      const style = window.getComputedStyle(el);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) {
        return false;
      }
      if (el.hasAttribute("disabled")) return false;
      return true;
    });

  const tabOrderSort = (a: HTMLElement, b: HTMLElement) => {
    const ta = a.tabIndex < 0 ? 0 : a.tabIndex;
    const tb = b.tabIndex < 0 ? 0 : b.tabIndex;
    if (ta !== tb) return ta - tb;
    const pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  };

  const run = () => {
    origin?.blur();

    const raw = collect();
    const focusableElements = [...raw].sort(tabOrderSort);
    let currentIndex = origin ? focusableElements.indexOf(origin) : -1;

    if (currentIndex >= 0) {
      const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < focusableElements.length) {
        focusableElements[nextIndex]?.focus();
      }
      return;
    }

    if (!origin || !origin.isConnected) return;

    const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
    const PRECEDING = Node.DOCUMENT_POSITION_PRECEDING;

    if (e.shiftKey) {
      const preceding = focusableElements.filter(
        (el) =>
          el !== origin && origin.compareDocumentPosition(el) & PRECEDING
      );
      preceding.sort(tabOrderSort);
      preceding[preceding.length - 1]?.focus();
    } else {
      const following = focusableElements.filter(
        (el) =>
          el !== origin && origin.compareDocumentPosition(el) & FOLLOWING
      );
      following.sort(tabOrderSort);
      following[0]?.focus();
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(run, 0);
    });
  });
}
