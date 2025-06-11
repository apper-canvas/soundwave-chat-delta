import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { trackService, playlistService } from '@/services';
import HomeHeroSection from '@/components/organisms/HomeHeroSection';
import PlaylistSection from '@/components/organisms/PlaylistSection';
import TrackSection from '@/components/organisms/TrackSection';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import ApperIcon from '@/components/ApperIcon';

const HomePage = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Assuming player state is global or passed down

  useEffect(() => {
    loadHomeData();
  }, []);

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

  const handlePlayTrack = async (track) => {
    // This logic would typically interact with a global player context
    console.log(`Playing: ${track.title}`);
    setCurrentlyPlaying(track); // Simulate playing
    toast.success(`Playing "${track.title}"`);
  };

  const handleLikeTrack = async (trackId) => {
    try {
      await trackService.toggleLike(trackId);
      toast.success('Track liked!');
    } catch (error) {
      toast.error('Failed to like track');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* Featured Playlists Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-surface rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded-lg p-4 animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-600 rounded mb-4"></div>
                <div className="h-5 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              </div>
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
    return <ErrorMessage message={error} onRetry={loadHomeData} />;
  }

  return (
    <div className="p-6 space-y-8 max-w-full overflow-hidden">
      <HomeHeroSection />

      <PlaylistSection
        title="Featured Playlists"
        playlists={featuredPlaylists}
        emptyMessage={{
          title: "No playlists yet",
          message: "Create your first playlist to get started"
        }}
        emptyIcon="Music"
        emptyActionText="Create Playlist"
        onEmptyActionClick={() => console.log('Navigate to create playlist')} // Placeholder
      />

      <TrackSection
        title="Recently Played"
        tracks={recentTracks}
        showIndex={false}
        onPlay={handlePlayTrack}
        onLike={handleLikeTrack}
        currentlyPlayingId={currentlyPlaying?.id}
        emptyMessage={{
          title: "No recent tracks",
          message: ""
        }}
        emptyIcon="Clock"
      />

      <TrackSection
        title="Recommended for You"
        tracks={recommendedTracks}
        showIndex={true}
        onPlay={handlePlayTrack}
        onLike={handleLikeTrack}
        currentlyPlayingId={currentlyPlaying?.id}
        emptyMessage={{
          title: "No recommendations available",
          message: ""
        }}
        emptyIcon="Sparkles"
      />
    </div>
  );
};

export default HomePage;