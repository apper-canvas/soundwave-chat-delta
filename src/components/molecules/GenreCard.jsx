import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GenreCard = ({ name, color, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, brightness: 1.1 }}
      whileTap={{ scale: 0.98 }}
      className={`${color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer`}
    >
      <h3 className="text-white font-heading font-semibold text-lg">
        {name}
      </h3>
      <ApperIcon
        name={icon}
        className="absolute bottom-2 right-2 w-8 h-8 text-white opacity-80"
      />
    </motion.div>
  );
};

export default GenreCard;