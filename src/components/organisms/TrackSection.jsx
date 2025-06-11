import React from 'react';
import TrackList from '@/components/organisms/TrackList';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';
import ApperIcon from '@/components/ApperIcon';

const TrackSection = ({ title, tracks, showIndex = false, onPlay, onLike, currentlyPlayingId, emptyMessage, emptyIcon }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-heading font-semibold">{title}</h2>
      {tracks.length === 0 ? (
        <EmptyStateMessage
          icon={emptyIcon || "Music"}
          title={emptyMessage.title}
          message={emptyMessage.message}
        />
      ) : (
        <TrackList
          tracks={tracks}
          showIndex={showIndex}
          onPlay={onPlay}
          onLike={onLike}
          currentlyPlayingId={currentlyPlayingId}
        />
      )}
    </section>
  );
};

export default TrackSection;