import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <ApperIcon name="Music" className="w-24 h-24 text-gray-400 mx-auto mb-6" />
        <h1 className="text-6xl font-heading font-bold text-gray-400 mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold mb-2">Page not found</h2>
        <p className="text-gray-400 max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-primary text-black px-8 py-3 rounded-full font-medium text-lg"
        >
          Go Home
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="block text-gray-400 hover:text-white transition-colors"
        >
          Go Back
        </motion.button>
      </div>
    </div>
  );
}