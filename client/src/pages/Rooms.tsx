
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchRooms, setRoomSearchTerm } from '@/store/slices/roomsSlice';

const Rooms = () => {
  const dispatch = useAppDispatch();
  const { rooms, loading, searchTerm } = useAppSelector(state => state.rooms);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRoomSearchTerm(e.target.value));
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
            Room Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Book study rooms, meeting spaces, and other campus facilities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search rooms, buildings, or amenities..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 h-12 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No rooms found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={room.images[0]} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{room.building} - Floor {room.floor}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{room.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Capacity: {room.capacity}</span>
                      {room.hourlyRate && (
                        <span className="text-emerald-600 font-semibold">${room.hourlyRate}/hr</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Rooms;
