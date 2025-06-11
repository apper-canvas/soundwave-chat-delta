import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playerService } from '../services';
import ApperIcon from '../components/ApperIcon';

export default function NowPlaying() {
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

  const handleVolumeChange = async (volume) => {
    try {
      const newState = await playerService.setVolume(volume);
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }
  };

  const handleSeek = async (progress) => {
    try {
      const newState = await playerService.seekTo(progress);
      setPlayerState(newState);
    } catch (err) {
      console.error('Failed to seek:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!playerState?.currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <ApperIcon name="Music" className="w-24 h-24 text-gray-400 mb-6" />
        <h2 className="text-2xl font-heading font-semibold mb-2">No music playing</h2>
        <p className="text-gray-400 mb-8">Start playing a song to see it here</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-primary text-black px-6 py-3 rounded-full font-medium"
        >
          Browse Music
        </motion.button>
      </div>
    );
  }

  const { currentTrack, isPlaying, progress, volume, queue } = playerState;
  const progressPercent = (progress / currentTrack.duration) * 100;

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name="ChevronDown" className="w-6 h-6" />
        </motion.button>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">PLAYING FROM PLAYLIST</p>
          <p className="font-medium">Liked Songs</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ApperIcon name="MoreHorizontal" className="w-6 h-6" />
        </motion.button>
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
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-primary progress-glow"
              />
            </div>
            <motion.div
              style={{ left: `${progressPercent}%` }}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer"
              whileHover={{ scale: 1.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDrag={(_, info) => {
                const rect = info.point.x;
                const newProgress = Math.max(0, Math.min(100, (rect / 400) * 100));
                handleSeek((newProgress / 100) * currentTrack.duration);
              }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="Shuffle" className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevious}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ApperIcon name="SkipBack" className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <ApperIcon 
              name={isPlaying ? "Pause" : "Play"} 
              className={`w-8 h-8 ${!isPlaying ? 'ml-1' : ''}`} 
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ApperIcon name="SkipForward" className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="Repeat" className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-4 w-full max-w-md">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="Mic2" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="ListMusic" className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="PcSpeaker" className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center space-x-2 flex-1">
            <ApperIcon name="Volume2" className="w-5 h-5 text-gray-400" />
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${volume}%` }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}