import React from 'react';
import { motion } from 'framer-motion';

const HomeHeroSection = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-heading font-bold mb-2">
        Good {getGreeting()}
      </h1>
      <p className="text-gray-400">Ready to listen to your favorite music?</p>
    </motion.div>
  );
};

export default HomeHeroSection;