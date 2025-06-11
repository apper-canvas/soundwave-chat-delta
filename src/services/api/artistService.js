import artistData from '../mockData/artists.json';
import albumData from '../mockData/albums.json';
import trackData from '../mockData/tracks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ArtistService {
  constructor() {
    this.artists = [...artistData];
    this.albums = [...albumData];
    this.tracks = [...trackData];
  }

  async getAll() {
    await delay(300);
    return [...this.artists];
  }

async getById(id) {
    await delay(200);
    
    // Enhanced ID validation and logging
    console.log('ArtistService.getById called with ID:', id, 'Type:', typeof id);
    
    if (!id || id === null || id === undefined) {
      throw new Error('Artist ID is required');
    }
    
    // Check for route parameter issues
    if (String(id) === ':id') {
      console.error('Received literal ":id" parameter - indicates routing configuration issue');
      throw new Error('Invalid route parameter ":id" - check route configuration');
    }
    
    if (String(id).startsWith(':')) {
      console.error('Received route parameter:', id);
      throw new Error(`Invalid route parameter "${id}" - check URL format`);
    }
    
    // Convert id to string for consistent comparison (URL params are always strings)
    const artistId = String(id).trim();
    
    if (artistId === '') {
      throw new Error('Artist ID cannot be empty');
    }
    
    console.log('Searching for artist with processed ID:', artistId);
    const artist = this.artists.find(a => String(a.id) === artistId);
    
    if (!artist) {
      console.error('Artist not found. Available artist IDs:', this.artists.map(a => a.id));
      throw new Error(`Artist with ID '${id}' not found`);
    }
    
    console.log('Found artist:', artist.name);
    return { ...artist };
  }

  async getFeatured() {
    await delay(400);
    // Return first 8 artists as featured
    return this.artists.slice(0, 8).map(artist => ({ ...artist }));
  }

  async getPopular() {
    await delay(350);
    // Sort by monthly listeners and return top 10
    const sorted = [...this.artists].sort((a, b) => b.monthlyListeners - a.monthlyListeners);
    return sorted.slice(0, 10);
  }

async getAlbumsByArtist(artistId) {
    await delay(250);
    
    if (!artistId || String(artistId).startsWith(':')) {
      console.warn('Invalid artist ID for albums lookup:', artistId);
      return [];
    }
    
    const id = String(artistId).trim();
    return this.albums.filter(album => String(album.artistId) === id).map(album => ({ ...album }));
  }

async getTracksByArtist(artistId) {
    await delay(300);
    
    if (!artistId || String(artistId).startsWith(':')) {
      console.warn('Invalid artist ID for tracks lookup:', artistId);
      return [];
    }
    
    // Get artist's top tracks based on topTracks array
    const id = String(artistId).trim();
    const artist = this.artists.find(a => String(a.id) === id);
    if (!artist) return [];
    
    if (!artist.topTracks || !Array.isArray(artist.topTracks)) {
      return [];
    }
    
    return artist.topTracks.map(trackId => {
      const track = this.tracks.find(t => String(t.id) === String(trackId));
      return track ? { ...track } : null;
    }).filter(Boolean);
  }

async getRelatedArtists(artistId) {
    await delay(300);
    
    if (!artistId || String(artistId).startsWith(':')) {
      console.warn('Invalid artist ID for related artists lookup:', artistId);
      return [];
    }
    
    const id = String(artistId).trim();
    const artist = this.artists.find(a => String(a.id) === id);
    if (!artist || !artist.relatedArtists) return [];
    
    return artist.relatedArtists.map(relatedId => {
      const relatedArtist = this.artists.find(a => String(a.id) === String(relatedId));
      return relatedArtist ? { ...relatedArtist } : null;
    }).filter(Boolean);
  }

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.artists.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm) ||
      artist.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
      artist.description.toLowerCase().includes(searchTerm)
    );
  }

  async getByGenre(genre) {
    await delay(300);
    return this.artists.filter(artist =>
      artist.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );
  }

  async create(artistData) {
    await delay(300);
    const newArtist = {
      id: Date.now().toString(),
      ...artistData,
      followers: 0,
      monthlyListeners: 0,
      verified: false,
      topTracks: [],
      albums: [],
      relatedArtists: [],
      createdAt: new Date().toISOString()
    };
    
    this.artists.unshift(newArtist);
    return { ...newArtist };
  }

async update(id, updates) {
    await delay(300);
    const artistId = String(id);
    const index = this.artists.findIndex(a => String(a.id) === artistId);
    if (index === -1) {
      throw new Error(`Artist with ID '${id}' not found`);
    }
    
    this.artists[index] = { ...this.artists[index], ...updates };
    return { ...this.artists[index] };
  }

async delete(id) {
    await delay(250);
    const artistId = String(id);
    const index = this.artists.findIndex(a => String(a.id) === artistId);
    if (index === -1) {
      throw new Error(`Artist with ID '${id}' not found`);
    }
    
    const deletedArtist = this.artists.splice(index, 1)[0];
    return { ...deletedArtist };
  }

async follow(artistId) {
    await delay(200);
    const id = String(artistId);
    const artist = this.artists.find(a => String(a.id) === id);
    if (!artist) {
      throw new Error(`Artist with ID '${artistId}' not found`);
    }
    
    artist.followers = (artist.followers || 0) + 1;
    return { ...artist };
  }

async unfollow(artistId) {
    await delay(200);
    const id = String(artistId);
    const artist = this.artists.find(a => String(a.id) === id);
    if (!artist) {
      throw new Error(`Artist with ID '${artistId}' not found`);
    }
    
    artist.followers = Math.max(0, (artist.followers || 0) - 1);
    return { ...artist };
  }
}

export default new ArtistService();