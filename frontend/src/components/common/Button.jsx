import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#25364A] text-white hover:bg-[#1a2736] focus:ring-[#426B72] dark:bg-[#426B72] dark:hover:bg-[#34555b] dark:text-white',
    secondary: 'bg-[#D7E2DF] text-[#25364A] hover:bg-[#c2d3cf] focus:ring-[#426B72] dark:bg-[#243541] dark:text-[#E7ECEB] dark:hover:bg-[#2d4251]',
    outline: 'border border-[#E5E8E5] text-[#263238] bg-white hover:bg-slate-50 focus:ring-[#426B72] dark:bg-transparent dark:border-[#354651] dark:text-[#E7ECEB] dark:hover:bg-[#243541]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    ghost: 'text-[#77818A] hover:text-[#263238] hover:bg-slate-100 dark:text-[#A2AFB5] dark:hover:text-[#E7ECEB] dark:hover:bg-[#243541]',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
