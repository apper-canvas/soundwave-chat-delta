import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingMessage from '@/components/molecules/LoadingMessage';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import TrackList from '@/components/organisms/TrackList';
import AlbumCard from '@/components/molecules/AlbumCard';
import ArtistCard from '@/components/molecules/ArtistCard';
import ArtistHeroSection from '@/components/organisms/ArtistHeroSection';
import { artistService, albumService, playerService } from '@/services';

const ArtistPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  // Validate route parameter
  const validateArtistId = (artistId) => {
    if (!artistId || artistId.trim() === '') {
      return { valid: false, error: 'Artist ID is missing from the URL' };
    }
    
    // Check for literal route parameter (indicates routing issue)
    if (artistId === ':id') {
      return { 
        valid: false, 
        error: 'Invalid route configuration - receiving literal ":id" parameter' 
      };
    }
    
    // Check for other route parameter patterns
    if (artistId.startsWith(':')) {
      return { 
        valid: false, 
        error: `Invalid route parameter: ${artistId}` 
      };
    }
    
    return { valid: true, error: null };
  };

  useEffect(() => {
    const validation = validateArtistId(id);
    if (!validation.valid) {
      setError(validation.error);
      setLoading(false);
      toast.error(validation.error);
      return;
    }
    
    loadArtistData();
  }, [id]);

const loadArtistData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Double-check ID validation before API call
      const validation = validateArtistId(id);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      console.log('Loading artist data for ID:', id); // Debug log
      
      // First, try to get the artist data
      const artistData = await artistService.getById(id);
      setArtist(artistData);

      // Then load related data, but don't fail if some parts fail
      const [artistAlbums, artistTracks, relatedData] = await Promise.allSettled([
        artistService.getAlbumsByArtist(id),
        artistService.getTracksByArtist(id),
        artistService.getRelatedArtists(id)
      ]);

      // Set data from successful requests, use empty arrays for failed ones
      setAlbums(artistAlbums.status === 'fulfilled' ? artistAlbums.value || [] : []);
      setTopTracks(artistTracks.status === 'fulfilled' ? artistTracks.value || [] : []);
      setRelatedArtists(relatedData.status === 'fulfilled' ? relatedData.value || [] : []);

      // Show warnings for failed requests (but don't fail the whole page)
      if (artistAlbums.status === 'rejected') {
        console.warn('Failed to load albums:', artistAlbums.reason);
      }
      if (artistTracks.status === 'rejected') {
        console.warn('Failed to load tracks:', artistTracks.reason);
      }
      if (relatedData.status === 'rejected') {
        console.warn('Failed to load related artists:', relatedData.reason);
      }
    } catch (err) {
      console.error('Error loading artist:', err);
      console.error('Attempted to load artist with ID:', id); // Debug info
      
      let errorMessage = 'Failed to load artist information';
      let toastMessage = 'Failed to load artist information';
      
      // Handle different error types
      if (err.message?.includes('not found')) {
        errorMessage = `Artist with ID "${id}" not found`;
        toastMessage = 'Artist not found. Please check the URL and try again.';
      } else if (err.message?.includes('route parameter') || err.message?.includes('route configuration')) {
        errorMessage = 'Invalid URL - please check the artist link';
        toastMessage = 'Invalid artist URL. Please try accessing the artist from the main page.';
      } else if (err.message?.includes('missing')) {
        errorMessage = 'Invalid artist URL';
        toastMessage = 'Invalid artist URL. Please try again.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(toastMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (track) => {
    try {
      await playerService.playTrack(track);
      toast.success(`Playing "${track.title}"`);
    } catch (err) {
      toast.error('Failed to play track');
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await artistService.unfollow(id);
        setIsFollowing(false);
toast.success(`Unfollowed ${artist?.name || 'artist'}`);
      } else {
        await artistService.follow(id);
        setIsFollowing(true);
        toast.success(`Following ${artist?.name || 'artist'}`);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const handlePlayAll = async () => {
    if (topTracks.length > 0) {
      try {
        await playerService.playPlaylist(topTracks);
toast.success(`Playing ${artist?.name || 'artist'}'s top tracks`);
      } catch (err) {
        toast.error('Failed to play tracks');
      }
    }
  };

  if (loading) {
    return <LoadingMessage message="Loading artist information..." />;
  }

if (error) {
    // Don't show retry button for route parameter errors
    const isRouteError = error.includes('route') || error.includes('URL') || id === ':id' || !id;
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <ErrorMessage 
            message={error} 
            onRetry={isRouteError ? null : loadArtistData}
          />
          {isRouteError && (
            <div className="mt-6">
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ApperIcon name="Home" className="w-4 h-4 mr-2" />
                Go to Home Page
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <ErrorMessage message="Artist data not available" onRetry={loadArtistData} />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'albums', label: 'Albums' },
    { id: 'tracks', label: 'Top Tracks' },
    { id: 'related', label: 'Related Artists' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-white"
    >
      <ArtistHeroSection
        artist={artist}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onPlayAll={handlePlayAll}
      />

      <div className="px-6 pb-20">
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-gray-700 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Popular Tracks */}
              {topTracks.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading font-bold">Popular Tracks</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('tracks')}
                    >
                      Show All
                    </Button>
                  </div>
                  <TrackList
                    tracks={topTracks.slice(0, 5)}
                    showIndex
                    onPlay={handlePlay}
                  />
                </section>
              )}

              {/* Albums */}
              {albums.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading font-bold">Albums</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('albums')}
                    >
                      Show All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {albums.slice(0, 5).map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                  </div>
                </section>
              )}

              {/* Artist Bio */}
              {artist.bio && (
                <section>
                  <h2 className="text-2xl font-heading font-bold mb-6">About</h2>
                  <div className="bg-surface rounded-lg p-6">
                    <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
                    {artist.socialLinks && (
                      <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-gray-600">
                        {Object.entries(artist.socialLinks).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon
                              name={platform === 'website' ? 'Globe' : 'ExternalLink'}
                              className="w-5 h-5"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'albums' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">
                Albums ({albums.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tracks' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">
                Top Tracks ({topTracks.length})
              </h2>
              <TrackList
                tracks={topTracks}
                showIndex
                onPlay={handlePlay}
              />
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">
                Related Artists ({relatedArtists.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {relatedArtists.map((relatedArtist) => (
                  <ArtistCard key={relatedArtist.id} artist={relatedArtist} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArtistPage;