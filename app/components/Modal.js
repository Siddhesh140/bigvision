// File: app/components/Modal.js
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { FONTS } from '../constants/styles';

const Modal = ({ isOpen, onClose, children, allowBackdropClick = true }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';

      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (allowBackdropClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={handleBackdropClick}
            aria-hidden="true"
          ></div>

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="relative z-10 p-8 bg-[#191919] rounded-lg shadow-xl text-center max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            tabIndex={-1}
          >
            <div id="modal-title">
              {children}
            </div>
            <button
              onClick={onClose}
              className="mt-6 py-2 px-6 bg-[#2C76E5] text-white rounded-lg font-semibold hover:bg-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: FONTS.body }}
              aria-label="Close modal"
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