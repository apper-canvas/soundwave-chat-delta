import playlistData from '../mockData/playlists.json';
import trackService from './trackService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlaylistService {
  constructor() {
    this.playlists = [...playlistData];
  }

  async getAll() {
    await delay(350);
    return [...this.playlists];
  }

  async getById(id) {
    await delay(250);
    const playlist = this.playlists.find(p => p.id === id);
    if (!playlist) {
      throw new Error('Playlist not found');
    }
    return { ...playlist };
  }

  async search(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm) ||
      playlist.description.toLowerCase().includes(searchTerm)
    );
  }

  async create(playlistData) {
    await delay(400);
    const newPlaylist = {
      id: Date.now().toString(),
      tracks: [],
      createdAt: new Date().toISOString(),
      ...playlistData
    };
    
    this.playlists.unshift(newPlaylist);
    return { ...newPlaylist };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.playlists.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    
    this.playlists[index] = { ...this.playlists[index], ...updates };
    return { ...this.playlists[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.playlists.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Playlist not found');
    }
    
    const deletedPlaylist = this.playlists.splice(index, 1)[0];
    return { ...deletedPlaylist };
  }

  async addTrack(playlistId, trackId) {
    await delay(300);
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const track = await trackService.getById(trackId);
    if (!track) {
      throw new Error('Track not found');
    }

    // Check if track already exists in playlist
    if (playlist.tracks.some(t => t.id === trackId)) {
      throw new Error('Track already in playlist');
    }

    playlist.tracks.push(track);
    return { ...playlist };
  }

  async removeTrack(playlistId, trackId) {
    await delay(250);
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const trackIndex = playlist.tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) {
      throw new Error('Track not found in playlist');
    }

    playlist.tracks.splice(trackIndex, 1);
    return { ...playlist };
  }

  async reorderTracks(playlistId, fromIndex, toIndex) {
    await delay(200);
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const tracks = [...playlist.tracks];
    const [movedTrack] = tracks.splice(fromIndex, 1);
    tracks.splice(toIndex, 0, movedTrack);
    
    playlist.tracks = tracks;
    return { ...playlist };
  }
}

export default new PlaylistService();