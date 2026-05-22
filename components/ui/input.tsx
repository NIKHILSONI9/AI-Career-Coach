import { forwardRef, InputHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full p-3 rounded-lg bg-black/50 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition ${className || ''}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';