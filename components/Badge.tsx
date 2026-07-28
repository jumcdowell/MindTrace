import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'sage' | 'blue' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge = ({ variant = 'sage', size = 'md', children, className = '', ...props }: BadgeProps) => {
  const variantStyles = {
    sage: 'bg-sage-light text-sage border-sage',
    blue: 'bg-slate-blue-light text-slate-blue border-slate-blue',
    yellow: 'bg-zone-yellow-bg text-zone-yellow border-zone-yellow',
    red: 'bg-zone-red-bg text-zone-red border-zone-red',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
