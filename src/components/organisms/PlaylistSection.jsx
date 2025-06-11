import React from 'react';
import { motion } from 'framer-motion';
import PlaylistCard from '@/components/molecules/PlaylistCard';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PlaylistSection = ({ title, playlists, emptyMessage, emptyIcon, emptyActionText, onEmptyActionClick }) => {
  return (
    <section className="space-y-4">
      {title && <h2 className="text-2xl font-heading font-semibold">{title}</h2>}
      {playlists.length === 0 ? (
        <EmptyStateMessage
          icon={emptyIcon || "Music"}
          title={emptyMessage.title}
          message={emptyMessage.message}
          actionText={emptyActionText}
          onActionClick={onEmptyActionClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlaylistCard playlist={playlist} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PlaylistSection;