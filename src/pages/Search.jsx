import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { trackService, playlistService } from '../services';
import TrackList from '../components/TrackList';
import PlaylistCard from '../components/PlaylistCard';
import ApperIcon from '../components/ApperIcon';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    playlists: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const playlists = await playlistService.getAll();
        setCategories(playlists.slice(0, 8));
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setSearchResults({ tracks: [], playlists: [] });
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const [tracks, playlists] = await Promise.all([
        trackService.search(searchQuery),
        playlistService.search(searchQuery)
      ]);
      
      setSearchResults({
        tracks: tracks.slice(0, 20),
        playlists: playlists.slice(0, 12)
      });
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const browseGenres = [
    { name: 'Pop', color: 'bg-pink-500', icon: 'Music' },
    { name: 'Rock', color: 'bg-red-500', icon: 'Guitar' },
    { name: 'Hip Hop', color: 'bg-purple-500', icon: 'Mic' },
    { name: 'Electronic', color: 'bg-blue-500', icon: 'Zap' },
    { name: 'Jazz', color: 'bg-yellow-500', icon: 'Piano' },
    { name: 'Classical', color: 'bg-green-500', icon: 'Music2' },
    { name: 'R&B', color: 'bg-orange-500', icon: 'Heart' },
    { name: 'Country', color: 'bg-amber-600', icon: 'MapPin' }
  ];

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Search Header */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-surface text-white pl-10 pr-4 py-3 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-8">
          {loading ? (
            <div className="space-y-8">
              {/* Tracks Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-surface rounded w-32 animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2 animate-pulse">
                      <div className="w-12 h-12 bg-surface rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface rounded w-48"></div>
                        <div className="h-3 bg-surface rounded w-32"></div>
                      </div>
                      <div className="h-4 bg-surface rounded w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Playlists Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-surface rounded w-32 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-surface rounded-lg p-4 animate-pulse">
                      <div className="w-full aspect-square bg-gray-600 rounded mb-4"></div>
                      <div className="h-5 bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Search failed</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch(query)}
                className="bg-primary text-black px-6 py-2 rounded-full font-medium"
              >
                Try Again
              </motion.button>
            </div>
          ) : (
            <>
              {/* Tracks Results */}
              {searchResults.tracks.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-heading font-semibold">Songs</h2>
                  <TrackList tracks={searchResults.tracks} showIndex={true} />
                </section>
              )}

              {/* Playlists Results */}
              {searchResults.playlists.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-heading font-semibold">Playlists</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.playlists.map((playlist, index) => (
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
                </section>
              )}

              {/* No Results */}
              {searchResults.tracks.length === 0 && searchResults.playlists.length === 0 && !loading && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <ApperIcon name="SearchX" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">No results found</h3>
                  <p className="text-gray-400">Try searching for something else</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      )}

      {/* Browse Categories (when not searching) */}
      {!hasSearched && (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {browseGenres.map((genre, index) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, brightness: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${genre.color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer`}
                >
                  <h3 className="text-white font-heading font-semibold text-lg">
                    {genre.name}
                  </h3>
                  <ApperIcon 
                    name={genre.icon}
                    className="absolute bottom-2 right-2 w-8 h-8 text-white opacity-80"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Recently Searched */}
          {categories.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-heading font-semibold">Recently searched</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((playlist, index) => (
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
            </section>
          )}
        </div>
      )}
    </div>
  );
}