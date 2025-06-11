import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import NowPlaying from './pages/NowPlaying';
import NotFound from './pages/NotFound';
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
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="*" element={<NotFound />} />
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