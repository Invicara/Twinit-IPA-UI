import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioGroup } from './radio-group'
import styles from './radio-group.module.css'

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

describe('RadioGroup', () => {
  it('renders with options', () => {
    render(
      <RadioGroup
        options={defaultOptions}
        label="Choose Option"
      />
    )
    
    expect(screen.getByText('Choose Option')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<RadioGroup options={defaultOptions} />)
    
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleValueChange = jest.fn()
    render(
      <RadioGroup
        options={defaultOptions}
        onValueChange={handleValueChange}
      />
    )
    
    const option2 = screen.getByLabelText('Option 2')
    fireEvent.click(option2)
    
    expect(handleValueChange).toHaveBeenCalledWith('option2')
  })

  it('applies disabled state to all options', () => {
    render(
      <RadioGroup
        options={defaultOptions}
        disabled
      />
    )
    
    const option1 = screen.getByLabelText('Option 1')
    const option2 = screen.getByLabelText('Option 2')
    const option3 = screen.getByLabelText('Option 3')
    
    expect(option1).toBeDisabled()
    expect(option2).toBeDisabled()
    expect(option3).toBeDisabled()
  })

  it('handles individual option disabled state', () => {
    const optionsWithDisabled = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ]
    
    render(<RadioGroup options={optionsWithDisabled} />)
    
    const option1 = screen.getByLabelText('Option 1')
    const option2 = screen.getByLabelText('Option 2')
    const option3 = screen.getByLabelText('Option 3')
    
    expect(option1).not.toBeDisabled()
    expect(option2).toBeDisabled()
    expect(option3).not.toBeDisabled()
  })

  it('renders in horizontal layout', () => {
    render(
      <RadioGroup
        options={defaultOptions}
        horizontal
      />
    )
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass(styles.groupOrientationHorizontal)
  })

  it('applies custom className', () => {
    render(
      <RadioGroup
        options={defaultOptions}
        className="custom-class"
      />
    )
    
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass('custom-class')
  })

  it('renders with default testId', () => {
    render(<RadioGroup options={defaultOptions} />)
    const radioGroup = screen.getByTestId('ipa_radio_group')
    expect(radioGroup).toBeInTheDocument()
  })

  it('renders with custom testId', () => {
    render(
      <RadioGroup
        options={defaultOptions}
        testId="test-radio"
      />
    )
    const radioGroup = screen.getByTestId('test-radio')
    expect(radioGroup).toBeInTheDocument()
  })
})
