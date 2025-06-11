import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { trackService, playlistService } from '../services';
import TrackList from '../components/TrackList';
import PlaylistCard from '../components/PlaylistCard';
import ApperIcon from '../components/ApperIcon';

export default function Home() {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [playlists, recent, recommended] = await Promise.all([
          playlistService.getAll(),
          trackService.getRecentlyPlayed(),
          trackService.getRecommended()
        ]);
        
        setFeaturedPlaylists(playlists.slice(0, 6));
        setRecentTracks(recent.slice(0, 5));
        setRecommendedTracks(recommended.slice(0, 10));
      } catch (err) {
        setError(err.message || 'Failed to load home data');
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* Featured Playlists Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-surface rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface rounded-lg p-4 animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-600 rounded mb-4"></div>
                <div className="h-5 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recently Played Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-surface rounded w-40 animate-pulse"></div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-heading font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-primary text-black px-6 py-2 rounded-full font-medium hover:bg-accent transition-colors"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-full overflow-hidden">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-heading font-bold mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        </h1>
        <p className="text-gray-400">Ready to listen to your favorite music?</p>
      </motion.div>

      {/* Featured Playlists */}
      <section className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Featured Playlists</h2>
        {featuredPlaylists.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Music" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
            <p className="text-gray-400 mb-6">Create your first playlist to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-black px-6 py-2 rounded-full font-medium"
            >
              Create Playlist
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPlaylists.map((playlist, index) => (
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

      {/* Recently Played */}
      <section className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Recently Played</h2>
        {recentTracks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Clock" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No recent tracks</p>
          </div>
        ) : (
          <TrackList tracks={recentTracks} showIndex={false} />
        )}
      </section>

      {/* Recommended for You */}
      <section className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Recommended for You</h2>
        {recommendedTracks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Sparkles" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No recommendations available</p>
          </div>
        ) : (
          <TrackList tracks={recommendedTracks} showIndex={true} />
        )}
      </section>
    </div>
  );
}