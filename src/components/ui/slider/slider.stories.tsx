import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './slider'

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'range'],
    },
    label: {
      control: 'text',
    },
    minLabel: {
      control: 'text',
    },
    maxLabel: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Select Amount',
    minLabel: '0',
    maxLabel: '100',
    variant: 'default',
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [50],
  },
}

export const Range: Story = {
  args: {
    label: 'Select Range',
    minLabel: '0',
    maxLabel: '100',
    variant: 'range',
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [25, 75],
  },
}

