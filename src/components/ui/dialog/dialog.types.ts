export interface DialogProps {
  // Core Props
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Feature Toggles
  hideOverlay?: boolean;           // Non-modal mode - no dark background overlay
  acknowledgment?: boolean;        // Auto-generate "OK" button footer
  passive?: boolean;               // Hide footer entirely
  disableClickOutside?: boolean;   // Prevent closing by clicking outside dialog
  disableCloseButton?: boolean;    // Hide the X close button in header
  disableEscapeKey?: boolean;      // Prevent closing with Escape key
  
  /** Portal container (e.g. element with id "ipa-ui-modal-root" inside theme wrapper so modals inherit theme variables) */
  container?: HTMLElement | null;

  // Custom Classnames for Sub-components
  classNames?: {
    overlay?: string;
    content?: string;
    header?: string;
    title?: string;
    closeButton?: string;
    body?: string;
    footer?: string;
  };
}
