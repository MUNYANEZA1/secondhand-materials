
import { motion } from 'framer-motion';
import Logo from './navigation/Logo';
import DesktopNav from './navigation/DesktopNav';
import UserActions from './navigation/UserActions';
import MobileMenu from './navigation/MobileMenu';

const Navigation = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <DesktopNav />
            <UserActions />
          </div>

          <MobileMenu />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
