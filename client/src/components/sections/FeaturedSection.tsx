
import { motion } from 'framer-motion';
import { Star, Clock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const FeaturedSection = () => {
  const featuredItems = [
    {
      id: '1',
      title: 'MacBook Pro M2 - Perfect for CS Students',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
      category: 'Electronics',
      condition: 'Excellent',
      timeLeft: '2 days left',
      views: 234,
      trending: true
    },
    {
      id: '2',
      title: 'Complete Engineering Textbook Set',
      price: 150,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      category: 'Books',
      condition: 'Good',
      timeLeft: '5 days left',
      views: 89,
      trending: false
    },
    {
      id: '3',
      title: 'Dorm Furniture Bundle - Moving Sale',
      price: 200,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      category: 'Furniture',
      condition: 'Good',
      timeLeft: '1 day left',
      views: 156,
      trending: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
            <Star className="w-4 h-4 mr-2" />
            Featured Items
          </Badge>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Trending on Campus
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the most popular items among your fellow students
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.trending && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      🔥 Trending
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-xs flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {item.views}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-emerald-600">
                      ${item.price}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.timeLeft}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
