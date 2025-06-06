
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchTerm } from '@/store/slices/productsSlice';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector(state => state.products);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    // Real-time search with debouncing
    dispatch(setSearchTerm(value));
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
  };

  const suggestedSearches = [
    'MacBook', 'Textbooks', 'Furniture', 'Electronics', 'Free items'
  ];

  const trendingSearches = [
    'iPhone 14', 'Study Notes', 'Dorm Furniture', 'Winter Clothing'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto relative"
    >
      {/* Main Search Container */}
      <Card className="p-2 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            
            <Input
              type="text"
              placeholder="Search for books, electronics, furniture, or anything you need..."
              value={localSearchTerm}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-12 pr-12 py-6 text-lg border-0 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-transparent placeholder:text-gray-500 font-medium"
            />
            
            {localSearchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <Button 
            type="submit"
            size="lg"
            className="px-8 py-6 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </form>
      </Card>

      {/* Enhanced Suggestions Dropdown */}
      <AnimatePresence>
        {(isFocused || !localSearchTerm) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="p-6 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Suggestions */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg mr-3">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      AI Suggestions
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {suggestedSearches.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 hover:shadow-md"
                          onClick={() => {
                            setLocalSearchTerm(suggestion);
                            dispatch(setSearchTerm(suggestion));
                          }}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-green-500 rounded-lg mr-3">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Trending Now
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((trend, index) => (
                      <motion.div
                        key={trend}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 * index }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-600 transition-all duration-200 hover:shadow-md"
                          onClick={() => {
                            setLocalSearchTerm(trend);
                            dispatch(setSearchTerm(trend));
                          }}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {trend}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Over 150+ items available
                  </span>
                  <span>Updated 2 minutes ago</span>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
