import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { trackService, playlistService } from '@/services';
import SearchBar from '@/components/molecules/SearchBar';
import SearchResultsSection from '@/components/organisms/SearchResultsSection';
import SearchBrowseSection from '@/components/organisms/SearchBrowseSection';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    playlists: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Search Header */}
      <div className="mb-8">
        <SearchBar
          query={query}
          onQueryChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Conditional Rendering of Search Results or Browse Categories */}
      {hasSearched ? (
        <SearchResultsSection
          searchResults={searchResults}
          loading={loading}
          error={error}
          onRetrySearch={() => handleSearch(query)}
        />
      ) : (
        <SearchBrowseSection />
      )}
    </div>
  );
};

export default SearchPage;