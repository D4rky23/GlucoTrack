import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children, keyProp }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
