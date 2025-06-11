import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../services';
import ApperIcon from './ApperIcon';

export default function MusicPlayer({ playerState: initialState, onStateChange }) {
  const [playerState, setPlayerState] = useState(initialState);
  const [volume, setVolume] = useState(75);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPlayerState(initialState);
  }, [initialState]);

  const handlePlayPause = async () => {
    try {
      const newState = await playerService.togglePlayPause();
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to toggle play/pause:', err);
    }
  };

  const handleNext = async () => {
    try {
      const newState = await playerService.nextTrack();
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to play next track:', err);
    }
  };

  const handlePrevious = async () => {
    try {
      const newState = await playerService.previousTrack();
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to play previous track:', err);
    }
  };

  const handleSeek = async (progress) => {
    try {
      const newState = await playerService.seekTo(progress);
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to seek:', err);
    }
  };

  const handleVolumeChange = async (newVolume) => {
    setVolume(newVolume);
    try {
      const newState = await playerService.setVolume(newVolume);
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!playerState?.currentTrack) return null;

  const { currentTrack, isPlaying, progress } = playerState;
  const progressPercent = (progress / currentTrack.duration) * 100;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="h-[90px] bg-surface border-t border-gray-700 px-4 py-2 flex items-center justify-between max-w-full overflow-hidden"
    >
      {/* Track Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 max-w-xs">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 bg-gray-600 rounded overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => navigate('/now-playing')}
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white truncate text-sm">
            {currentTrack.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack.artist}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors hidden sm:block"
        >
          <ApperIcon name="Heart" className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
        {/* Control Buttons */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors hidden md:block"
          >
            <ApperIcon name="Shuffle" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="SkipBack" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <ApperIcon 
              name={isPlaying ? "Pause" : "Play"} 
              className={`w-4 h-4 ${!isPlaying ? 'ml-0.5' : ''}`} 
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="SkipForward" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors hidden md:block"
          >
            <ApperIcon name="Repeat" className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatTime(progress)}
          </span>
          
          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden group cursor-pointer">
            <div 
              className="h-full bg-white transition-all group-hover:bg-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Volume & Additional Controls */}
      <div className="flex items-center space-x-3 flex-1 justify-end max-w-xs">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors hidden lg:block"
        >
          <ApperIcon name="ListMusic" className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors hidden lg:block"
        >
          <ApperIcon name="PcSpeaker" className="w-4 h-4" />
        </motion.button>

        {/* Volume Control */}
        <div 
          className="hidden md:flex items-center space-x-2 relative"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon 
              name={volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
              className="w-4 h-4" 
            />
          </motion.button>

          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden origin-left"
              >
                <div 
                  className="h-full bg-white"
                  style={{ width: `${volume}%` }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expand Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/now-playing')}
          className="text-gray-400 hover:text-white transition-colors hidden sm:block"
        >
          <ApperIcon name="Expand" className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}