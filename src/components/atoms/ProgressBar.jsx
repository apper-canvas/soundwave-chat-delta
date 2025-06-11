import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progressPercent, onClick, className = '' }) => {
  return (
    <div
      className={`w-full h-1 bg-gray-600 rounded-full overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <motion.div
        style={{ width: `${progressPercent}%` }}
        className="h-full bg-white transition-all group-hover:bg-primary"
      />
    </div>
  );
};

export default ProgressBar;