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

- **Breadcrumb** – Root `<nav aria-label="breadcrumb">`. Accepts standard `nav` props.
- **BreadcrumbList** – `<ol>` wrapper. Accepts `className` and `ol` props.
- **BreadcrumbItem** – `<li>` wrapper for each segment. Accepts `className` and `li` props.
- **BreadcrumbLink** – Link segment. Pass `href` and optional `asChild` to render a custom element (e.g. React Router’s `Link`) as the link.
- **BreadcrumbPage** – Current page (non-clickable). Renders a `<span>` with `aria-current="page"`. Use for the last item.
- **BreadcrumbSeparator** – Between items. Renders a chevron by default; pass `children` to use a custom character or icon.
- **BreadcrumbEllipsis** – For truncated middle segments (e.g. “…”). Includes a “More” screen-reader label.

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

Apply `className` to `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, and `BreadcrumbPage` to match your design system. The component uses internal CSS modules for base layout and typography.

## Accessibility

The root uses `aria-label="breadcrumb"`. The current page is marked with `aria-current="page"`. Separators and ellipsis are `aria-hidden="true"` so they don’t clutter screen-reader output.
