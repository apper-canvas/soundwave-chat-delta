import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyStateMessage = ({ icon, title, message, actionText, onActionClick }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <ApperIcon name={icon} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
      {actionText && onActionClick && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onActionClick}
          className="bg-primary text-black px-6 py-2 rounded-full"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyStateMessage;