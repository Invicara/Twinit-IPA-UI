import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './slider'

describe('Slider', () => {
  it('renders default slider', () => {
    render(
      <Slider
        label="Select Amount"
        minLabel="0"
        maxLabel="100"
        defaultValue={[50]}
      />
    )
    
    expect(screen.getByText('Select Amount')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('50')).toBeInTheDocument()
  })

  it('renders range slider', () => {
    render(
      <Slider
        label="Select Range"
        minLabel="0"
        maxLabel="100"
        variant="range"
        defaultValue={[25, 75]}
      />
    )
    
    expect(screen.getByText('Select Range')).toBeInTheDocument()
    expect(screen.getByDisplayValue('25')).toBeInTheDocument()
    expect(screen.getByDisplayValue('75')).toBeInTheDocument()
  })

  it('handles input value changes', () => {
    const handleValueChange = jest.fn()
    render(
      <Slider
        label="Select Amount"
        onValueChange={handleValueChange}
        defaultValue={[50]}
      />
    )
    
    const input = screen.getByDisplayValue('50')
    fireEvent.change(input, { target: { value: '75' } })
    
    expect(handleValueChange).toHaveBeenCalledWith([75])
  })

  it('handles range slider input changes', () => {
    const handleValueChange = jest.fn()
    render(
      <Slider
        label="Select Range"
        variant="range"
        onValueChange={handleValueChange}
        defaultValue={[25, 75]}
      />
    )
    
    const minInput = screen.getByDisplayValue('25')
    const maxInput = screen.getByDisplayValue('75')
    
    fireEvent.change(minInput, { target: { value: '30' } })
    expect(handleValueChange).toHaveBeenCalledWith([30, 75])
    
    fireEvent.change(maxInput, { target: { value: '80' } })
    expect(handleValueChange).toHaveBeenCalledWith([30, 80])
  })

  it('applies disabled state', () => {
    render(
      <Slider
        label="Select Amount"
        disabled
        defaultValue={[50]}
      />
    )
    
    const slider = screen.getByRole('slider')
    const input = screen.getByDisplayValue('50')
    
    expect(slider).toBeDisabled()
    expect(input).toBeDisabled()
  })

  it('clamps input values to min/max range', () => {
    const handleValueChange = jest.fn()
    render(
      <Slider
        label="Select Amount"
        min={0}
        max={100}
        onValueChange={handleValueChange}
        defaultValue={[50]}
      />
    )
    
    const input = screen.getByDisplayValue('50')
    
    // Test value below min
    fireEvent.change(input, { target: { value: '-10' } })
    expect(handleValueChange).toHaveBeenCalledWith([0])
    
    // Test value above max
    fireEvent.change(input, { target: { value: '150' } })
    expect(handleValueChange).toHaveBeenCalledWith([100])
  })

  it('renders with custom min/max labels', () => {
    render(
      <Slider
        label="Custom Range"
        minLabel="10"
        maxLabel="90"
        defaultValue={[50]}
      />
    )
    
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('90')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Slider
        label="Select Amount"
        className="custom-class"
        defaultValue={[50]}
      />
    )
    
    const sliderContainer = screen.getByText('Select Amount').closest('div')
    expect(sliderContainer).toHaveClass('custom-class')
  })

  it('renders with testIdPrefix', () => {
    render(
      <Slider
        label="Select Amount"
        testIdPrefix="test-slider"
        defaultValue={[50]}
      />
    )
    
    const slider = screen.getByTestId('test-slider')
    expect(slider).toBeInTheDocument()
  })
})
