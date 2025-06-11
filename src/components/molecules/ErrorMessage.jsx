import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-heading font-semibold mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-primary text-black px-6 py-2 rounded-full hover:bg-accent"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;