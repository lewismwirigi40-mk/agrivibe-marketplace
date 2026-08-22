// src/components/PremiumButton.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface PremiumButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  animate?: boolean;
}

export default function PremiumButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  animate = true,
}: PremiumButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-semibold 
    rounded-xl transition-all duration-300 
    transform hover:-translate-y-1 
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-agrivibe-green to-emerald-500 
      text-white 
      hover:shadow-xl hover:shadow-agrivibe-green/30
      focus:ring-agrivibe-green
      border border-transparent
    `,
    secondary: `
      bg-gradient-to-r from-yellow-400 to-orange-400 
      text-gray-900 
      hover:shadow-xl hover:shadow-yellow-400/30
      focus:ring-yellow-400
      border border-transparent
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 
      text-white 
      hover:shadow-xl hover:shadow-green-500/30
      focus:ring-green-500
      border border-transparent
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      text-white 
      hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500
      border border-transparent
    `,
    outline: `
      bg-transparent 
      text-agrivibe-green 
      border-2 border-agrivibe-green 
      hover:bg-agrivibe-green hover:text-white 
      focus:ring-agrivibe-green
    `,
    ghost: `
      bg-transparent 
      text-gray-600 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-white/10 
      focus:ring-gray-300
      border border-transparent
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const combinedClassName = `
    ${baseStyles} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `;

  const buttonContent = (
    <>
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
      {!loading && !icon && variant === 'primary' && (
        <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      )}
    </>
  );

  const buttonElement = animate ? (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {buttonContent}
    </motion.button>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
    >
      {buttonContent}
    </button>
  );

  if (href) {
    return animate ? (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={combinedClassName}>
          {buttonContent}
        </Link>
      </motion.div>
    ) : (
      <Link href={href} className={combinedClassName}>
        {buttonContent}
      </Link>
    );
  }

  return buttonElement;
}