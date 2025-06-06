
import { motion } from 'framer-motion';
import { X, Heart, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockWishlistItems = [
  {
    id: '1',
    title: 'MacBook Pro 2021',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200',
    condition: 'Excellent',
    seller: 'John Doe'
  },
  {
    id: '2',
    title: 'Calculus Textbook',
    price: 45,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200',
    condition: 'Good',
    seller: 'Sarah Smith'
  }
];

const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-green-500 text-black">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">My Wishlist</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-black hover:bg-black/10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-green-600">${item.price}</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{item.condition}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Seller: {item.seller}</p>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {mockWishlistItems.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Start browsing and save items you're interested in!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WishlistModal;
