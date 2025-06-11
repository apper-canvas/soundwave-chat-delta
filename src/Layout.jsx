import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { playlistService, playerService } from './services';
import { routes } from './config/routes';
import ApperIcon from '@/components/ApperIcon';
import PlayerBar from '@/components/organisms/PlayerBar';
import CreatePlaylistModal from '@/components/molecules/CreatePlaylistModal';

export default function Layout() {
const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playerState, setPlayerState] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadPlaylists();
    loadPlayerState();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await playlistService.getAll();
      setPlaylists(data.slice(0, 5)); // Show first 5 playlists in sidebar
    } catch (err) {
      console.error('Failed to load playlists:', err);
    }
  };

  const loadPlayerState = async () => {
    try {
      const state = await playerService.getCurrentState();
      setPlayerState(state);
    } catch (err) {
      console.error('Failed to load player state:', err);
    }
};

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    try {
      const newPlaylist = await playlistService.create({
        name: playlistName.trim(),
        description: `Created on ${new Date().toLocaleDateString()}`,
        coverUrl: '/api/placeholder/300/300',
        public: false,
        collaborative: false,
        trackCount: 0,
        duration: 0,
        owner: {
          id: 'current-user',
          name: 'You',
          image: '/api/placeholder/32/32'
        }
      });

      toast.success(`Playlist "${newPlaylist.name}" created successfully!`);
      setShowCreateModal(false);
      setPlaylistName('');
      await loadPlaylists(); // Refresh playlists
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast.error('Failed to create playlist. Please try again.');
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setPlaylistName('');
  };

const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          className="text-white"
        >
          <ApperIcon name="Menu" className="w-6 h-6" />
        </motion.button>
        
        <h1 className="text-xl font-heading font-bold text-primary">SoundWave</h1>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400"
        >
          <ApperIcon name="Search" className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-60 bg-secondary flex-col border-r border-gray-700">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-heading font-bold text-primary">SoundWave</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {Object.values(routes).map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5" />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="space-y-1">
<motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCreateModal}
                className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors w-full"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span className="font-medium">Create Playlist</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors w-full"
              >
                <ApperIcon name="Heart" className="w-5 h-5" />
                <span className="font-medium">Liked Songs</span>
              </motion.button>
            </div>

            {/* Playlists */}
            {playlists.length > 0 && (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Recently Created
                  </h3>
                </div>
                {playlists.map((playlist) => (
                  <NavLink
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800 min-w-0"
                  >
                    <div className="w-8 h-8 bg-surface rounded flex-shrink-0">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <span className="font-medium truncate">{playlist.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              />
              
              {/* Sidebar */}
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-secondary z-50 md:hidden flex flex-col border-r border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h1 className="text-xl font-heading font-bold text-primary">SoundWave</h1>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400"
                  >
                    <ApperIcon name="X" className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Navigation */}
                  <nav className="space-y-1">
                    {Object.values(routes).map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                            isActive
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} className="w-5 h-5" />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </nav>

                  {/* Quick Actions */}
                  <div className="space-y-1">
<button 
                      onClick={openCreateModal}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors w-full"
                    >
                      <ApperIcon name="Plus" className="w-5 h-5" />
                      <span className="font-medium">Create Playlist</span>
                    </button>
                    
                    <button className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors w-full">
                      <ApperIcon name="Heart" className="w-5 h-5" />
                      <span className="font-medium">Liked Songs</span>
                    </button>
                  </div>

                  {/* Mobile Playlists */}
                  {playlists.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-3 py-2">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                          Playlists
                        </h3>
                      </div>
                      {playlists.map((playlist) => (
                        <NavLink
                          key={playlist.id}
                          to={`/playlist/${playlist.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800 min-w-0"
                        >
                          <div className="w-8 h-8 bg-surface rounded flex-shrink-0">
                            <img
                              src={playlist.coverUrl}
                              alt={playlist.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <span className="font-medium truncate">{playlist.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

{/* Music Player Bar */}
      <PlayerBar playerState={playerState} onStateChange={setPlayerState} />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        show={showCreateModal}
        onClose={closeCreateModal}
        playlistName={playlistName}
        onNameChange={(e) => setPlaylistName(e.target.value)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
}