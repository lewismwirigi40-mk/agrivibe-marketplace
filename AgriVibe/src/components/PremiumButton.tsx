import Link from 'next/link';
import { ReactNode } from 'react';

interface PremiumButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;  // ← ADDED
}

export default function PremiumButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,  // ← ADDED
}: PremiumButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold 
    rounded-xl transition-all duration-300 
    transform hover:-translate-y-1 
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-green-600 to-emerald-500 
      text-white 
      hover:shadow-xl hover:shadow-green-500/30
      focus:ring-green-500
      border border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-amber-500 to-orange-500 
      text-white 
      hover:shadow-xl hover:shadow-amber-500/30
      focus:ring-amber-500
      border border-transparent
    `,
    outline: `
      bg-transparent 
      text-green-600 
      border-2 border-green-600 
      hover:bg-green-600 hover:text-white 
      focus:ring-green-500
    `,
    ghost: `
      bg-transparent 
      text-gray-700 
      hover:bg-gray-100 
      focus:ring-gray-300
      border border-transparent
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `
    ${baseStyles} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName} disabled={disabled}>
      {children}
    </button>
  );
}