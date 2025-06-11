import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    // Play playlist logic here
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, brightness: 1.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="bg-surface rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700 group relative"
    >
      <div className="relative mb-4 aspect-square">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        
        <Button
          initial={{ opacity: 0, y: 8 }}
          whileHover={{ opacity: 1, y: 0 }}
          animate={{ 
            opacity: 0, 
            y: 8,
            transition: { duration: 0.2 }
          }}
          whileInView={{ 
            opacity: [0, 1, 0], 
            y: [8, 0, 8],
            transition: { 
              duration: 0.3,
              delay: 0.5
            }
          }}
          className="group-hover:opacity-100 group-hover:translate-y-0 absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black shadow-lg transition-all"
          onClick={handlePlay}
        >
          <ApperIcon name="Play" className="w-5 h-5 ml-0.5" />
        </Button>
      </div>

      <div className="space-y-1">
        <h3 className="font-heading font-semibold text-white truncate">
          {playlist.name}
        </h3>
        
        {playlist.description ? (
          <p className="text-sm text-gray-400 line-clamp-2 break-words">
            {playlist.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            {playlist.tracks?.length || 0} songs
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;