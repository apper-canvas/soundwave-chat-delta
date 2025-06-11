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

  useEffect(() => {
    loadArtistData();
  }, [id]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [artistData, artistAlbums, artistTracks, relatedData] = await Promise.all([
        artistService.getById(id),
        artistService.getAlbumsByArtist(id),
        artistService.getTracksByArtist(id),
        artistService.getRelatedArtists(id)
      ]);

      setArtist(artistData);
      setAlbums(artistAlbums);
      setTopTracks(artistTracks);
      setRelatedArtists(relatedData);
    } catch (err) {
      console.error('Error loading artist:', err);
      setError(err.message);
      toast.error('Failed to load artist information');
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
        toast.success(`Unfollowed ${artist.name}`);
      } else {
        await artistService.follow(id);
        setIsFollowing(true);
        toast.success(`Following ${artist.name}`);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  const handlePlayAll = async () => {
    if (topTracks.length > 0) {
      try {
        await playerService.playPlaylist(topTracks);
        toast.success(`Playing ${artist.name}'s top tracks`);
      } catch (err) {
        toast.error('Failed to play tracks');
      }
    }
  };

  if (loading) {
    return <LoadingMessage message="Loading artist information..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadArtistData} />;
  }

  if (!artist) {
    return <ErrorMessage message="Artist not found" />;
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