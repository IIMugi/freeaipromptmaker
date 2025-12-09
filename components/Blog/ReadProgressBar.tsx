'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll } from 'motion/react';

/**
 * Read Progress Bar
 * SEO: User engagement signal (scroll depth)
 * UX: Visual feedback for article length
 */
export function ReadProgressBar() {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setProgress(latest);
    });
  }, [scrollYProgress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-violet-500 to-purple-500 origin-left"
      style={{ scaleX: progress }}
      initial={{ scaleX: 0 }}
      aria-hidden="true"
    />
  );
}

