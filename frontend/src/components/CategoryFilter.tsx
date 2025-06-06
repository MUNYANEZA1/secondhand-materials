
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Book, Monitor, Utensils, Armchair, Shirt, Dumbbell, Grid3X3,
  Music, Bike, Smartphone, Wrench, Printer, Calendar, Users,
  ChevronDown, ChevronUp, Filter, X
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCategory, setPriceRange, setCondition, clearFilters } from '@/store/slices/productsSlice';
import { useState } from 'react';

const studentCategories = [
  { name: "All", icon: Grid3X3, count: 150 },
  { name: "Books", icon: Book, count: 45 },
  { name: "Electronics", icon: Monitor, count: 32 },
  { name: "Personal Tech", icon: Smartphone, count: 28 },
  { name: "Furniture", icon: Armchair, count: 25 },
  { name: "Clothing", icon: Shirt, count: 18 },
  { name: "Musical Instruments", icon: Music, count: 12 },
  { name: "Gym Equipment", icon: Dumbbell, count: 15 },
  { name: "Bikes/Scooters", icon: Bike, count: 8 },
  { name: "Kitchenware", icon: Utensils, count: 22 }
];

const universityCategories = [
  { name: "Lab Equipment", icon: Wrench, count: 15 },
  { name: "Office Furniture", icon: Armchair, count: 12 },
  { name: "Archived Electronics", icon: Printer, count: 8 }
];

const conditions = [
  { value: "excellent", label: "Excellent", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-yellow-100 text-yellow-800" },
  { value: "fair", label: "Fair", color: "bg-orange-100 text-orange-800" },
  { value: "poor", label: "Poor", color: "bg-red-100 text-red-800" }
];

const CategoryFilter = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.products);
  const [showUniversityItems, setShowUniversityItems] = useState(false);
  const [isConditionExpanded, setIsConditionExpanded] = useState(true);

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category));
  };

  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      dispatch(setPriceRange([value[0], value[1]] as [number, number]));
    }
  };

  const handleConditionToggle = (condition: string) => {
    const currentConditions = filters.condition || [];
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    dispatch(setCondition(newConditions));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setShowUniversityItems(false);
  };

  const hasActiveFilters = filters.category !== 'All' || 
                          filters.priceRange[0] > 0 || 
                          filters.priceRange[1] < 1000 ||
                          (filters.condition && filters.condition.length > 0);

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white rounded-t-lg p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-white hover:bg-white/10 text-xs"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Student Categories */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-t-lg p-4">
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Student Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {studentCategories.map((category) => {
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

      {/* University Surplus Toggle */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-black to-green-600 text-white rounded-t-lg p-4">
          <CardTitle 
            className="text-lg cursor-pointer flex items-center justify-between"
            onClick={() => setShowUniversityItems(!showUniversityItems)}
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              University Surplus
            </div>
            {showUniversityItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        {showUniversityItems && (
          <CardContent className="space-y-2 p-4">
            {universityCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={filters.category === category.name ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    filters.category === category.name 
                      ? "bg-black text-white hover:bg-gray-800" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black"
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
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </CardContent>
        )}
      </Card>

      {/* Price Range */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-green-500 text-black rounded-t-lg p-4">
          <CardTitle className="text-lg font-bold">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">${filters.priceRange[0]}</span>
              <span className="font-semibold">${filters.priceRange[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Filter */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader 
          className="bg-gradient-to-r from-green-600 to-black text-white rounded-t-lg p-4 cursor-pointer"
          onClick={() => setIsConditionExpanded(!isConditionExpanded)}
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Condition</span>
            {isConditionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        {isConditionExpanded && (
          <CardContent className="space-y-2 p-4">
            {conditions.map((condition) => (
              <label 
                key={condition.value} 
                className="flex items-center space-x-3 cursor-pointer hover:bg-yellow-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={filters.condition?.includes(condition.value) || false}
                  onChange={() => handleConditionToggle(condition.value)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
                />
                <Badge className={condition.color}>
                  {condition.label}
                </Badge>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-t-lg p-4">
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          <Button variant="outline" className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50">
            Recently Added
          </Button>
          <Button variant="outline" className="w-full justify-start border-yellow-200 text-yellow-600 hover:bg-yellow-50">
            Price: Low to High
          </Button>
          <Button variant="outline" className="w-full justify-start border-black text-black hover:bg-gray-50">
            Most Popular
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryFilter;
