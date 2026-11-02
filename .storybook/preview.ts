import type { Preview } from '@storybook/react'
import '../src/output.css'
import './preview.css'

/**
 * Save-from-Controls is off (`disableSaveFromUI`): tweaks in the Storybook UI stay in the
 * session only and are not written into `.stories.tsx`. Use **Reset** (per control or all)
 * to revert to the args in source, or reload the page.
 *
 * Controls / docs arg tables use alphabetical sort project-wide (`sort: 'alpha'`).
 * Controls panels are expanded by default (`expanded: true`).
 */
const preview: Preview = {
  parameters: {
    controls: {
      disableSaveFromUI: true,
      expanded: true,
      sort: 'alpha',
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      controls: {
        expanded: true,
        sort: 'alpha',
      },
      argTypes: {
        sort: 'alpha',
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;