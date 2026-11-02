# Icons

`@dtplatform/ipa-ui` does not export any icon components. Components use icons from external libraries (bundled into the package) plus one internal custom icon. This page lists them so you can match the visuals in your app.

## XIcon (internal)

A simple "X" (close) icon, 16×16, filled with `currentColor` so it inherits text color. It is **not exported** from the package in 2.0.x (`import { XIcon } from '@dtplatform/ipa-ui'` does not resolve); it is used internally as the default badge remove icon in **MultiSelect**.

To change it, pass your own node through MultiSelect's `icons.badgeClose`, or hide it with `hideBadgeRemove`. To style the default one, use the `badgeRemoveIcon` slot of `styleOverrides` (see [Dropdown](dropdown.md#styling-styleoverrides)).

---

## Icon libraries used by components

These libraries are regular `dependencies` of `@dtplatform/ipa-ui` and are bundled into its build, so you do **not** need to install them for the components to work. If you want to use the same icons in your own code, add the library to your app's dependencies yourself rather than relying on the copy installed with ipa-ui.

- **[Lucide React](https://lucide.dev/)** (`lucide-react`, ipa-ui uses `^0.477.0`): Accordion chevron, Checkbox check / indeterminate marks, Input password toggle and clear button, Dialog close, Breadcrumb separator and ellipsis, Calendar / DatePicker, Command search, DropdownMenu check, and Table filters, toolbar, column headers and pagination. Install: `npm i lucide-react`.
- **[Radix UI Icons](https://www.radix-ui.com/icons)** (`@radix-ui/react-icons`): the chevron of **SingleSelect** and **MultiSelect** (trigger and list footer). Install: `npm i @radix-ui/react-icons`.

`remixicon-react` is also listed in ipa-ui's dependencies, but no component uses it.

Components that show a caller-supplied icon (e.g. Link `icon`, Input `icon`, SingleSelect / MultiSelect `icons`) accept any React node, so any icon library works there.

When building UIs that match IPA components (e.g. custom buttons or inputs), prefer the same library and icon names as in the component stories so visuals stay consistent.
