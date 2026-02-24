import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Link } from './link'

const meta: Meta<typeof Link> = {
  title: 'UI/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inline'],
    },
    disabled: {
      control: 'boolean',
    },
    href: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#',
    children: 'Click This Link',
    variant: 'default',
    disabled: false,
  },
}

export const Inline: Story = {
  args: {
    href: '#',
    children: 'Click This Link',
    variant: 'inline',
    disabled: false,
  },
  render: (args) => (
    <div className="max-w-md">
      <p className="font-sans text-[14px] font-normal leading-[18px] text-neutral-9">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea <Link href={args.href} variant={args.variant} disabled={args.disabled}>{args.children}</Link> commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. consectetur adipiscing elit.
      </p>
    </div>
  ),
}
