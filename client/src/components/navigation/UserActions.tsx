
import { useState } from 'react';
import { User, Settings, LogOut, Plus, Heart, Bell, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Link } from 'react-router-dom';
import EnhancedAuthModal from '../modals/EnhancedAuthModal';

const UserActions = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getRoleColor = (role: string) => {
    const colors = {
      student: 'from-blue-500 to-purple-500',
      vendor: 'from-emerald-500 to-green-500',
      admin: 'from-red-500 to-pink-500',
      university: 'from-orange-500 to-yellow-500',
    };
    return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowAuthModal(true)}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Log In
          </Button>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => setShowAuthModal(true)}
          >
            Sign Up
          </Button>
        </div>

        <EnhancedAuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Dashboard Button - More Prominent */}
      <Button
        asChild
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hidden sm:flex"
      >
        <Link to="/dashboard">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Link>
      </Button>

      {/* Mobile Dashboard Button */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="sm:hidden bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
      >
        <Link to="/dashboard">
          <LayoutDashboard className="w-5 h-5" />
        </Link>
      </Button>

      {/* Quick Actions */}
      <div className="hidden sm:flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500">
            3
          </Badge>
        </Button>
        
        <Button variant="ghost" size="sm">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-emerald-200 hover:border-emerald-300">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className={`bg-gradient-to-r ${getRoleColor(user?.role || '')} text-white font-semibold`}>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-3 p-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className={`bg-gradient-to-r ${getRoleColor(user?.role || '')} text-white font-semibold text-lg`}>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user?.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatRole(user?.role || '')}
                    </Badge>
                    {user?.verified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs font-semibold">{user?.reputation}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs font-semibold">{user?.totalSales}</p>
                  <p className="text-xs text-muted-foreground">Sales</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <p className="text-xs font-semibold">{user?.trustScore}%</p>
                  <p className="text-xs text-muted-foreground">Trust</p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Mobile Dashboard Link */}
          <DropdownMenuItem asChild className="sm:hidden">
            <Link to="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Heart className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>Sell Item</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <Badge className="ml-auto bg-red-500 text-white">3</Badge>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActions;
