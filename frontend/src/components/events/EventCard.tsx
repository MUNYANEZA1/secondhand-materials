import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Star, Heart, Share2, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    organizer: {
      id: string;
      name: string;
      avatar?: string;
      verified: boolean;
    };
    price?: number;
    capacity?: number;
    attendees?: number;
    image?: string;
    isFree?: boolean;
    tags: string[];
    likes: number;
    views: number;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Academic': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Social': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Sports': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Arts': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'Career': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={event.image || 'https://via.placeholder.com/400'}
              alt={event.title}
              className="w-full h-40 sm:h-48 md:h-52 lg:h-48 xl:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay with quick actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Badge className="bg-white/90 text-gray-800 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    {event.views}
                  </Badge>
                  <Badge className="bg-white/90 text-gray-800 text-xs">
                    <Heart className="w-3 h-3 mr-1" />
                    {event.likes}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Top badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
              <Badge className={`text-xs font-semibold ${getCategoryColor(event.category)}`}>
                {event.category}
              </Badge>
              {event.isFree && (
                <Badge className="bg-emerald-500 text-white text-xs">
                  FREE
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1">
              {event.title}
            </h3>
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {event.isFree ? 'FREE' : `$${event.price}`}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>

          {/* Organizer info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0">
                <AvatarImage src={event.organizer.avatar} />
                <AvatarFallback className="text-xs">
                  {event.organizer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1 min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {event.organizer.name}
                </span>
                {event.organizer.verified && (
                  <Badge className="text-xs bg-emerald-500 text-white px-1 flex-shrink-0">
                    ✓
                  </Badge>
                )}
              </div>
            </div>
            
            <Badge variant="outline" className="text-xs flex-shrink-0">
              ⭐ 4.5
            </Badge>
          </div>

          {/* Location and time */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400 gap-1 sm:gap-0">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
            {event.capacity && (
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{event.attendees}/{event.capacity}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm">
              Attend Event
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-sm">
              Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EventCard;
