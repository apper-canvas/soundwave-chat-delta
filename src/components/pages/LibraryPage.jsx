import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { playlistService, trackService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CreatePlaylistModal from '@/components/molecules/CreatePlaylistModal';
import PlaylistSection from '@/components/organisms/PlaylistSection';
import TrackSection from '@/components/organisms/TrackSection';
import ErrorMessage from '@/components/molecules/ErrorMessage';

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [view, setView] = useState('playlists'); // 'playlists' or 'tracks' or 'all'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Assuming global player state

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [playlistsData, likedData] = await Promise.all([
        playlistService.getAll(),
        trackService.getLikedSongs()
      ]);
      
      setPlaylists(playlistsData);
      setLikedSongs(likedData);
    } catch (err) {
      setError(err.message || 'Failed to load library');
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      const newPlaylist = await playlistService.create({
        name: newPlaylistName.trim(),
        description: '',
        tracks: [],
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center'
      });
      
      setPlaylists(prev => [newPlaylist, ...prev]);
      setNewPlaylistName('');
      setShowCreateModal(false);
      toast.success('Playlist created successfully');
      navigate(`/playlist/${newPlaylist.id}`);
    } catch (err) {
      toast.error('Failed to create playlist');
    }
  };

  const handlePlayTrack = (track) => {
    console.log(`Playing track: ${track.title}`);
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

  const filterOptions = [
    { id: 'all', label: 'All', icon: 'List' },
    { id: 'playlists', label: 'Playlists', icon: 'Music4' },
    { id: 'tracks', label: 'Liked Songs', icon: 'Heart' }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-surface rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-surface rounded w-20 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
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
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadLibraryData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold mb-4 md:mb-0">Your Library</h1>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-black px-6 py-2 rounded-full flex items-center space-x-2 w-fit"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Playlist</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(option.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
              view === option.id
                ? 'bg-primary text-black'
                : 'bg-surface text-white hover:bg-gray-600'
            }`}
          >
            <ApperIcon name={option.icon} className="w-4 h-4" />
            <span className="font-medium">{option.label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      {(view === 'playlists' || view === 'all') && (
        <PlaylistSection
          title={view === 'all' ? 'Playlists' : null}
          playlists={playlists}
          emptyMessage={{
            title: "No playlists yet",
            message: "Create your first playlist to organize your music"
          }}
          emptyIcon="Music4"
          emptyActionText="Create Playlist"
          onEmptyActionClick={() => setShowCreateModal(true)}
        />
      )}

      {(view === 'tracks' || view === 'all') && (
        <TrackSection
          title={view === 'all' ? 'Liked Songs' : null}
          tracks={likedSongs}
          showIndex={true}
          onPlay={handlePlayTrack}
          onLike={handleLikeTrack}
          currentlyPlayingId={currentlyPlaying?.id}
          emptyMessage={{
            title: "No liked songs",
            message: "Start liking songs to see them here"
          }}
          emptyIcon="Heart"
        />
      )}

      <CreatePlaylistModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewPlaylistName('');
        }}
        playlistName={newPlaylistName}
        onNameChange={(e) => setNewPlaylistName(e.target.value)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};

export default LibraryPage;