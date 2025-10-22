import { render, screen, fireEvent } from '@testing-library/react'
import { Link } from './link'

describe('Link', () => {
  it('renders default link with icon', () => {
    render(<Link href="#">Click This Link</Link>)
    
    const link = screen.getByRole('link', { name: /click this link/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
    expect(link).toHaveClass('flex', 'items-center', 'gap-[4px]')
  })

  it('renders inline link with underline', () => {
    render(<Link href="#" variant="inline">Edit</Link>)
    
    const link = screen.getByRole('link', { name: /edit/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('underline', 'underline-offset-2')
  })

  it('applies disabled state correctly', () => {
    render(<Link href="#" disabled>Disabled Link</Link>)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveClass('text-neutral-5', 'cursor-not-allowed', 'pointer-events-none')
  })

  it('handles click events when not disabled', () => {
    const handleClick = jest.fn()
    render(<Link href="#" onClick={handleClick}>Clickable Link</Link>)
    
    const link = screen.getByRole('link')
    fireEvent.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click events when disabled', () => {
    const handleClick = jest.fn()
    render(<Link href="#" disabled onClick={handleClick}>Disabled Link</Link>)
    
    const link = screen.getByRole('link')
    fireEvent.click(link)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Link href="#" className="custom-class">Link</Link>)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('renders with testIdPrefix', () => {
    render(<Link href="#" testIdPrefix="test-link">Link</Link>)
    
    const link = screen.getByTestId('test-link')
    expect(link).toBeInTheDocument()
  })
})
