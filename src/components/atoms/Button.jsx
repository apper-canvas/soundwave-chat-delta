import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', disabled = false, ...rest }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`font-medium transition-colors ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default Button;