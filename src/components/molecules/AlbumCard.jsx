import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const AlbumCard = ({ album }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
    >
      <Link to={`/album/${album.id}`}>
        <div className="bg-surface p-4 rounded-lg hover:bg-gray-700 transition-all duration-300">
          {/* Album Cover */}
          <div className="relative mb-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-600">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-600 rounded-lg hidden items-center justify-center">
                <ApperIcon name="Music" className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 0, 
                  opacity: 0 
                }}
                whileHover={{ 
                  scale: 1, 
                  opacity: 1 
                }}
                className="bg-primary text-black rounded-full p-3 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
              >
                <ApperIcon name="Play" className="w-6 h-6 fill-current" />
              </motion.div>
            </div>
          </div>

          {/* Album Info */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-1 truncate">
              {album.title}
            </h3>
            
            {/* Artist */}
            <Link 
              to={`/artist/${album.artistId}`}
              className="text-sm text-gray-400 hover:text-white hover:underline mb-1 block truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {album.artistName}
            </Link>
            
            {/* Release Year & Genre */}
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span>{formatDate(album.releaseDate)}</span>
              <span>•</span>
              <span>{album.genre}</span>
            </div>
            
            {/* Rating */}
            {album.reviews && album.reviews.averageRating && (
              <div className="flex items-center mt-2 space-x-1">
                <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-400">{album.reviews.averageRating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AlbumCard;