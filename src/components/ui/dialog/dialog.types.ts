import { type VariantProps } from "class-variance-authority"
import { dialogVariants } from "./dialog"

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  title?: string;
  bodyContent?: React.ReactNode;
  actionButtons?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: 'modal' | 'non-modal';
  variant?: 'default' | 'acknowledgment' | 'passive';
  testIdPrefix?: string;
}