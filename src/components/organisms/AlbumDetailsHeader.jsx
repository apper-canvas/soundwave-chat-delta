import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AlbumDetailsHeader = ({ album, inLibrary, onLibraryToggle, onPlayAll, trackCount }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="relative">
      {/* Background Gradient */}
      <div className="h-80 bg-gradient-to-b from-gray-800 to-background relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(${album.coverImage})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
        <div className="flex items-end space-x-6">
          {/* Album Cover */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden bg-gray-600 shadow-2xl">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-600 hidden items-center justify-center">
                <ApperIcon name="Music" className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Album Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="text-sm font-medium text-gray-300 mb-2">
              Album
            </div>
            
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 break-words">
              {album.title}
            </h1>
            
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300 mb-6">
              <Link 
                to={`/artist/${album.artistId}`}
                className="font-semibold text-white hover:underline"
              >
                {album.artistName}
              </Link>
              <span>•</span>
              <span>{formatDate(album.releaseDate)}</span>
              <span>•</span>
              <span>{trackCount} songs</span>
              <span>•</span>
              <span>{formatDuration(album.duration)}</span>
            </div>

            {/* Genre & Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm">
                {album.genre}
              </span>
              {album.reviews && album.reviews.averageRating && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">
                    {album.reviews.averageRating} ({album.reviews.totalReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={onPlayAll}
                className="bg-primary text-black px-8 py-3 rounded-full font-semibold hover:bg-accent flex items-center space-x-2"
              >
                <ApperIcon name="Play" className="w-5 h-5 fill-current" />
                <span>Play</span>
              </Button>
              
              <Button
                onClick={onLibraryToggle}
                variant="ghost"
                className={`p-3 rounded-full transition-all ${
                  inLibrary
                    ? 'text-primary hover:bg-primary hover:bg-opacity-20'
                    : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-20'
                }`}
                title={inLibrary ? 'Remove from Library' : 'Add to Library'}
              >
                <ApperIcon 
                  name={inLibrary ? 'Check' : 'Plus'} 
                  className="w-6 h-6" 
                />
              </Button>
              
              <Button
                variant="ghost"
                className="p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <ApperIcon name="MoreHorizontal" className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailsHeader;