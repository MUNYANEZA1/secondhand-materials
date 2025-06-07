
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, Star, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event } from '@/store/slices/eventsSlice';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const EventDetailsModal = ({ isOpen, onClose, event }: EventDetailsModalProps) => {
  if (!isOpen) return null;

  const availableTickets = event.ticketInfo.capacity - event.ticketInfo.registered;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="p-0">
            <div className="relative">
              <img 
                src={event.coverImage} 
                alt={event.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500 text-white">
                    {event.category}
                  </Badge>
                  <Badge className="bg-green-500 text-white">
                    {event.status}
                  </Badge>
                  {event.ticketInfo.type === 'free' && (
                    <Badge className="bg-yellow-500 text-black">FREE</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Event Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Organizer</h3>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={event.organizer.avatar} />
                      <AvatarFallback>
                        {event.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.organizer.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {event.organizer.type}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticket Information */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Ticket Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-semibold capitalize">{event.ticketInfo.type}</span>
                    </div>
                    {event.ticketInfo.type === 'paid' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price:</span>
                        <span className="font-semibold">${event.ticketInfo.price}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Available:</span>
                      <span className="font-semibold">{availableTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Registered:</span>
                      <span className="font-semibold">{event.ticketInfo.registered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Capacity:</span>
                      <span className="font-semibold">{event.ticketInfo.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max per person:</span>
                      <span className="font-semibold">{event.ticketInfo.maxPerUser}</span>
                    </div>
                  </div>
                </Card>

                {/* Event Details */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-semibold">{event.time}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-semibold">{event.location}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Venue</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    Register for Event
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EventDetailsModal;
