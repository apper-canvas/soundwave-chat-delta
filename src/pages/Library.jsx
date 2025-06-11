import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { playlistService, trackService } from '../services';
import PlaylistCard from '../components/PlaylistCard';
import TrackList from '../components/TrackList';
import ApperIcon from '../components/ApperIcon';

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [view, setView] = useState('playlists'); // 'playlists' or 'tracks'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const navigate = useNavigate();

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
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-heading font-semibold mb-2">Failed to load library</h3>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadLibraryData}
          className="bg-primary text-black px-6 py-2 rounded-full font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold mb-4 md:mb-0">Your Library</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-black px-6 py-2 rounded-full font-medium flex items-center space-x-2 w-fit"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Create Playlist</span>
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide">
        {filterOptions.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(option.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              view === option.id
                ? 'bg-primary text-black'
                : 'bg-surface text-white hover:bg-gray-600'
            }`}
          >
            <ApperIcon name={option.icon} className="w-4 h-4" />
            <span className="font-medium">{option.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {view === 'playlists' || view === 'all' ? (
        <section className={view === 'all' ? 'mb-8' : ''}>
          {view === 'all' && (
            <h2 className="text-2xl font-heading font-semibold mb-4">Playlists</h2>
          )}
          
          {playlists.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Music4" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
              <p className="text-gray-400 mb-6">Create your first playlist to organize your music</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-primary text-black px-6 py-2 rounded-full font-medium"
              >
                Create Playlist
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist, index) => (
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
          )}
        </section>
      ) : null}

      {/* Liked Songs */}
      {(view === 'tracks' || view === 'all') && (
        <section>
          {view === 'all' && (
            <h2 className="text-2xl font-heading font-semibold mb-4">Liked Songs</h2>
          )}
          
          {likedSongs.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Heart" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No liked songs</h3>
              <p className="text-gray-400">Start liking songs to see them here</p>
            </motion.div>
          ) : (
            <TrackList tracks={likedSongs} showIndex={true} />
          )}
        </section>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-heading font-semibold mb-4">Create Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName('');
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded font-medium hover:bg-gray-500 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePlaylist}
                className="flex-1 bg-primary text-black px-4 py-2 rounded font-medium hover:bg-accent transition-colors"
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}