
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/uiSlice';
import AuthModal from '../modals/AuthModal';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { theme } = useAppSelector(state => state.ui);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(toggleTheme())}
          className="h-8 w-8"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-3">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/">Marketplace</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/services">Services</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/resources">Resources</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/events">Events</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/rooms">Room Booking</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/rides">Ride Board</Link>
              </Button>
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='relative'>
        <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      </div>
    </>
  );
};

export default MobileMenu;
