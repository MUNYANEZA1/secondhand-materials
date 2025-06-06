
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  GraduationCap, Wrench, Camera, Palette, Car, Home, 
  Monitor, MessageSquare, Filter, X, Star
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setServiceCategory, setServiceFilters, clearServiceFilters } from '@/store/slices/servicesSlice';

const serviceCategories = [
  { name: "All", icon: Filter, count: 45 },
  { name: "Tutoring", icon: GraduationCap, count: 18 },
  { name: "Tech Support", icon: Monitor, count: 12 },
  { name: "Creative Services", icon: Camera, count: 8 },
  { name: "Design", icon: Palette, count: 6 },
  { name: "Transportation", icon: Car, count: 4 },
  { name: "Personal Services", icon: Home, count: 9 },
  { name: "Repair & Maintenance", icon: Wrench, count: 5 },
  { name: "Writing & Translation", icon: MessageSquare, count: 7 }
];

const ServiceFilters = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.services);

  const handleCategoryChange = (category: string) => {
    dispatch(setServiceCategory(category));
  };

  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      dispatch(setServiceFilters({ priceRange: [value[0], value[1]] as [number, number] }));
    }
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setServiceFilters({ rating }));
  };

  const handleClearFilters = () => {
    dispatch(clearServiceFilters());
  };

  const hasActiveFilters = filters.category !== 'All' || 
                          filters.priceRange[0] > 0 || 
                          filters.priceRange[1] < 100 ||
                          filters.rating > 0;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-t-lg p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Service Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-white hover:bg-white/10 text-xs"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Service Categories */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-green-600 text-white rounded-t-lg p-4">
          <CardTitle className="text-lg">Service Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {serviceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.name}
                variant={filters.category === category.name ? "default" : "ghost"}
                className={`w-full justify-start text-left ${
                  filters.category === category.name 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "hover:bg-yellow-50 dark:hover:bg-gray-800 hover:text-green-600"
                }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                <IconComponent className="w-4 h-4 mr-3" />
                <span className="flex-1">{category.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 ${
                    filters.category === category.name 
                      ? 'bg-white/20 text-white' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-yellow-400 text-white rounded-t-lg p-4">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">${filters.priceRange[0]}</span>
              <span className="font-semibold">${filters.priceRange[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Rating */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-green-500 text-white rounded-t-lg p-4">
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between">
            {[0, 3, 4, 4.5].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingChange(rating)}
                className={filters.rating === rating ? "bg-yellow-500 text-black" : ""}
              >
                {rating === 0 ? 'Any' : (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {rating}+
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceFilters;
