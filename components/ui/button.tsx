import { forwardRef, ButtonHTMLAttributes } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        props.disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';