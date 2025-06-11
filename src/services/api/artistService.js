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
    // Convert id to string for consistent comparison (URL params are always strings)
    const artistId = String(id);
    const artist = this.artists.find(a => String(a.id) === artistId);
    if (!artist) {
      throw new Error(`Artist with ID '${id}' not found`);
    }
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
    const id = String(artistId);
    return this.albums.filter(album => String(album.artistId) === id).map(album => ({ ...album }));
  }

async getTracksByArtist(artistId) {
    await delay(300);
    // Get artist's top tracks based on topTracks array
    const id = String(artistId);
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
    const id = String(artistId);
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