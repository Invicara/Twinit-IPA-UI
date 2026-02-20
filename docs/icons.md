# Icons

`@invicara/ipa-ui` provides a small set of custom icons and documents how to use external icon libraries that are already dependencies of the package.

## XIcon (custom)

A simple “X” (close) icon, e.g. for dialog close buttons or dismiss controls.

### Import

```tsx
import { XIcon } from '@invicara/ipa-ui';
```

### Usage

```tsx
<XIcon />
<XIcon className="w-5 h-5 text-neutral-50" />
```

**Props:** Accepts `className` (and any SVG attributes passed through to the root `<svg>`). Size is 16×16 by default; override with `className` (e.g. Tailwind `w-5 h-5`). Color follows `currentColor` so it inherits text color.

---

## Other icon libraries

The design system does not export icon sets; it uses these libraries internally and you can use them in your app for consistency:

- **[Lucide React](https://lucide.dev/)** – Used in many components (e.g. Accordion chevron, Input password toggle, Dialog close). Install in your app: `npm i lucide-react`. Use the same icon names as in Storybook for consistency.
- **[Radix UI Icons](https://www.radix-ui.com/icons)** – Used in some components (e.g. Link pencil icon, Dropdown chevron). Install: `@radix-ui/react-icons`.
- **[Remix Icon](https://remixicon.com/)** – Available via `remixicon-react`. Check the package’s peer dependencies if you use Remix icons.

When building UIs that match IPA components (e.g. custom buttons or inputs), prefer the same library and icon names as in the component stories so visuals stay consistent.
