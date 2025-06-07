
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DesktopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/">Marketplace</Link>
      </Button>
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/services') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/services">Services</Link>
      </Button>
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/resources') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/resources">Resources</Link>
      </Button>
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/events') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/events">Events</Link>
      </Button>
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/rooms') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/rooms">Room Booking</Link>
      </Button>
      <Button 
        variant="ghost" 
        className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
          isActive('/rides') ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''
        }`}
        asChild
      >
        <Link to="/rides">Ride Board</Link>
      </Button>
    </nav>
  );
};

export default DesktopNav;
