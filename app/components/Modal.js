// File: app/components/Modal.js
'use client';

import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={onClose}
          ></div>
          
          {/* Modal Content */}
          <motion.div
            className="relative z-10 p-8 bg-[#191919] rounded-lg shadow-xl text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children}
            <button
              onClick={onClose}
              className="mt-6 py-2 px-6 bg-[#2C76E5] text-white rounded-lg font-semibold"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;