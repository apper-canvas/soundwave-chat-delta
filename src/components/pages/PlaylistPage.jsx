import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { playlistService, playerService, trackService } from '@/services';
import TrackList from '@/components/organisms/TrackList';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PlaylistDetailsHeader from '@/components/organisms/PlaylistDetailsHeader';
import PlayerControls from '@/components/organisms/PlayerControls';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';
import AddToPlaylistModal from '@/components/molecules/AddToPlaylistModal';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Assuming global player state
  const [addToPlaylistModal, setAddToPlaylistModal] = useState({ isOpen: false, track: null });
  
  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
    
    // Set up global handler for add to playlist
    window.openAddToPlaylistModal = (track) => {
      setAddToPlaylistModal({ isOpen: true, track });
    };
    
    return () => {
      delete window.openAddToPlaylistModal;
    };
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

  const handlePlayPlaylist = async () => {
    if (playlist?.tracks?.length > 0) {
      // Logic to start playing the playlist
      try {
        await playerService.playTrack(playlist.tracks[0]); // Play first track
        setCurrentlyPlaying(playlist.tracks[0]);
        toast.success(`Playing "${playlist.name}"`);
      } catch (err) {
        toast.error('Failed to start playlist');
      }
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
      toast.success('Track liked!');
} catch (error) {
      toast.error('Failed to like track');
    }
  };

  const handleCloseAddToPlaylistModal = () => {
    setAddToPlaylistModal({ isOpen: false, track: null });
  };

  const handleAddToPlaylistSuccess = () => {
    // Optionally refresh playlist if adding to current playlist
    if (addToPlaylistModal.track) {
      loadPlaylist();
    }
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
      <ErrorMessage
        message={error}
        onRetry={() => navigate('/library')} // Simulates "Back to Library"
      />
    );
  }

  if (!playlist) return null;

  return (
    <div className="max-w-full overflow-hidden">
      <PlaylistDetailsHeader playlist={playlist} />

      {/* Playlist Controls */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPlaylist}
            disabled={!playlist.tracks?.length}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-black hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Play" className="w-6 h-6 ml-1" />
          </Button>
          
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
          >
            <ApperIcon name="Heart" className="w-6 h-6" />
          </Button>
          
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 text-gray-400 hover:text-white transition-colors p-0 bg-transparent"
          >
            <ApperIcon name="MoreHorizontal" className="w-6 h-6" />
          </Button>
        </div>

        {/* Track List */}
        {playlist.tracks?.length === 0 ? (
          <EmptyStateMessage
            icon="Music"
            title="This playlist is empty"
            message="Add some tracks to get started"
            actionText="Find Music"
            onActionClick={() => navigate('/search')}
          />
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
              onPlay={handlePlayTrack}
              onLike={handleLikeTrack}
currentlyPlayingId={currentlyPlaying?.id}
            />
          </div>
        )}
      </div>
      
      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={addToPlaylistModal.isOpen}
        onClose={handleCloseAddToPlaylistModal}
        track={addToPlaylistModal.track}
        onSuccess={handleAddToPlaylistSuccess}
      />
    </div>
  );
};

export default PlaylistPage;