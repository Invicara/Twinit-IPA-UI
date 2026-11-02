# Breadcrumb

Navigation breadcrumbs for showing the user’s location in a hierarchy. Renders as a `<nav aria-label="breadcrumb">` with a list of links and optional separators.

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## API

- **Breadcrumb** – Root `<nav aria-label="breadcrumb">` with `data-testid="ipa_breadcrumb"`. Accepts standard `nav` props plus `styleOverrides` (`Record<string, string>`, see **Styling**).
- **BreadcrumbList** – `<ol>` wrapper. Accepts `className` and `ol` props.
- **BreadcrumbItem** – `<li>` wrapper for each segment. Accepts `className` and `li` props.
- **BreadcrumbLink** – Link segment. Pass `href` and optional `asChild` to render a custom element (e.g. React Router’s `Link`) as the link.
- **BreadcrumbPage** – Current page (non-clickable). Renders a `<span>` with `role="link"`, `aria-disabled="true"` and `aria-current="page"`. Use for the last item.
- **BreadcrumbSeparator** – Between items. Renders an `<li role="presentation">` (place it directly inside `BreadcrumbList`, not inside a `BreadcrumbItem`) with a chevron by default; pass `children` to use a custom character or icon.
- **BreadcrumbEllipsis** – For truncated middle segments (e.g. “…”). Renders a `<span>` with a "more" icon. The whole element is `aria-hidden`, so its visually hidden "More" text is not announced; give the surrounding control its own label if the ellipsis is interactive.

## Examples

**Custom separator**

```tsx
<BreadcrumbSeparator>/</BreadcrumbSeparator>
```

**With ellipsis (e.g. many segments)**

```tsx
<BreadcrumbItem>
  <BreadcrumbLink href="/">Home</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem>
  <BreadcrumbPage>Current</BreadcrumbPage>
</BreadcrumbItem>
```

**Using `asChild` with React Router**

```tsx
<BreadcrumbLink asChild href="/docs">
  <Link to="/docs">Docs</Link>
</BreadcrumbLink>
```

## Styling

Apply `className` to any part (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) to match your design system. The component uses internal CSS modules for base layout and typography.

For deeper overrides, pass `styleOverrides` to the `Breadcrumb` root; it is shared with all subcomponents. Slot keys: `breadcrumb` (nav), `list`, `item`, `link`, `page`, `separator`, `ellipsis`, `ellipsisIcon`, `srOnly`.

```tsx
<Breadcrumb styleOverrides={{ link: 'my-link', separator: 'my-separator' }}>
  {/* ... */}
</Breadcrumb>
```

## Accessibility

The root uses `aria-label="breadcrumb"`. The current page is marked with `aria-current="page"`. Separators and ellipsis are `aria-hidden="true"` so they don’t clutter screen-reader output.
