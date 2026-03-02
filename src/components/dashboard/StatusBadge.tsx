import { type ReactNode } from 'react';

interface StatusBadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  children?: ReactNode;
  label?: string;
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  error: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  neutral: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  purple: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

const dotStyles = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-400',
  purple: 'bg-violet-500',
};

const StatusBadge = ({ variant, children, label, dot = true, className = '' }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variantStyles[variant]} ${className}`}
  >
    {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />}
    {children ?? label}
  </span>
);

export default StatusBadge;
