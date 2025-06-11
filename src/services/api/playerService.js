import trackService from './trackService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.currentState = {
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      volume: 75,
      queue: [],
      currentIndex: 0,
      shuffle: false,
      repeat: 'off' // 'off', 'all', 'one'
    };
  }

  async getCurrentState() {
    await delay(100);
    return { ...this.currentState };
  }

  async playTrack(track) {
    await delay(200);
    
    this.currentState = {
      ...this.currentState,
      currentTrack: { ...track },
      isPlaying: true,
      progress: 0
    };
    
    return { ...this.currentState };
  }

  async playPlaylist(tracks, startIndex = 0) {
    await delay(250);
    
    if (!tracks.length) {
      throw new Error('No tracks to play');
    }

    this.currentState = {
      ...this.currentState,
      queue: [...tracks],
      currentIndex: startIndex,
      currentTrack: { ...tracks[startIndex] },
      isPlaying: true,
      progress: 0
    };
    
    return { ...this.currentState };
  }

  async togglePlayPause() {
    await delay(150);
    
    this.currentState = {
      ...this.currentState,
      isPlaying: !this.currentState.isPlaying
    };
    
    return { ...this.currentState };
  }

  async nextTrack() {
    await delay(200);
    
    if (!this.currentState.queue.length) {
      // If no queue, try to get recommended tracks
      const recommended = await trackService.getRecommended();
      this.currentState.queue = recommended;
      this.currentState.currentIndex = 0;
    } else {
      this.currentState.currentIndex = 
        (this.currentState.currentIndex + 1) % this.currentState.queue.length;
    }
    
    this.currentState.currentTrack = { ...this.currentState.queue[this.currentState.currentIndex] };
    this.currentState.progress = 0;
    
    return { ...this.currentState };
  }

  async previousTrack() {
    await delay(200);
    
    if (!this.currentState.queue.length) return { ...this.currentState };
    
    this.currentState.currentIndex = 
      this.currentState.currentIndex === 0 
        ? this.currentState.queue.length - 1 
        : this.currentState.currentIndex - 1;
    
    this.currentState.currentTrack = { ...this.currentState.queue[this.currentState.currentIndex] };
    this.currentState.progress = 0;
    
    return { ...this.currentState };
  }

  async seekTo(progress) {
    await delay(100);
    
    this.currentState = {
      ...this.currentState,
      progress: Math.max(0, Math.min(progress, this.currentState.currentTrack?.duration || 0))
    };
    
    return { ...this.currentState };
  }

  async setVolume(volume) {
    await delay(100);
    
    this.currentState = {
      ...this.currentState,
      volume: Math.max(0, Math.min(100, volume))
    };
    
    return { ...this.currentState };
  }

  async toggleShuffle() {
    await delay(150);
    
    this.currentState = {
      ...this.currentState,
      shuffle: !this.currentState.shuffle
    };
    
    return { ...this.currentState };
  }

  async setRepeat(mode) {
    await delay(100);
    
    this.currentState = {
      ...this.currentState,
      repeat: mode
    };
    
    return { ...this.currentState };
  }

  async addToQueue(track) {
    await delay(150);
    
    this.currentState = {
      ...this.currentState,
      queue: [...this.currentState.queue, { ...track }]
    };
    
    return { ...this.currentState };
  }

  async removeFromQueue(index) {
    await delay(150);
    
    if (index < 0 || index >= this.currentState.queue.length) {
      throw new Error('Invalid queue index');
    }

    const newQueue = [...this.currentState.queue];
    newQueue.splice(index, 1);
    
    // Adjust current index if needed
    if (index < this.currentState.currentIndex) {
      this.currentState.currentIndex -= 1;
    } else if (index === this.currentState.currentIndex && newQueue.length > 0) {
      // If we removed the current track, update to next track
      this.currentState.currentIndex = 
        this.currentState.currentIndex >= newQueue.length 
          ? 0 
          : this.currentState.currentIndex;
      this.currentState.currentTrack = { ...newQueue[this.currentState.currentIndex] };
      this.currentState.progress = 0;
    }
    
    this.currentState.queue = newQueue;
    
    return { ...this.currentState };
  }
}

export default new PlayerService();