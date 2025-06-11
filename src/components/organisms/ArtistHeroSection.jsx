import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ArtistHeroSection = ({ artist, isFollowing, onFollowToggle, onPlayAll }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <div 
        className="h-96 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(18,18,18,0.8) 100%), url(${artist.coverImage})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
        <div className="flex items-end space-x-6">
          {/* Artist Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-600 border-4 border-white shadow-2xl">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-600 hidden items-center justify-center">
                <ApperIcon name="User" className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* Artist Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center space-x-2 mb-2">
              {artist.verified && (
                <ApperIcon name="BadgeCheck" className="w-6 h-6 text-primary" />
              )}
              <span className="text-sm font-medium text-gray-300">
                Verified Artist
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 break-words">
              {artist.name}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300 mb-6">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Users" className="w-4 h-4" />
                <span>{formatNumber(artist.followers)} followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Play" className="w-4 h-4" />
                <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
              </div>
              {artist.location && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MapPin" className="w-4 h-4" />
                  <span>{artist.location}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {artist.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

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
                onClick={onFollowToggle}
                variant="outline"
                className={`px-6 py-3 rounded-full font-semibold border-2 transition-all ${
                  isFollowing
                    ? 'border-primary text-primary hover:bg-primary hover:text-black'
                    : 'border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
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

export default ArtistHeroSection;