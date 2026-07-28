import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'sage' | 'danger';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'lg', children, className = '', ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-slate-blue hover:bg-slate-blue-hover text-white focus:ring-slate-blue-light',
      secondary: 'bg-cream-card-hover hover:bg-cream-border text-text-main focus:ring-cream-border',
      sage: 'bg-sage hover:bg-sage-hover text-white focus:ring-sage-light',
      danger: 'bg-zone-red hover:bg-red-600 text-white focus:ring-zone-red-bg',
    };

    const sizeStyles = {
      md: 'h-12 px-5 text-base',
      lg: 'h-14 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
