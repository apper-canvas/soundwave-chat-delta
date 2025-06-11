import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TrackListItem = ({
  track,
  index,
  onPlay,
  onLike,
  onRemove,
  showIndex,
  showRemove,
  currentlyPlayingId
}) => {
  const isPlaying = currentlyPlayingId === track.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      className={`grid grid-cols-[40px,1fr,1fr,minmax(120px,1fr),40px] gap-4 items-center px-4 py-2 rounded group cursor-pointer ${
        isPlaying ? 'bg-primary bg-opacity-20' : ''
      }`}
      onClick={() => onPlay?.(track)}
    >
      {/* Index/Play Button */}
      <div className="flex items-center justify-center">
        {showIndex ? (
          <div className="group-hover:hidden text-gray-400 text-sm">
            {isPlaying ? (
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-primary rounded animate-pulse"></div>
                <div className="w-1 h-3 bg-primary rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-3 bg-primary rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              index + 1
            )}
          </div>
        ) : null}
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.(track);
          }}
          className={`${showIndex ? 'hidden group-hover:flex' : 'flex'} items-center justify-center w-8 h-8 rounded-full bg-primary text-black hover:bg-accent`}
        >
          <ApperIcon
            name={isPlaying ? 'Pause' : 'Play'}
            className="w-4 h-4"
          />
        </Button>
      </div>

      {/* Track Info */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 bg-surface rounded overflow-hidden flex-shrink-0">
          <img
            src={track.coverUrl}
            alt={track.album}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-medium truncate ${isPlaying ? 'text-primary' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Album */}
      <div className="hidden md:block">
        <p className="text-sm text-gray-400 truncate">{track.album}</p>
      </div>

      {/* Date Added */}
      <div className="hidden sm:block">
        <p className="text-sm text-gray-400">
          {track.createdAt ? formatDistanceToNow(new Date(track.createdAt), { addSuffix: true }) : 'N/A'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(track.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all w-fit h-fit px-0 py-0 bg-transparent"
        >
          <ApperIcon name="Heart" className="w-4 h-4" />
        </Button>

        <span className="text-sm text-gray-400 min-w-[40px] text-right">
          {formatDuration(track.duration)}
        </span>

        {showRemove && (
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(track.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all w-fit h-fit px-0 py-0 bg-transparent"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}

        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all w-fit h-fit px-0 py-0 bg-transparent"
        >
          <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TrackListItem;