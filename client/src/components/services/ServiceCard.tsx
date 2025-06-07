
import { motion } from 'framer-motion';
import { Star, MessageCircle, MapPin, Clock, Shield, Eye, Heart, Share2, Zap } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Service } from '@/store/slices/servicesSlice';
import { useState } from 'react';
import ChatModal from '@/components/marketplace/ChatModal';
import toast from 'react-hot-toast';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [showChat, setShowChat] = useState(false);

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'on-campus': return '🏫';
      case 'off-campus': return '🏠';
      case 'remote': return '💻';
      case 'flexible': return '📍';
      default: return '📍';
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'hourly': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'fixed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'negotiable': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Tutoring': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Tech Support': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Creative Services': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'Writing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Language': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

  const handleContact = () => {
    setShowChat(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.title,
        text: service.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full"
      >
        <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-400/20 h-full flex flex-col overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden">
              <div className="h-48 sm:h-56 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative">
                {service.images && service.images[0] ? (
                  <img 
                    src={service.images[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    <Zap className="w-16 h-16" />
                  </div>
                )}
                
                {/* Overlay with enhanced effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-white/90 text-gray-800 text-xs backdrop-blur-sm">
                        <Eye className="w-3 h-3 mr-1" />
                        {service.views}
                      </Badge>
                      <Badge className="bg-white/90 text-gray-800 text-xs backdrop-blur-sm">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {service.contactCount}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleShare}
                      className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Top badges with animations */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge className={`text-xs font-semibold ${getCategoryColor(service.category)} backdrop-blur-sm`}>
                      {service.category}
                    </Badge>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className={`text-xs ${getServiceTypeColor(service.serviceType)} backdrop-blur-sm`}>
                      {service.serviceType}
                    </Badge>
                  </motion.div>
                </div>

                {/* Floating action button */}
                <div className="absolute top-3 right-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 rounded-full bg-white/20 hover:bg-red-500 text-white backdrop-blur-sm transition-all duration-300"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-1 pr-2 leading-tight">
                {service.title}
              </h3>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ${service.price}
                  {service.serviceType === 'hourly' && <span className="text-sm font-normal text-gray-500">/hr</span>}
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
              {service.description}
            </p>

            {/* Enhanced Provider info */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-green-200">
                  <AvatarImage src={service.provider.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">
                    {service.provider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {service.provider.name}
                    </span>
                    {service.provider.verified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(service.provider.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {service.provider.rating} ({service.provider.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Service details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium">{getLocationIcon(service.location)} {service.location.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{service.availability}</span>
              </div>
            </div>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {service.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs hover:bg-green-50 hover:text-green-700 transition-colors">
                  #{tag}
                </Badge>
              ))}
              {service.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{service.tags.length - 4} more
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 sm:p-6 pt-0 mt-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleContact}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Provider
              </Button>
              <Button 
                variant="outline" 
                className="sm:w-auto hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 hover:border-green-300 text-green-700 dark:text-green-400 font-medium"
              >
                View Details
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          seller={{
            id: service.provider.id,
            name: service.provider.name,
            avatar: service.provider.avatar || '',
            reputation: service.provider.rating,
            verified: service.provider.verified
          }}
          itemTitle={service.title}
        />
      )}
    </>
  );
};

export default ServiceCard;
