// src/components/AnimatedCounter.tsx
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label?: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function AnimatedCounter({ 
  target, 
  suffix = '', 
  prefix = '', 
  duration = 2000,
  label = '',
  icon,
  color = 'from-agrivibe-green to-emerald-500'
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easedProgress * target);
      setCount(currentCount);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-agrivibe-green/30 transition-all duration-300 group"
    >
      {/* Icon */}
      {icon && (
        <div className="mb-2 text-3xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      )}

      {/* Counter Number - Horizontal Layout */}
      <div className="flex items-center gap-1">
        {prefix && (
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-600 dark:text-gray-400">
            {prefix}
          </span>
        )}
        <span className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {count.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-600 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      {label && (
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      )}
    </motion.div>
  );
}