import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PlayerControls = ({ isPlaying, onPlayPause, onNext, onPrevious, showShuffleAndRepeat = false, playButtonSize = 'md' }) => {
  const playButtonClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center space-x-4">
      {showShuffleAndRepeat && (
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
        >
          <ApperIcon name="Shuffle" className={iconClasses[playButtonSize]} />
        </Button>
      )}
      
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrevious}
        className="text-white hover:text-gray-300 transition-colors p-0 bg-transparent"
      >
        <ApperIcon name="SkipBack" className={iconClasses[playButtonSize]} />
      </Button>
      
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        className={`${playButtonClasses[playButtonSize]} bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors`}
      >
        <ApperIcon 
          name={isPlaying ? "Pause" : "Play"} 
          className={`${iconClasses[playButtonSize]} ${!isPlaying ? 'ml-1' : ''}`} 
        />
      </Button>
      
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="text-white hover:text-gray-300 transition-colors p-0 bg-transparent"
      >
        <ApperIcon name="SkipForward" className={iconClasses[playButtonSize]} />
      </Button>
      
      {showShuffleAndRepeat && (
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
        >
          <ApperIcon name="Repeat" className={iconClasses[playButtonSize]} />
        </Button>
      )}
    </div>
  );
};

export default PlayerControls;