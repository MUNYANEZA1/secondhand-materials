
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchProducts, setFilters } from '@/store/slices/productsSlice';
import ProductCard from '../ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const EnhancedProductGrid = () => {
  const dispatch = useAppDispatch();
  const { items, loading, filters, searchTerm } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ 
      search: searchTerm, 
      filters 
    }));
  }, [dispatch, searchTerm, filters]);

  const handleSortChange = (sortBy: string) => {
    dispatch(setFilters({ sortBy: sortBy as any }));
  };

  const filteredItems = items.filter(item => {
    // Category filter
    if (filters.category !== 'All' && item.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
      return false;
    }
    
    // Condition filter
    if (filters.condition.length > 0 && !filters.condition.includes(item.condition)) {
      return false;
    }
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.likes - a.likes;
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with filters and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {filters.category === 'All' ? 'All Products' : filters.category}
          </h2>
          <Badge variant="outline" className="text-sm">
            {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
          </Badge>
          {searchTerm && (
            <Badge variant="secondary" className="text-sm">
              "{searchTerm}"
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort dropdown */}
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggles */}
          <div className="hidden sm:flex items-center space-x-1 border rounded-lg p-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {(filters.category !== 'All' || filters.condition.length > 0 || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.category !== 'All' && (
            <Badge variant="secondary" className="text-xs">
              Category: {filters.category}
            </Badge>
          )}
          
          {filters.condition.map(condition => (
            <Badge key={condition} variant="secondary" className="text-xs">
              Condition: {condition}
            </Badge>
          ))}
          
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: {searchTerm}
            </Badge>
          )}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : sortedItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {sortedItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedProductGrid;
