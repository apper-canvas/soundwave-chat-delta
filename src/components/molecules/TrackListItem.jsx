import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TrackListItem = ({ 
  track, 
  index, 
  onPlay, 
  onLike, 
  onRemove, 
  showIndex = false, 
  showRemove = false,
  currentlyPlayingId 
}) => {
  const isPlaying = currentlyPlayingId === track.id;
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      className="group flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors"
      onClick={() => onPlay && onPlay(track)}
    >
      {/* Index or Play Button */}
      <div className="w-8 text-center mr-4">
        {showIndex ? (
          <div className="relative">
            <span className={`text-sm group-hover:hidden ${isPlaying ? 'text-primary' : 'text-gray-400'}`}>
              {isPlaying ? (
                <ApperIcon name="Volume2" className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </span>
            <ApperIcon 
              name="Play" 
              className="w-4 h-4 hidden group-hover:block text-white fill-current" 
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPlay && onPlay(track)}
            className="w-8 h-8 p-0 rounded-full"
          >
            <ApperIcon name="Play" className="w-4 h-4 fill-current" />
          </Button>
        )}
      </div>

      {/* Track Image */}
      <div className="w-12 h-12 mr-4 flex-shrink-0">
        <div className="w-full h-full bg-gray-600 rounded overflow-hidden">
          <img
            src={track.image}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-gray-600 hidden items-center justify-center">
            <ApperIcon name="Music" className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 mr-4">
        <h4 className={`font-medium truncate ${isPlaying ? 'text-primary' : 'text-white'}`}>
          {track.title}
        </h4>
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <Link 
            to={`/artist/${track.artistId || '1'}`}
            className="hover:text-white hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {track.artist}
          </Link>
          {track.album && (
            <>
              <span>•</span>
              <Link 
                to={`/album/${track.albumId || '1'}`}
                className="hover:text-white hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {track.album}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onLike && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike(track.id);
            }}
            className="w-8 h-8 p-0 rounded-full"
          >
            <ApperIcon name="Heart" className="w-4 h-4" />
          </Button>
        )}

        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(track.id);
            }}
            className="w-8 h-8 p-0 rounded-full text-red-400 hover:text-red-300"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 rounded-full"
        >
          <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
        </Button>
      </div>

      {/* Duration */}
      <div className="w-12 text-right text-sm text-gray-400">
        {formatDuration(track.duration)}
      </div>
</motion.div>
  );
};

export default TrackListItem;