import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link } from './link'
import styles from './link.module.css'

describe('Link', () => {
  it('renders default link without icon', () => {
    render(<Link href="#">Click This Link</Link>)

    const link = screen.getByRole('link', { name: /click this link/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#')
    expect(link).toHaveClass(styles.link)
    expect(link).toHaveAttribute('data-variant', 'default')
    expect(link.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders default link with icon when passed', () => {
    const Icon = () => <svg data-testid="custom-icon" />
    render(<Link href="#" icon={<Icon />}>Edit</Link>)

    const link = screen.getByRole('link', { name: /edit/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('data-variant', 'default')
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders inline link with underline', () => {
    render(<Link href="#" inline>Edit</Link>)

    const link = screen.getByRole('link', { name: /edit/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('data-variant', 'inline')
  })

  it('applies disabled state correctly', () => {
    render(<Link href="#" disabled>Disabled Link</Link>)

    const link = screen.getByText('Disabled Link').closest('a') as HTMLAnchorElement | null
    expect(link).not.toBeNull()
    if (!link) {
      throw new Error('Expected disabled link element')
    }
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('data-disabled', 'true')
  })

  it('handles click events when not disabled', async () => {
    const handleClick = jest.fn()
    render(<Link href="#" onClick={handleClick}>Clickable Link</Link>)

    const link = screen.getByRole('link')
    const user = userEvent.setup()
    await user.click(link)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click events when disabled', async () => {
    const handleClick = jest.fn()
    render(<Link href="#" disabled onClick={handleClick}>Disabled Link</Link>)

    const link = screen.getByText('Disabled Link').closest('a') as HTMLAnchorElement | null
    expect(link).not.toBeNull()
    if (!link) {
      throw new Error('Expected disabled link element')
    }
    const user = userEvent.setup()
    await user.click(link)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Link href="#" className="custom-class">Link</Link>)

    const link = screen.getByRole('link')
    expect(link).toHaveClass('custom-class')
  })

  it('renders with data-testid', () => {
    render(<Link href="#">Link</Link>)

    const link = screen.getByTestId('ipa_link')
    expect(link).toBeInTheDocument()
  })
})
