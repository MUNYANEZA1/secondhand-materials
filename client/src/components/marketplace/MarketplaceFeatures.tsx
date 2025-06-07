
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Shield, 
  Zap, 
  Users, 
  MessageCircle, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MarketplaceFeatures = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      title: 'Verified Sellers',
      description: 'All sellers are verified INES students and staff',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Transparent reviews and ratings for every transaction',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: MessageCircle,
      title: 'Instant Chat',
      description: 'Direct messaging with sellers for quick negotiations',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Zap,
      title: 'Quick Deals',
      description: 'Fast and secure transactions within the campus',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const stats = [
    { value: '500+', label: 'Active Users', icon: Users },
    { value: '1,200+', label: 'Items Sold', icon: TrendingUp },
    { value: '4.8/5', label: 'Avg Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Clock }
  ];

  const achievements = [
    { title: 'First Sale', description: 'Complete your first transaction', earned: true },
    { title: 'Top Seller', description: 'Reach 50+ successful sales', earned: false },
    { title: 'Trusted Member', description: 'Maintain 4.5+ rating for 6 months', earned: true },
    { title: 'Community Helper', description: 'Help 100+ students find what they need', earned: false }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setHoveredFeature(index)}
            onHoverEnd={() => setHoveredFeature(null)}
          >
            <Card className={`transition-all duration-300 ${
              hoveredFeature === index ? 'shadow-lg scale-105' : 'shadow-sm'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  achievement.earned ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <Badge className="bg-green-500 text-white">
                    Earned
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-emerald-100 mb-6">
            Join thousands of INES students buying and selling safely on campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Browse Items
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Start Selling
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceFeatures;
