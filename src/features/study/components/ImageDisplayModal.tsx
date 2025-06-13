import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ImageDisplayModalProps = {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
};

const ImageDisplayModal: React.FC<ImageDisplayModalProps> = ({ isOpen, imageUrl, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-70 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={imageUrl}
            alt="Expanded"
            className="rounded-lg shadow-2xl max-w-[90vw] max-h-[85vh] object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageDisplayModal;
