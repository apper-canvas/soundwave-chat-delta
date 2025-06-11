import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { playlistService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const AddToPlaylistModal = ({ isOpen, onClose, track, onSuccess }) => {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlaylists();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    } else {
      setFilteredPlaylists(playlists);
    }
  }, [searchQuery, playlists]);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await playlistService.getAll();
      setPlaylists(data);
      setFilteredPlaylists(data);
    } catch (error) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlist) => {
    setAdding(true);
    try {
      await playlistService.addTrack(playlist.id, track.id);
      toast.success(`Added "${track.title}" to "${playlist.name}"`);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      if (error.message === 'Track already in playlist') {
        toast.warn('Track is already in this playlist');
      } else {
        toast.error('Failed to add track to playlist');
      }
    } finally {
      setAdding(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="bg-surface rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Add to Playlist</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 rounded-full text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
            
            {track && (
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gray-600 hidden items-center justify-center">
                    <ApperIcon name="Music" className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.title}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <Input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<ApperIcon name="Search" className="w-4 h-4" />}
            />
          </div>

          {/* Playlist List */}
          <div className="p-4 overflow-y-auto max-h-96">
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-600 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Music" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">
                  {searchQuery ? 'No playlists found' : 'No playlists available'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPlaylists.map((playlist) => (
                  <motion.button
                    key={playlist.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => handleAddToPlaylist(playlist)}
                    disabled={adding}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-12 h-12 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-600 hidden items-center justify-center">
                        <ApperIcon name="Music" className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{playlist.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {playlist.tracks?.length || 0} songs
                      </p>
                    </div>
                    {adding && (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddToPlaylistModal;