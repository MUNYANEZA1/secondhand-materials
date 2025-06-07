
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  MessageCircle, 
  Star, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Award,
  Settings,
  Bell,
  Calendar,
  DollarSign,
  BookOpen,
  Users,
  Zap,
  Target,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/store/hooks';
import Navigation from '@/components/Navigation';
import ChatModal from '@/components/marketplace/ChatModal';
import SellItemModal from '@/components/marketplace/SellItemModal';

const Dashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const userStats = [
    { 
      label: 'Items Listed', 
      value: '12', 
      icon: Package, 
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      change: '+2 this week' 
    },
    { 
      label: 'Items Sold', 
      value: '8', 
      icon: TrendingUp, 
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      change: '+1 this week' 
    },
    { 
      label: 'Favorites', 
      value: '15', 
      icon: Heart, 
      gradient: 'from-yellow-500 to-green-500',
      bgGradient: 'from-yellow-50 to-green-50',
      change: '+3 new' 
    },
    { 
      label: 'Messages', 
      value: '23', 
      icon: MessageCircle, 
      gradient: 'from-gray-800 to-black',
      bgGradient: 'from-gray-50 to-gray-100',
      change: '5 unread' 
    }
  ];

  const achievements = [
    { title: 'Top Seller', description: 'Sold 50+ items', icon: Crown, unlocked: true },
    { title: 'Quick Responder', description: 'Average response < 1hr', icon: Zap, unlocked: true },
    { title: 'Trusted Trader', description: '4.8+ rating maintained', icon: Star, unlocked: true },
    { title: 'Community Helper', description: 'Helped 100+ students', icon: Users, unlocked: false }
  ];

  const myListings = [
    {
      id: '1',
      title: 'MacBook Pro 13" M1',
      price: 850000,
      views: 45,
      favorites: 12,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
      category: 'Electronics',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'iPhone 12 Pro',
      price: 750000,
      views: 32,
      favorites: 8,
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      category: 'Electronics',
      createdAt: '2024-01-10'
    }
  ];

  const recentActivity = [
    { type: 'sale', item: 'iPhone 12 Pro', amount: 750000, time: '2 hours ago', icon: TrendingUp },
    { type: 'message', item: 'MacBook Pro inquiry from Alex', time: '4 hours ago', icon: MessageCircle },
    { type: 'favorite', item: 'Study Desk added to favorites', time: '1 day ago', icon: Heart }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-gray-900">
      <Navigation />
      
      <motion.div 
        className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Hero Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-green-500 to-black p-8 sm:p-12 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white/30 shadow-2xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl sm:text-4xl font-bold mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back, {user.name}!
                </motion.h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-yellow-500 text-black border-yellow-400 font-semibold">
                    ⭐ {user.reputation} Rating
                  </Badge>
                  {user.verified && (
                    <Badge className="bg-green-500 text-white border-green-400 font-semibold">
                      ✓ Verified Seller
                    </Badge>
                  )}
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since Jan 2024
                  </Badge>
                </div>
              </div>
            </div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg"
                onClick={() => setShowSellModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                List New Item
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {userStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <Badge 
                        variant={stat.change.startsWith('+') ? 'default' : 'destructive'} 
                        className="bg-white/80 text-gray-800 font-semibold"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-yellow-50 to-green-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <Award className="w-6 h-6 mr-3 text-yellow-500" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-2xl text-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-green-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs opacity-80">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-yellow-100 to-green-100 p-2 rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-green-500 data-[state=active]:text-white font-semibold rounded-xl"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="listings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-green-500 data-[state=active]:text-white font-semibold rounded-xl"
              >
                My Listings
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-green-500 data-[state=active]:text-white font-semibold rounded-xl"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white border-0 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Zap className="w-5 h-5 mr-3 text-yellow-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { icon: Plus, label: 'Sell Item', color: 'from-yellow-400 to-yellow-600' },
                          { icon: MessageCircle, label: 'Messages', color: 'from-green-400 to-green-600' },
                          { icon: Heart, label: 'Favorites', color: 'from-yellow-500 to-green-500' },
                          { icon: Settings, label: 'Settings', color: 'from-gray-600 to-gray-800' }
                        ].map((action, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              className={`h-20 w-full flex-col space-y-2 bg-gradient-to-r ${action.color} hover:opacity-90 border-0 shadow-lg`}
                            >
                              <action.icon className="w-6 h-6" />
                              <span className="text-sm font-semibold">{action.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Performance Overview */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-green-50 to-yellow-50 border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Target className="w-5 h-5 mr-3 text-green-600" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Total Earnings', value: '1,250,000 RWF', color: 'from-green-500 to-green-600' },
                        { label: 'Success Rate', value: '85%', color: 'from-yellow-500 to-yellow-600' },
                        { label: 'Response Time', value: '2.5 hrs', color: 'from-gray-600 to-gray-800' }
                      ].map((metric, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-2xl bg-gradient-to-r ${metric.color} text-white`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{metric.label}</span>
                            <span className="text-xl font-bold">{metric.value}</span>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="mt-8">
              <motion.div 
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                <AnimatePresence>
                  {myListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      variants={itemVariants}
                      whileHover={{ y: -8, rotateY: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      layout
                    >
                      <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="relative">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                          />
                          <Badge 
                            className={`absolute top-3 right-3 ${
                              listing.status === 'active' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-yellow-500 text-black'
                            } font-semibold`}
                          >
                            {listing.status}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 mb-3">
                            {listing.title}
                          </h3>
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                            {listing.price.toLocaleString()} RWF
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>{listing.views}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Heart className="w-4 h-4" />
                              <span>{listing.favorites}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-400 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            <TabsContent value="activity" className="mt-8">
              <Card className="bg-gradient-to-br from-gray-50 to-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-green-50 hover:from-yellow-100 hover:to-green-100 transition-all duration-300"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div 
                          className={`p-3 rounded-full ${
                            activity.type === 'sale' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            activity.type === 'message' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-gray-600 to-gray-800'
                          }`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <activity.icon className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{activity.item}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                        {activity.amount && (
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold">
                            {activity.amount.toLocaleString()} RWF
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Modals */}
      {showChat && selectedContact && (
        <ChatModal
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedContact(null);
          }}
          seller={selectedContact}
          itemTitle="Dashboard Chat"
        />
      )}

      <SellItemModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
      />
    </div>
  );
};

export default Dashboard;
