import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface IconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, 'children'> {
  children: React.ReactNode;
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('rounded-full', className)}
        size="icon"
        variant={variant}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
