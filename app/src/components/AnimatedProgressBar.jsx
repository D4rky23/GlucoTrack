import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedProgressBar({ value, max = 1, className = '' }) {
  const percent = Math.max(0, Math.min(1, value / max));
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 ${className}`}>
      <motion.div
        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500"
        initial={{ width: 0 }}
        animate={{ width: `${percent * 100}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  );
}
