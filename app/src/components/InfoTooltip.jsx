import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoTooltip({ content, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className="cursor-pointer text-emerald-600 dark:text-emerald-400 animate-pulse"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {children || <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 16v-4m0-4h.01" strokeWidth="2" /></svg>}
      </span>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-2 text-sm text-gray-900 dark:text-white whitespace-pre-line min-w-[180px]"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
