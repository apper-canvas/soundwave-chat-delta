import Home from '../pages/Home';
import Search from '../pages/Search';
import Library from '../pages/Library';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  library: {
    id: 'library',
    label: 'Your Library',
    path: '/library',
    icon: 'Library',
    component: Library
  }
};

export const routeArray = Object.values(routes);