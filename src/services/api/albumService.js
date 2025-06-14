import albumData from '../mockData/albums.json';
import trackData from '../mockData/tracks.json';
import artistData from '../mockData/artists.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AlbumService {
  constructor() {
    this.albums = [...albumData];
    this.tracks = [...trackData];
    this.artists = [...artistData];
  }

  async getAll() {
    await delay(300);
    return [...this.albums];
  }

async getById(id) {
    await delay(200);
    
    // Validate input
    if (!id) {
      console.error('AlbumService.getById: No ID provided');
      throw new Error('Album ID is required');
    }
    
    // Normalize ID for comparison (handle both string and number IDs)
    const normalizedId = String(id).trim();
    const album = this.albums.find(a => String(a.id) === normalizedId);
    
    if (!album) {
      console.error(`AlbumService.getById: Album not found for ID "${id}" (normalized: "${normalizedId}")`);
      console.error('Available album IDs:', this.albums.map(a => a.id));
      throw new Error(`Album not found with ID: ${id}`);
    }
    
    return { ...album };
  }

  async getFeatured() {
    await delay(400);
    // Return first 8 albums as featured
    return this.albums.slice(0, 8).map(album => ({ ...album }));
  }

  async getNewReleases() {
    await delay(350);
    // Sort by release date and return most recent
    const sorted = [...this.albums].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    return sorted.slice(0, 10);
  }

  async getByArtist(artistId) {
    await delay(250);
    return this.albums.filter(album => album.artistId === artistId).map(album => ({ ...album }));
  }

async getTracksByAlbum(albumId) {
    await delay(300);
    
    if (!albumId) {
      console.error('AlbumService.getTracksByAlbum: No album ID provided');
      return [];
    }
    
    const normalizedAlbumId = String(albumId).trim();
    const album = this.albums.find(a => String(a.id) === normalizedAlbumId);
    
    if (!album) {
      console.error(`AlbumService.getTracksByAlbum: Album not found for ID "${albumId}"`);
      return [];
    }
    
    if (!album.tracks || !Array.isArray(album.tracks)) {
      console.warn(`AlbumService.getTracksByAlbum: No tracks found for album "${album.title}"`);
      return [];
    }
    
    return album.tracks.map(trackId => {
      const normalizedTrackId = String(trackId).trim();
      const track = this.tracks.find(t => String(t.id) === normalizedTrackId);
      if (!track) {
        console.warn(`AlbumService.getTracksByAlbum: Track not found for ID "${trackId}"`);
      }
      return track ? { ...track } : null;
    }).filter(Boolean);
  }

async getAlbumWithTracks(albumId) {
    await delay(350);
    
    try {
      const album = await this.getById(albumId);
      const tracks = await this.getTracksByAlbum(albumId);
      
      return {
        ...album,
        trackList: tracks || []
      };
    } catch (error) {
      console.error(`AlbumService.getAlbumWithTracks: Failed to get album with tracks for ID "${albumId}":`, error);
      throw error;
    }
  }

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.albums.filter(album =>
      album.title.toLowerCase().includes(searchTerm) ||
      album.artistName.toLowerCase().includes(searchTerm) ||
      album.genre.toLowerCase().includes(searchTerm) ||
      album.description.toLowerCase().includes(searchTerm)
    );
  }

  async getByGenre(genre) {
    await delay(300);
    return this.albums.filter(album =>
      album.genre.toLowerCase() === genre.toLowerCase() ||
      album.tags.some(tag => tag.toLowerCase() === genre.toLowerCase())
    );
  }

  async getByYear(year) {
    await delay(300);
    return this.albums.filter(album => {
      const releaseYear = new Date(album.releaseDate).getFullYear();
      return releaseYear === year;
    });
  }

  async getTopRated() {
    await delay(350);
    return [...this.albums]
      .filter(album => album.reviews && album.reviews.averageRating)
      .sort((a, b) => b.reviews.averageRating - a.reviews.averageRating)
      .slice(0, 10);
  }

  async create(albumData) {
    await delay(300);
    const newAlbum = {
      id: Date.now().toString(),
      ...albumData,
      releaseDate: albumData.releaseDate || new Date().toISOString().split('T')[0],
      tracks: [],
      reviews: {
        averageRating: 0,
        totalReviews: 0
      },
      createdAt: new Date().toISOString()
    };
    
    this.albums.unshift(newAlbum);
    return { ...newAlbum };
  }

async update(id, updates) {
    await delay(300);
    
    if (!id) {
      throw new Error('Album ID is required for update');
    }
    
    const normalizedId = String(id).trim();
    const index = this.albums.findIndex(a => String(a.id) === normalizedId);
    
    if (index === -1) {
      console.error(`AlbumService.update: Album not found for ID "${id}"`);
      throw new Error(`Album not found with ID: ${id}`);
    }
    
    this.albums[index] = { ...this.albums[index], ...updates };
    return { ...this.albums[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.albums.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Album not found');
    }
    
    const deletedAlbum = this.albums.splice(index, 1)[0];
    return { ...deletedAlbum };
  }

async addToLibrary(albumId) {
    await delay(200);
    
    if (!albumId) {
      throw new Error('Album ID is required');
    }
    
    const normalizedId = String(albumId).trim();
    const album = this.albums.find(a => String(a.id) === normalizedId);
    
    if (!album) {
      console.error(`AlbumService.addToLibrary: Album not found for ID "${albumId}"`);
      throw new Error(`Album not found with ID: ${albumId}`);
    }
    
    // Simulate adding to user's library
    return { ...album, inLibrary: true };
  }

async removeFromLibrary(albumId) {
    await delay(200);
    
    if (!albumId) {
      throw new Error('Album ID is required');
    }
    
    const normalizedId = String(albumId).trim();
    const album = this.albums.find(a => String(a.id) === normalizedId);
    
    if (!album) {
      console.error(`AlbumService.removeFromLibrary: Album not found for ID "${albumId}"`);
      throw new Error(`Album not found with ID: ${albumId}`);
    }
    
    // Simulate removing from user's library
    return { ...album, inLibrary: false };
  }
}

export default new AlbumService();