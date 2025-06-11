import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { playlistService } from '../services';
import TrackList from '../components/TrackList';
import ApperIcon from '../components/ApperIcon';

export default function Playlist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const loadPlaylist = async () => {
    setLoading(true);
    setError(null);
    try {
      const playlistData = await playlistService.getById(id);
      setPlaylist(playlistData);
    } catch (err) {
      setError(err.message || 'Failed to load playlist');
      toast.error('Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      const updatedPlaylist = await playlistService.removeTrack(id, trackId);
      setPlaylist(updatedPlaylist);
      toast.success('Track removed from playlist');
    } catch (err) {
      toast.error('Failed to remove track');
    }
  };

  const handlePlayPlaylist = () => {
    if (playlist?.tracks?.length > 0) {
      toast.success(`Playing "${playlist.name}"`);
    }
  };

  const formatDuration = (totalMs) => {
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="w-60 h-60 bg-surface rounded-lg animate-pulse"></div>
          <div className="space-y-4 flex-1">
            <div className="h-4 bg-surface rounded w-20 animate-pulse"></div>
            <div className="h-12 bg-surface rounded w-96 animate-pulse"></div>
            <div className="h-4 bg-surface rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-surface rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Controls Skeleton */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 bg-surface rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-surface rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-surface rounded-full animate-pulse"></div>
        </div>

        {/* Track List Skeleton */}
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2 animate-pulse">
              <div className="w-6 h-6 bg-surface rounded"></div>
              <div className="w-12 h-12 bg-surface rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface rounded w-48"></div>
                <div className="h-3 bg-surface rounded w-32"></div>
              </div>
              <div className="h-4 bg-surface rounded w-12"></div>
              <div className="w-6 h-6 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-heading font-semibold mb-2">Playlist not found</h3>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/library')}
          className="bg-primary text-black px-6 py-2 rounded-full font-medium"
        >
          Back to Library
        </motion.button>
      </div>
    );
  }

  if (!playlist) return null;

  const totalDuration = playlist.tracks?.reduce((total, track) => total + track.duration, 0) || 0;

  return (
    <div className="max-w-full overflow-hidden">
      {/* Playlist Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 pb-4"
      >
        <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-8">
          <div className="w-60 h-60 mx-auto md:mx-0 flex-shrink-0">
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0 text-center md:text-left">
            <p className="text-sm font-medium text-gray-300 mb-2">PLAYLIST</p>
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 break-words">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-gray-300 mb-4 break-words">{playlist.description}</p>
            )}
            <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-300 space-y-1 md:space-y-0">
              <span className="font-medium">SoundWave</span>
              {playlist.tracks?.length > 0 && (
                <>
                  <span className="hidden md:inline mx-2">•</span>
                  <span>{playlist.tracks.length} songs</span>
                  <span className="hidden md:inline mx-2">•</span>
                  <span>{formatDuration(totalDuration)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Playlist Controls */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPlaylist}
            disabled={!playlist.tracks?.length}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-black hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Play" className="w-6 h-6 ml-1" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="Heart" className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="MoreHorizontal" className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Track List */}
        {playlist.tracks?.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Music" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">This playlist is empty</h3>
            <p className="text-gray-400 mb-6">Add some tracks to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="bg-primary text-black px-6 py-2 rounded-full font-medium"
            >
              Find Music
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {/* Track List Header */}
            <div className="grid grid-cols-[16px,1fr,1fr,minmax(120px,1fr),40px] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700 mb-4">
              <div>#</div>
              <div>TITLE</div>
              <div className="hidden md:block">ALBUM</div>
              <div className="hidden sm:block">DATE ADDED</div>
              <div className="text-center">
                <ApperIcon name="Clock" className="w-4 h-4 mx-auto" />
              </div>
            </div>
            
            <TrackList 
              tracks={playlist.tracks} 
              showIndex={true}
              onRemove={handleRemoveTrack}
              showRemove={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}