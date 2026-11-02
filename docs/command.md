# Command

Searchable list of items with keyboard navigation, for command palettes and comboboxes. Built on [`cmdk`](https://github.com/pacocoursey/cmdk) (bundled; you do not install it). Used internally by the Table filters and toolbar.

## Import

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Command>
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={openCalendar}>Calendar</CommandItem>
      <CommandItem onSelect={openSettings}>Settings</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Danger zone">
      <CommandItem disabled>Delete project</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Combobox (with [Popover](popover.md))**

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="secondary">{selected ?? 'Select a site'}</Button>
  </PopoverTrigger>
  <PopoverContent align="start">
    <Command>
      <CommandInput placeholder="Search sites..." />
      <CommandList>
        <CommandEmpty>No site found.</CommandEmpty>
        {sites.map((site) => (
          <CommandItem
            key={site.id}
            value={site.name}
            onSelect={(value) => { setSelected(value); setOpen(false); }}
          >
            {site.name}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

## Subcomponents

Every part forwards `ref` and accepts the props of its `cmdk` counterpart (see the [cmdk README](https://github.com/pacocoursey/cmdk#parts-and-styling)), plus `className`.

| Export | cmdk part | Useful cmdk props | IPA additions |
|--------|-----------|-------------------|---------------|
| `Command` | `Command` | `value` / `defaultValue` / `onValueChange` (highlighted item), `shouldFilter`, `filter`, `loop`, `label` | `styleOverrides` (slot `command`) |
| `CommandInput` | `Command.Input` | `value`, `onValueChange` (search text), `placeholder` | Wrapped with a search icon; `className` goes on the `<input>`; `styleOverrides` (slots `inputWrapper`, `inputIcon`, `input`) |
| `CommandList` | `Command.List` | `label` | Scrolls after 288px |
| `CommandEmpty` | `Command.Empty` | - | Shown when no item matches |
| `CommandGroup` | `Command.Group` | `heading`, `value`, `forceMount` | - |
| `CommandItem` | `Command.Item` | `value`, `keywords`, `onSelect(value)`, `disabled`, `forceMount` | `styleOverrides` (slot `item`) |
| `CommandSeparator` | `Command.Separator` | `alwaysRender` | - |

Types: `CommandProps`, `CommandInputProps`, `CommandItemProps`.

## Styling

`styleOverrides` is per subcomponent and only on `Command`, `CommandInput` and `CommandItem`; style the other parts with `className`. Item highlight and disabled styles use cmdk's `[data-selected="true"]` and `[data-disabled="true"]`; mirror those selectors to override them.

## Data attributes

| Element | `data-testid` | cmdk data attributes |
|---------|---------------|----------------------|
| Command | `ipa_command` | - |
| CommandInput (`<input>`) | `ipa_command_input` | - |
| CommandList | `ipa_command_list` | - |
| CommandEmpty | `ipa_command_empty` | - |
| CommandItem | `ipa_command_item` | `data-selected`, `data-disabled`, `data-value` |
