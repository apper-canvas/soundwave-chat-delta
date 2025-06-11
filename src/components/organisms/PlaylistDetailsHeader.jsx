import React from 'react';
import { motion } from 'framer-motion';

const PlaylistDetailsHeader = ({ playlist }) => {
  const totalDuration = playlist.tracks?.reduce((total, track) => total + track.duration, 0) || 0;

  const formatDuration = (totalMs) => {
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 pb-4"
    >
      <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-8">
        <div className="w-60 h-60 mx-auto md:mx-0 flex-shrink-0">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0 text-center md:text-left">
          <p className="text-sm font-medium text-gray-300 mb-2">PLAYLIST</p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 break-words">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-gray-300 mb-4 break-words">{playlist.description}</p>
          )}
          <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-300 space-y-1 md:space-y-0">
            <span className="font-medium">SoundWave</span>
            {playlist.tracks?.length > 0 && (
              <>
                <span className="hidden md:inline mx-2">•</span>
                <span>{playlist.tracks.length} songs</span>
                <span className="hidden md:inline mx-2">•</span>
                <span>{formatDuration(totalDuration)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistDetailsHeader;