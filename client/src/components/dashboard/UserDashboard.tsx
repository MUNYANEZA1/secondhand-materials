
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Settings,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/store/hooks';
import ChatModal from '@/components/marketplace/ChatModal';
import SellItemModal from '@/components/marketplace/SellItemModal';

const UserDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const userStats = [
    { label: 'Items Listed', value: '12', icon: Package, color: 'text-blue-500', change: '+2 this week' },
    { label: 'Items Sold', value: '8', icon: TrendingUp, color: 'text-green-500', change: '+1 this week' },
    { label: 'Favorites', value: '15', icon: Heart, color: 'text-red-500', change: '+3 new' },
    { label: 'Messages', value: '23', icon: MessageCircle, color: 'text-purple-500', change: '5 unread' }
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
    },
    {
      id: '3',
      title: 'Study Desk - IKEA',
      price: 45000,
      views: 28,
      favorites: 6,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
      category: 'Furniture',
      createdAt: '2024-01-12'
    }
  ];

  const favoriteItems = [
    {
      id: '1',
      title: 'Gaming Chair',
      price: 120000,
      seller: 'John Doe',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300',
      category: 'Furniture'
    },
    {
      id: '2',
      title: 'Calculus Textbook',
      price: 25000,
      seller: 'Marie K.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300',
      category: 'Books'
    }
  ];

  const messages = [
    {
      id: '1',
      contact: {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        reputation: 4.8,
        verified: true
      },
      lastMessage: 'Is the MacBook still available?',
      timestamp: '2 min ago',
      unread: true,
      item: 'MacBook Pro 13" M1'
    },
    {
      id: '2',
      contact: {
        id: 'user2',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        reputation: 4.6,
        verified: false
      },
      lastMessage: 'Thanks for the quick response!',
      timestamp: '1 hour ago',
      unread: false,
      item: 'Study Desk'
    }
  ];

  const recentActivity = [
    { type: 'sale', item: 'iPhone 12 Pro', amount: 750000, time: '2 hours ago', icon: TrendingUp },
    { type: 'message', item: 'MacBook Pro inquiry from Alex', time: '4 hours ago', icon: MessageCircle },
    { type: 'favorite', item: 'Study Desk added to favorites', time: '1 day ago', icon: Heart },
    { type: 'view', item: 'MacBook Pro viewed by 5 users', time: '2 days ago', icon: Eye }
  ];

  const handleOpenChat = (contact: any) => {
    setSelectedContact(contact);
    setShowChat(true);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-6 sm:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/30">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user.name}!
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  ⭐ {user.reputation}
                </Badge>
                {user.verified && (
                  <Badge className="bg-emerald-500 text-white border-emerald-400">
                    ✓ Verified
                  </Badge>
                )}
                <Badge variant="outline" className="border-white/30 text-white">
                  <Calendar className="w-3 h-3 mr-1" />
                  Member since Jan 2024
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              className="bg-white text-emerald-600 hover:bg-white/90 font-semibold"
              onClick={() => setShowSellModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              List New Item
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Enhanced Recent Activity */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === 'sale' ? 'bg-green-100 dark:bg-green-900/20' :
                        activity.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        activity.type === 'favorite' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-purple-100 dark:bg-purple-900/20'
                      }`}>
                        <activity.icon className={`w-4 h-4 ${
                          activity.type === 'sale' ? 'text-green-600' :
                          activity.type === 'message' ? 'text-blue-600' :
                          activity.type === 'favorite' ? 'text-red-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <Badge variant="outline" className="font-semibold">
                          {activity.amount.toLocaleString()} RWF
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm font-medium">Total Earnings</span>
                    <span className="text-lg font-bold text-emerald-600">1,250,000 RWF</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-lg font-bold text-blue-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-lg font-bold text-purple-600">2.5 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${
                        listing.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      {listing.status}
                    </Badge>
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                      {listing.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-bold text-emerald-600 mb-3">
                      {listing.price.toLocaleString()} RWF
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{listing.favorites}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-lg font-bold text-emerald-600 mb-2">
                      {item.price.toLocaleString()} RWF
                    </p>
                    <p className="text-sm text-gray-500 mb-3">by {item.seller}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">Contact Seller</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card 
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300 ${
                    message.unread ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleOpenChat(message.contact)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={message.contact.avatar} />
                          <AvatarFallback>{message.contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {message.unread && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {message.contact.name}
                            </h3>
                            {message.contact.verified && (
                              <Badge className="bg-emerald-500 text-white text-xs">✓</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              ⭐ {message.contact.reputation}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {message.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500">
                          About: {message.item}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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

export default UserDashboard;
