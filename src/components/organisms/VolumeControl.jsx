import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const VolumeControl = ({ volume, onVolumeChange }) => {
  const [showSlider, setShowSlider] = useState(false);

  const getVolumeIcon = (vol) => {
    if (vol === 0) return "VolumeX";
    if (vol < 50) return "Volume1";
    return "Volume2";
  };

  const handleSliderChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    onVolumeChange(newVolume);
  };

  return (
    <div
      className="hidden md:flex items-center space-x-2 relative"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
        onClick={() => onVolumeChange(volume === 0 ? 75 : 0)} // Toggle mute
      >
        <ApperIcon name={getVolumeIcon(volume)} className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {showSlider && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="w-20 h-1 rounded-full overflow-hidden origin-left bg-gray-600 relative"
            style={{ transformOrigin: 'left' }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleSliderChange}
              className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:hover:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow"
            />
            <div
              className="h-full bg-white absolute top-0 left-0"
              style={{ width: `${volume}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolumeControl;