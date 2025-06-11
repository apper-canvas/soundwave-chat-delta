import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { trackService, playerService } from '@/services';
import TrackList from '@/components/organisms/TrackList';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import LoadingMessage from '@/components/molecules/LoadingMessage';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';

const FeaturedTracksSection = () => {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    loadFeaturedTracks();
  }, []);

  const loadFeaturedTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tracks = await trackService.getFeatured();
      setFeaturedTracks(tracks);
    } catch (err) {
      setError(err.message || 'Failed to load featured tracks');
      toast.error('Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (track) => {
    try {
      await playerService.playTrack(track);
      setCurrentlyPlaying(track);
      toast.success(`Playing "${track.title}"`);
    } catch (err) {
      toast.error('Failed to play track');
    }
  };

  const handleLikeTrack = async (trackId) => {
    try {
      await trackService.toggleLike(trackId);
      toast.success('Added to Liked Songs');
    } catch (err) {
      toast.error('Failed to like track');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="h-8 bg-surface rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface rounded w-96 mx-auto animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
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
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadFeaturedTracks} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-heading font-bold mb-2"
        >
          Featured Music
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Discover trending tracks and new releases
        </motion.p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePlayTrack(featuredTracks[0])}
          disabled={!featuredTracks.length}
          className="bg-primary text-black px-6 py-3 rounded-full flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon name="Play" className="w-5 h-5" />
          <span>Play All</span>
        </Button>
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-surface text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-600"
        >
          <ApperIcon name="Shuffle" className="w-5 h-5" />
          <span>Shuffle</span>
        </Button>
      </div>

      {/* Track List */}
      {featuredTracks.length === 0 ? (
        <EmptyStateMessage
          icon="Music"
          title="No tracks available"
          message="Check back later for new music"
        />
      ) : (
        <div className="bg-surface rounded-lg p-6">
          <TrackList 
            tracks={featuredTracks}
            showIndex={true}
            onPlay={handlePlayTrack}
            onLike={handleLikeTrack}
            currentlyPlayingId={currentlyPlaying?.id}
          />
        </div>
      )}

      {/* Currently Playing Indicator */}
      {currentlyPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-6 bg-primary text-black p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm z-50"
        >
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
            <img
              src={currentlyPlaying.coverUrl}
              alt={currentlyPlaying.album}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentlyPlaying.title}</p>
            <p className="text-sm opacity-80 truncate">{currentlyPlaying.artist}</p>
          </div>
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-black rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-black rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-4 bg-black rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedTracksSection;