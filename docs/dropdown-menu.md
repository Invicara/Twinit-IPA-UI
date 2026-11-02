# DropdownMenu

Menu of actions or toggles opened from a trigger button. Built on [Radix UI Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). For picking a form value from a list, use [SingleSelect / MultiSelect](dropdown.md) instead.

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
} from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
const [showArchived, setShowArchived] = useState(false);

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={handleRename}>Rename</DropdownMenuItem>
    <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
      Show archived
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Subcomponents

| Export | Based on | IPA additions |
|--------|----------|---------------|
| `DropdownMenu` | Radix `Root` | None (use `open` / `defaultOpen` / `onOpenChange` / `modal`). |
| `DropdownMenuTrigger` | Radix `Trigger` | None. |
| `DropdownMenuGroup` | Radix `Group` | None. |
| `DropdownMenuPortal` | Radix `Portal` | None. `DropdownMenuContent` already portals; you rarely need this. |
| `DropdownMenuContent` | Radix `Content` in a `Portal` | `container`, `styleOverrides`, `sideOffset` default `4`. |
| `DropdownMenuItem` | Radix `Item` | `styleOverrides`. |
| `DropdownMenuCheckboxItem` | Radix `CheckboxItem` | `styleOverrides`; renders a check icon after the label when checked. |
| `DropdownMenuSeparator` | Radix `Separator` | `styleOverrides`. |

All styled parts accept their Radix props ([Content](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#content), [Item](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#item), [CheckboxItem](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem)) and forward `ref`. Radix sub-menus, radio items and labels are not exported.

## Props

**DropdownMenuContent**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sideOffset` | `number` | `4` | Distance in px from the trigger (Radix prop, IPA default). |
| `container` | `HTMLElement \| null` | `#ipa-ui-modal-root`, else `document.body` | Portal target. See [Portal container](../README.md#portal-container-ipa-ui-modal-root). |
| `styleOverrides` | `Record<string, string>` | - | Slot key `content`. |

**DropdownMenuItem**, **DropdownMenuCheckboxItem**, **DropdownMenuSeparator**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `styleOverrides` | `Record<string, string>` | - | Slot keys: `item` (Item), `checkboxItem` and `itemIndicator` (CheckboxItem), `separator` (Separator). |

Types: `DropdownMenuContentProps`, `DropdownMenuItemProps`, `DropdownMenuCheckboxItemProps`, `DropdownMenuSeparatorProps`.

## Styling

`styleOverrides` is per subcomponent (there is no shared root map). Content defaults to `z-index: 1200` and `min-width: 128px`. Highlight and disabled styles use Radix's `[data-highlighted]` and `[data-disabled]`; mirror those selectors to override them.

## Data attributes

| Element | `data-testid` | Radix data attributes |
|---------|---------------|-----------------------|
| Content | `ipa_dropdown_menu_content` | `data-state`, `data-side`, `data-align` |
| Item | `ipa_dropdown_menu_item` | `data-highlighted`, `data-disabled` |
| CheckboxItem | `ipa_dropdown_menu_checkbox_item` | `data-state` (`checked` \| `unchecked` \| `indeterminate`), `data-highlighted`, `data-disabled` |
| Separator | `ipa_dropdown_menu_separator` | - |
