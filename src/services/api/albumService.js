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
    const album = this.albums.find(a => a.id === id);
    if (!album) {
      throw new Error('Album not found');
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
    const album = this.albums.find(a => a.id === albumId);
    if (!album || !album.tracks) return [];
    
    return album.tracks.map(trackId => {
      const track = this.tracks.find(t => t.id === trackId);
      return track ? { ...track } : null;
    }).filter(Boolean);
  }

  async getAlbumWithTracks(albumId) {
    await delay(350);
    const album = await this.getById(albumId);
    const tracks = await this.getTracksByAlbum(albumId);
    
    return {
      ...album,
      trackList: tracks
    };
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
    const index = this.albums.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Album not found');
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
    const album = this.albums.find(a => a.id === albumId);
    if (!album) {
      throw new Error('Album not found');
    }
    
    // Simulate adding to user's library
    return { ...album, inLibrary: true };
  }

  async removeFromLibrary(albumId) {
    await delay(200);
    const album = this.albums.find(a => a.id === albumId);
    if (!album) {
      throw new Error('Album not found');
    }
    
    // Simulate removing from user's library
    return { ...album, inLibrary: false };
  }
}

export default new AlbumService();