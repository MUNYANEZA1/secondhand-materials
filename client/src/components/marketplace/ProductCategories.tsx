
import { motion } from 'framer-motion';
import { 
  BookOpen, Laptop, Shirt, Home, Music, Bike, 
  Utensils, Camera, Gamepad2, Heart, 
  Car, Briefcase, Palette, Dumbbell 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCategory } from '@/store/slices/productsSlice';

const ProductCategories = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.products);

  const categories = [
    {
      id: 'All',
      name: 'All Items',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      count: 150,
      popular: true,
    },
    {
      id: 'Books',
      name: 'Books & Notes',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      count: 45,
      popular: true,
    },
    {
      id: 'Electronics',
      name: 'Electronics',
      icon: Laptop,
      color: 'from-emerald-500 to-green-500',
      count: 38,
      popular: true,
    },
    {
      id: 'Clothing',
      name: 'Clothing',
      icon: Shirt,
      color: 'from-orange-500 to-red-500',
      count: 28,
    },
    {
      id: 'Furniture',
      name: 'Furniture',
      icon: Home,
      color: 'from-amber-500 to-yellow-500',
      count: 22,
    },
    {
      id: 'Musical Instruments',
      name: 'Music',
      icon: Music,
      color: 'from-violet-500 to-purple-500',
      count: 15,
    },
    {
      id: 'Bikes/Scooters',
      name: 'Transportation',
      icon: Bike,
      color: 'from-green-500 to-emerald-500',
      count: 12,
    },
    {
      id: 'Food',
      name: 'Food & Snacks',
      icon: Utensils,
      color: 'from-pink-500 to-rose-500',
      count: 8,
    },
    {
      id: 'Photography',
      name: 'Photography',
      icon: Camera,
      color: 'from-slate-500 to-gray-500',
      count: 6,
    },
    {
      id: 'Gaming',
      name: 'Gaming',
      icon: Gamepad2,
      color: 'from-indigo-500 to-blue-500',
      count: 18,
    },
    {
      id: 'Automotive',
      name: 'Automotive',
      icon: Car,
      color: 'from-red-500 to-orange-500',
      count: 4,
    },
    {
      id: 'Business',
      name: 'Business',
      icon: Briefcase,
      color: 'from-gray-600 to-slate-600',
      count: 7,
    },
    {
      id: 'Art & Crafts',
      name: 'Art & Crafts',
      icon: Palette,
      color: 'from-teal-500 to-cyan-500',
      count: 9,
    },
    {
      id: 'Sports',
      name: 'Sports & Fitness',
      icon: Dumbbell,
      color: 'from-lime-500 to-green-500',
      count: 11,
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setCategory(categoryId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Browse Categories</h2>
        <Badge variant="outline" className="text-sm">
          {categories.reduce((sum, cat) => sum + cat.count, 0)} items
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = filters.category === category.id;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-emerald-500 shadow-lg' 
                    : 'hover:shadow-md border-muted'
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.count} items
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-1">
                    {category.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge className="text-xs bg-emerald-500">
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCategories;
