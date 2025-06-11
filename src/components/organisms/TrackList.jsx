import React from 'react';
import TrackListItem from '@/components/molecules/TrackListItem';
import ApperIcon from '@/components/ApperIcon';

const TrackList = ({ tracks = [], showIndex = false, onPlay, onLike, onRemove, showRemove = false, currentlyPlayingId }) => {
  if (!tracks.length) return null;

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => (
        <TrackListItem
          key={track.id}
          track={track}
          index={index}
          onPlay={onPlay}
          onLike={onLike}
          onRemove={onRemove}
          showIndex={showIndex}
          showRemove={showRemove}
          currentlyPlayingId={currentlyPlayingId}
        />
      ))}
    </div>
  );
};

export default TrackList;