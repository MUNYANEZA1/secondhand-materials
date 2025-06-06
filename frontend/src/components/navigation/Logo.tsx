
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">GL</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            GreenLoop
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Campus Exchange</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Logo;
