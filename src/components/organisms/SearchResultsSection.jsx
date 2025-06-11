import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TrackList from '@/components/organisms/TrackList';
import PlaylistCard from '@/components/molecules/PlaylistCard';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';

const SearchResultsSection = ({ searchResults, loading, error, onRetrySearch }) => {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Tracks Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-surface rounded w-32 animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2 animate-pulse">
                <div className="w-12 h-12 bg-surface rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface rounded w-48"></div>
                  <div className="h-3 bg-surface rounded w-32"></div>
                </div>
                <div className="h-4 bg-surface rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Playlists Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-surface rounded w-32 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg p-4 animate-pulse">
                <div className="w-full aspect-square bg-gray-600 rounded mb-4"></div>
                <div className="h-5 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetrySearch} />;
  }

  const hasResults = searchResults.tracks.length > 0 || searchResults.playlists.length > 0;

  return (
    <div className="space-y-8">
      {hasResults ? (
        <>
          {/* Tracks Results */}
          {searchResults.tracks.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-heading font-semibold">Songs</h2>
              <TrackList tracks={searchResults.tracks} showIndex={true} />
            </section>
          )}

          {/* Playlists Results */}
          {searchResults.playlists.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-heading font-semibold">Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PlaylistCard playlist={playlist} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <EmptyStateMessage
          icon="SearchX"
          title="No results found"
          message="Try searching for something else"
        />
      )}
    </div>
  );
};

export default SearchResultsSection;