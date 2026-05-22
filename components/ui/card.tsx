import { forwardRef, HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
Card.displayName = 'Card';