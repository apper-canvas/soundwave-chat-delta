import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playerService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import PlayerControls from '@/components/organisms/PlayerControls';
import VolumeControl from '@/components/organisms/VolumeControl';
import LoadingMessage from '@/components/molecules/LoadingMessage';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';

const NowPlayingPage = () => {
  const [playerState, setPlayerState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlayerState();
  }, []);

  const loadPlayerState = async () => {
    try {
      const state = await playerService.getCurrentState();
      setPlayerState(state);
    } catch (err) {
      console.error('Failed to load player state:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      const newState = await playerService.togglePlayPause();
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to toggle play/pause:', err);
    }
  };

  const handleNext = async () => {
    try {
      const newState = await playerService.nextTrack();
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to play next track:', err);
    }
  };

  const handlePrevious = async () => {
    try {
      const newState = await playerService.previousTrack();
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to play previous track:', err);
    }
  };

  const handleVolumeChange = async (volumeValue) => {
    try {
      const newState = await playerService.setVolume(volumeValue);
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  };

  const handleSeek = async (e) => {
    if (!playerState?.currentTrack) return;
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const newProgressRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const seekTime = newProgressRatio * playerState.currentTrack.duration;
      const newState = await playerService.seekTo(seekTime);
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to seek:', err);
    }
  };

  if (loading) {
    return <LoadingMessage />;
  }

  if (!playerState?.currentTrack) {
    return (
      <EmptyStateMessage
        icon="Music"
        title="No music playing"
        message="Start playing a song to see it here"
        actionText="Browse Music"
        onActionClick={() => navigate('/')}
      />
    );
  }

  const { currentTrack, isPlaying, progress, volume } = playerState;
  const progressPercent = (progress / currentTrack.duration) * 100;

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
        >
          <ApperIcon name="ChevronDown" className="w-6 h-6" />
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">PLAYING FROM PLAYLIST</p>
          <p className="font-medium">Liked Songs</p>
        </div>
        
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
        >
          <ApperIcon name="MoreHorizontal" className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-8">
        {/* Album Art */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-80 h-80 mx-auto">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.album}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Vinyl Effect */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            className="absolute inset-0 w-80 h-80 rounded-full border-4 border-gray-700 opacity-20"
          />
        </motion.div>

        {/* Track Info */}
        <div className="text-center space-y-2 max-w-md">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-heading font-bold break-words"
          >
            {currentTrack.title}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-300 break-words"
          >
            {currentTrack.artist}
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="relative">
            <ProgressBar
              progressPercent={progressPercent}
              onClick={handleSeek}
              className="h-1 bg-gray-700 rounded-full"
            />
            <motion.div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"
              whileHover={{ scale: 1.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDrag={(_, info) => {
                const parentRect = info.target.parentElement.getBoundingClientRect();
                const newProgressRatio = Math.max(0, Math.min(1, (info.point.x - parentRect.left) / parentRect.width));
                playerService.seekTo(newProgressRatio * currentTrack.duration); // Direct service call for smooth drag
              }}
              onDragEnd={() => loadPlayerState()} // Update full state after drag ends
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          playButtonSize="lg"
          showShuffleAndRepeat={true}
        />

        {/* Additional Controls */}
        <div className="flex items-center space-x-4 w-full max-w-md">
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
          >
            <ApperIcon name="Mic2" className="w-5 h-5" />
          </Button>
          
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
          >
            <ApperIcon name="ListMusic" className="w-5 h-5" />
          </Button>
          
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
          >
            <ApperIcon name="PcSpeaker" className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2 flex-1">
            <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} showIconOnly={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingPage;