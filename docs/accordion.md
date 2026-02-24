# Accordion

Collapsible sections that expand and collapse. Built on [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion). Use for FAQs, settings panels, or any grouped content that can be shown one section at a time (or multiple, depending on `type`).

## Import

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@dtplatform/ipa-ui';
```

## Basic usage

Compose `Accordion` (root), `AccordionItem`, `AccordionTrigger`, and `AccordionContent`. Use Radix's `type` to control single vs multiple open items.

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content for section 2.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## API

- **Accordion** – Root. Accepts all [Radix Accordion Root](https://www.radix-ui.com/primitives/docs/components/accordion#root) props, including:
  - `type`: `"single"` | `"multiple"` – one or multiple items open at once
  - `collapsible`: when `type="single"`, allow closing the open item
  - `value` / `defaultValue`: controlled or uncontrolled value(s)
  - `onValueChange`: callback when value changes
- **AccordionItem** – Wraps each section. Requires `value` (string). Accepts `className` and other Radix Item props.
- **AccordionTrigger** – Clickable header; toggles the section. Accepts `className` and Radix Trigger props. Renders a chevron icon automatically.
- **AccordionContent** – Collapsible body. Accepts `className` and Radix Content props.

## Examples

**Multiple sections open**

```tsx
<Accordion type="multiple">
  <AccordionItem value="a"><AccordionTrigger>A</AccordionTrigger><AccordionContent>Content A</AccordionContent></AccordionItem>
  <AccordionItem value="b"><AccordionTrigger>B</AccordionTrigger><AccordionContent>Content B</AccordionContent></AccordionItem>
</Accordion>
```

**Controlled value**

```tsx
const [open, setOpen] = useState<string | undefined>('item-1');
<Accordion type="single" value={open} onValueChange={setOpen}>
  {/* ... */}
</Accordion>
```

## Styling

Use `className` on `AccordionItem`, `AccordionTrigger`, and `AccordionContent` to align with your theme. The component uses internal CSS modules for layout and the trigger chevron.

## Accessibility

Accordion uses Radix primitives; keyboard navigation and ARIA attributes (e.g. `aria-expanded`, `aria-controls`) are handled by the library. Ensure each `AccordionItem` has a unique `value`.
