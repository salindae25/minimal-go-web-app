import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Button = forwardRef(function Button(
  { className, variant = 'default', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variant === 'default'
          ? 'bg-primary text-primary-foreground hover:opacity-90'
          : 'border border-input bg-background hover:bg-accent',
        className,
      )}
      {...props}
    />
  );
});
