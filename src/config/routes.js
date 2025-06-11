import HomePage from '@/components/pages/HomePage';
import SearchPage from '@/components/pages/SearchPage';
import LibraryPage from '@/components/pages/LibraryPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
icon: 'Home',
    component: HomePage
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
icon: 'Search',
    component: SearchPage
  },
  library: {
    id: 'library',
    label: 'Your Library',
    path: '/library',
    icon: 'Library',
icon: 'Library',
    component: LibraryPage
  }
};

export const routeArray = Object.values(routes);