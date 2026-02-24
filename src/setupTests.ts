import '@testing-library/jest-dom';

// Mock scrollIntoView which is not implemented in jsdom
Element.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver used by Radix UI components
class ResizeObserver {
  observe() {
    // no-op
  }
  unobserve() {
    // no-op
  }
  disconnect() {
    // no-op
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver,
});
