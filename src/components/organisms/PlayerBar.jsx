import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playerService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import PlayerControls from '@/components/organisms/PlayerControls';
import VolumeControl from '@/components/organisms/VolumeControl';

const PlayerBar = ({ playerState: initialState, onStateChange }) => {
  const [playerState, setPlayerState] = useState(initialState);
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

  const handleSeek = async (e) => {
    if (!playerState?.currentTrack) return;
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const newProgress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const seekTime = newProgress * playerState.currentTrack.duration;
      const newState = await playerService.seekTo(seekTime);
      setPlayerState(newState);
      onStateChange?.(newState);
    } catch (err) {
      console.error('Failed to seek:', err);
    }
  };

  const handleVolumeChange = async (newVolume) => {
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

  const { currentTrack, isPlaying, progress, volume } = playerState;
  const progressPercent = (progress / currentTrack.duration) * 100;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="h-[90px] bg-surface border-t border-gray-700 px-4 py-2 flex items-center justify-between max-w-full overflow-hidden"
    >
      {/* Track Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0 max-w-xs">
        <Button
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 bg-gray-600 rounded overflow-hidden flex-shrink-0 cursor-pointer p-0"
          onClick={() => navigate('/now-playing')}
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </Button>
        
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white truncate text-sm">
            {currentTrack.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack.artist}
          </p>
        </div>
        
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white hidden sm:block p-0 bg-transparent"
        >
          <ApperIcon name="Heart" className="w-4 h-4" />
        </Button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
        {/* Control Buttons */}
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          showShuffleAndRepeat={true}
        />

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatTime(progress)}
          </span>
          
          <ProgressBar
            progressPercent={progressPercent}
            onClick={handleSeek}
            className="flex-1"
          />
          
          <span className="text-xs text-gray-400 hidden sm:block">
            {formatTime(currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Volume & Additional Controls */}
      <div className="flex items-center space-x-3 flex-1 justify-end max-w-xs">
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white hidden lg:block p-0 bg-transparent"
        >
          <ApperIcon name="ListMusic" className="w-4 h-4" />
        </Button>
        
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white hidden lg:block p-0 bg-transparent"
        >
          <ApperIcon name="PcSpeaker" className="w-4 h-4" />
        </Button>

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />

        {/* Expand Button */}
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/now-playing')}
          className="text-gray-400 hover:text-white hidden sm:block p-0 bg-transparent"
        >
          <ApperIcon name="Expand" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PlayerBar;