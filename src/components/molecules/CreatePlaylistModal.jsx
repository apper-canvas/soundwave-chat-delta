import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const CreatePlaylistModal = ({ show, onClose, playlistName, onNameChange, onCreate }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-heading font-semibold mb-4">Create Playlist</h3>
        <Input
          type="text"
          value={playlistName}
          onChange={onNameChange}
          placeholder="Playlist name"
          className="mb-6"
          autoFocus
          onKeyPress={(e) => e.key === 'Enter' && onCreate()}
        />
        <div className="flex space-x-3">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white hover:bg-gray-500 py-2 rounded"
          >
            Cancel
          </Button>
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreate}
            className="flex-1 bg-primary text-black hover:bg-accent py-2 rounded"
          >
            Create
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePlaylistModal;