import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import styles from "./Dialog.module.css";

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  trigger?: ReactNode;
  width?: number;
}

export function Dialog({ open, onOpenChange, title, description, children, trigger, width = 480 }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />
        <DialogPrimitive.Content className={styles.content} style={{ maxWidth: width }}>
          {title && <DialogPrimitive.Title className={styles.title}>{title}</DialogPrimitive.Title>}
          {description && (
            <DialogPrimitive.Description className={styles.description}>{description}</DialogPrimitive.Description>
          )}
          <div className={styles.body}>{children}</div>
          <DialogPrimitive.Close className={styles.close} aria-label="Close">
            ✕
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
