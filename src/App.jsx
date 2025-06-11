import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import HomePage from '@/components/pages/HomePage';
import SearchPage from '@/components/pages/SearchPage';
import LibraryPage from '@/components/pages/LibraryPage';
import PlaylistPage from '@/components/pages/PlaylistPage';
import NowPlayingPage from '@/components/pages/NowPlayingPage';
import NotFoundPage from '@/components/pages/NotFoundPage';
import { routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
<Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map(route => (
              <Route 
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
            {/* Additional specific routes - ensure all dynamic routes are covered */}
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/now-playing" element={<NowPlayingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-surface text-white border border-gray-600"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;