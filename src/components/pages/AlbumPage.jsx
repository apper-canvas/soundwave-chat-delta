import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingMessage from '@/components/molecules/LoadingMessage';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import TrackList from '@/components/organisms/TrackList';
import AlbumDetailsHeader from '@/components/organisms/AlbumDetailsHeader';
import { albumService, playerService } from '@/services';

const AlbumPage = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inLibrary, setInLibrary] = useState(false);

  useEffect(() => {
    loadAlbumData();
  }, [id]);

  const loadAlbumData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [albumData, albumTracks] = await Promise.all([
        albumService.getById(id),
        albumService.getTracksByAlbum(id)
      ]);

      setAlbum(albumData);
      setTracks(albumTracks);
    } catch (err) {
      console.error('Error loading album:', err);
      setError(err.message);
      toast.error('Failed to load album information');
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

  const handlePlayAll = async () => {
    if (tracks.length > 0) {
      try {
        await playerService.playPlaylist(tracks);
        toast.success(`Playing "${album.title}"`);
      } catch (err) {
        toast.error('Failed to play album');
      }
    }
  };

  const handleLibraryToggle = async () => {
    try {
      if (inLibrary) {
        await albumService.removeFromLibrary(id);
        setInLibrary(false);
        toast.success(`Removed "${album.title}" from your library`);
      } else {
        await albumService.addToLibrary(id);
        setInLibrary(true);
        toast.success(`Added "${album.title}" to your library`);
      }
    } catch (err) {
      toast.error('Failed to update library');
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingMessage message="Loading album information..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadAlbumData} />;
  }

  if (!album) {
    return <ErrorMessage message="Album not found" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-white"
    >
      <AlbumDetailsHeader
        album={album}
        inLibrary={inLibrary}
        onLibraryToggle={handleLibraryToggle}
        onPlayAll={handlePlayAll}
        trackCount={tracks.length}
      />

      <div className="px-6 pb-20">
        {/* Album Tracks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold">Tracks</h2>
            <div className="text-sm text-gray-400">
              {tracks.length} songs, {formatDuration(album.duration)}
            </div>
          </div>
          
          {tracks.length > 0 ? (
            <TrackList
              tracks={tracks}
              showIndex
              onPlay={handlePlay}
            />
          ) : (
            <div className="text-center py-12 text-gray-400">
              <ApperIcon name="Music" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No tracks available for this album</p>
            </div>
          )}
        </section>

        {/* Album Information */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Album Details */}
          <div className="bg-surface rounded-lg p-6">
            <h3 className="text-xl font-heading font-bold mb-4">Album Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Artist</span>
                <Link 
                  to={`/artist/${album.artistId}`}
                  className="text-primary hover:underline"
                >
                  {album.artistName}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Release Date</span>
                <span>{formatDate(album.releaseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Genre</span>
                <span>{album.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Label</span>
                <span>{album.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Producer</span>
                <span>{album.producer}</span>
              </div>
              {album.reviews && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center space-x-2">
                    <span>{album.reviews.averageRating}/5</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <ApperIcon
                          key={star}
                          name="Star"
                          className={`w-4 h-4 ${
                            star <= album.reviews.averageRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Album Description */}
          {album.description && (
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-heading font-bold mb-4">About This Album</h3>
              <p className="text-gray-300 leading-relaxed">{album.description}</p>
              
              {album.tags && album.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {album.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-700 rounded-full text-xs capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Credits */}
        {album.credits && (
          <section className="mt-8">
            <div className="bg-surface rounded-lg p-6">
              <h3 className="text-xl font-heading font-bold mb-4">Credits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(album.credits).map(([role, person]) => (
                  <div key={role} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{role}</span>
                    <span>{person}</span>
                  </div>
                ))}
              </div>
              {album.recordingLocation && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recorded at</span>
                    <span>{album.recordingLocation}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default AlbumPage;