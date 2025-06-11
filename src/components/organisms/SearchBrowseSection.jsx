import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { playlistService } from '@/services';
import GenreCard from '@/components/molecules/GenreCard';
import PlaylistCard from '@/components/molecules/PlaylistCard';

const SearchBrowseSection = () => {
  const [categories, setCategories] = useState([]);

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
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Browse all</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {browseGenres.map((genre, index) => (
            <GenreCard key={genre.name} {...genre} index={index} />
          ))}
        </div>
      </section>

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
  );
};

export default SearchBrowseSection;