import trackData from '../mockData/tracks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TrackService {
  constructor() {
    this.tracks = [...trackData];
    this.likedSongs = [];
  }

  async getAll() {
    await delay(300);
    return [...this.tracks];
  }

  async getById(id) {
    await delay(200);
    const track = this.tracks.find(t => t.id === id);
    if (!track) {
      throw new Error('Track not found');
    }
    return { ...track };
  }

  async getFeatured() {
    await delay(400);
    // Return first 12 tracks as featured
    return this.tracks.slice(0, 12).map(track => ({ ...track }));
  }

  async getRecentlyPlayed() {
    await delay(300);
    // Simulate recently played by shuffling and taking first 8
    const shuffled = [...this.tracks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }

  async getRecommended() {
    await delay(350);
    // Simulate recommendations by shuffling and taking different set
    const shuffled = [...this.tracks].sort(() => Math.random() - 0.5);
    return shuffled.slice(8, 18);
  }

  async getLikedSongs() {
    await delay(250);
    return [...this.likedSongs];
  }

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.tracks.filter(track =>
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.album.toLowerCase().includes(searchTerm)
    );
  }

  async toggleLike(trackId) {
    await delay(200);
    const track = this.tracks.find(t => t.id === trackId);
    if (!track) {
      throw new Error('Track not found');
    }

    const isLiked = this.likedSongs.some(t => t.id === trackId);
    if (isLiked) {
      this.likedSongs = this.likedSongs.filter(t => t.id !== trackId);
    } else {
      this.likedSongs.push({ ...track });
    }

    return !isLiked;
  }

  async create(trackData) {
    await delay(300);
    const newTrack = {
      id: Date.now().toString(),
      ...trackData,
      createdAt: new Date().toISOString()
    };
    
    this.tracks.unshift(newTrack);
    return { ...newTrack };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tracks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Track not found');
    }
    
    this.tracks[index] = { ...this.tracks[index], ...updates };
    return { ...this.tracks[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.tracks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Track not found');
    }
    
    const deletedTrack = this.tracks.splice(index, 1)[0];
    // Also remove from liked songs if present
    this.likedSongs = this.likedSongs.filter(t => t.id !== id);
    return { ...deletedTrack };
  }
}

export default new TrackService();