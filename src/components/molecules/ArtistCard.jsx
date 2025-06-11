import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ArtistCard = ({ artist }) => {
  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
    >
      <Link to={`/artist/${artist.id}`}>
        <div className="bg-surface p-4 rounded-lg hover:bg-gray-700 transition-all duration-300">
          {/* Artist Image */}
          <div className="relative mb-4">
            <div className="aspect-square rounded-full overflow-hidden bg-gray-600">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-600 rounded-full hidden items-center justify-center">
                <ApperIcon name="User" className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            
            {/* Verified Badge */}
            {artist.verified && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <ApperIcon name="Check" className="w-3 h-3 text-black" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="text-center">
            <h3 className="font-heading font-semibold text-white mb-1 truncate">
              {artist.name}
            </h3>
            
            {/* Genres */}
            {artist.genres && artist.genres.length > 0 && (
              <p className="text-sm text-gray-400 mb-2">
                {artist.genres.slice(0, 2).join(', ')}
              </p>
            )}
            
            {/* Followers */}
            {artist.followers && (
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <ApperIcon name="Users" className="w-3 h-3" />
                <span>{formatFollowers(artist.followers)} followers</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArtistCard;