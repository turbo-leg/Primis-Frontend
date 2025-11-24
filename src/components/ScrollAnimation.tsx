'use client';

import { motion, useInView, UseInViewOptions } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';
  delay?: number;
  duration?: number;
  viewport?: UseInViewOptions;
}

export default function ScrollAnimation({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.5,
  viewport = { once: true, margin: "-100px" }
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const getVariants = () => {
    switch (animation) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-in':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'scale-up':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      default:
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getVariants()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
