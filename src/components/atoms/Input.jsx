import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', autoFocus = false, onKeyPress, ...rest }) => {
  return (
    <motion.input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-surface text-white px-4 py-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
      autoFocus={autoFocus}
      onKeyPress={onKeyPress}
      {...rest}
    />
  );
};

export default Input;