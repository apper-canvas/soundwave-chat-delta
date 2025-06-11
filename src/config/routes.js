import HomePage from '@/components/pages/HomePage';
import SearchPage from '@/components/pages/SearchPage';
import LibraryPage from '@/components/pages/LibraryPage';
import ArtistPage from '@/components/pages/ArtistPage';
import AlbumPage from '@/components/pages/AlbumPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: SearchPage
  },
  library: {
    id: 'library',
    label: 'Your Library',
    path: '/library',
    icon: 'Library',
    component: LibraryPage
  },
  artist: {
    id: 'artist',
    label: 'Artist',
    path: '/artist/:id',
    component: ArtistPage,
    hidden: true
  },
  album: {
    id: 'album',
    label: 'Album',
    path: '/album/:id',
    component: AlbumPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);