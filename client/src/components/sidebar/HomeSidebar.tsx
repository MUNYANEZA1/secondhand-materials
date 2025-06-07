
import { motion } from 'framer-motion';
import { 
  Home, Calendar, Users, BookOpen, Car, MapPin, 
  GraduationCap, Wrench, Filter, X, ChevronRight,
  Store, Coffee, Laptop, Shirt, Music, Bike
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

interface HomeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryFilter: (category: string) => void;
  selectedCategory: string;
}

const quickNavItems = [
  { name: 'Events', icon: Calendar, path: '/events', color: 'text-yellow-600', count: 12 },
  { name: 'Study Groups', icon: Users, path: '/study-groups', color: 'text-green-600', count: 8 },
  { name: 'Tutoring', icon: GraduationCap, path: '/tutoring', color: 'text-yellow-600', count: 15 },
  { name: 'Services', icon: Wrench, path: '/services', color: 'text-green-600', count: 6 },
  { name: 'Rides', icon: Car, path: '/rides', color: 'text-yellow-600', count: 4 },
  { name: 'Rooms', icon: MapPin, path: '/rooms', color: 'text-green-600', count: 7 },
  { name: 'Resources', icon: BookOpen, path: '/resources', color: 'text-yellow-600', count: 23 }
];

const categories = [
  { name: 'All', icon: Store, count: 150, color: 'from-gray-500 to-gray-700' },
  { name: 'Books', icon: BookOpen, count: 45, color: 'from-green-500 to-green-700' },
  { name: 'Electronics', icon: Laptop, count: 32, color: 'from-yellow-500 to-yellow-700' },
  { name: 'Clothing', icon: Shirt, count: 28, color: 'from-green-600 to-yellow-500' },
  { name: 'Furniture', icon: Coffee, count: 25, color: 'from-yellow-600 to-green-600' },
  { name: 'Musical Instruments', icon: Music, count: 12, color: 'from-green-500 to-yellow-500' },
  { name: 'Bikes/Scooters', icon: Bike, count: 8, color: 'from-yellow-500 to-green-600' }
];

const HomeSidebar = ({ isOpen, onClose, onCategoryFilter, selectedCategory }: HomeSidebarProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto lg:relative lg:translate-x-0 lg:shadow-lg"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-green-600 to-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Campus Hub</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Navigation */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                <Home className="w-5 h-5 mr-2 text-green-600" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 dark:hover:from-gray-800 dark:hover:to-gray-700 group transition-all duration-200"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="flex items-center">
                      <item.icon className={`w-4 h-4 mr-3 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        {item.count}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Category Filters */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-yellow-600" />
                Filter by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className={`w-full justify-between p-3 h-auto transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 dark:hover:from-gray-800 dark:hover:to-gray-700'
                    }`}
                    onClick={() => onCategoryFilter(category.name)}
                  >
                    <div className="flex items-center">
                      <category.icon className={`w-4 h-4 mr-3 ${
                        selectedCategory === category.name ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        selectedCategory === category.name 
                          ? 'text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        selectedCategory === category.name
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-xl border border-green-200/50 dark:border-green-700/50"
          >
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Today's Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">New Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">156</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default HomeSidebar;
