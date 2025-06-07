
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, MapPin, Clock, Eye, Star, ShieldCheck, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product } from '@/store/slices/productsSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/productsSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onContactSeller?: (product: Product) => void;
}

const ProductDetailsModal = ({ isOpen, onClose, product, onContactSeller }: ProductDetailsModalProps) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector(state => state.products);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const isFavorited = favorites.includes(product.id);

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'new': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }
    dispatch(toggleFavorite(product.id));
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to contact sellers');
      return;
    }
    onContactSeller?.(product);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-4xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="relative bg-white dark:bg-gray-900">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 rounded-full z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {product.isFree && (
                      <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">
                        FREE
                      </Badge>
                    )}
                  </div>
                  
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index
                              ? 'border-emerald-500'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white pr-4">
                        {product.title}
                      </h1>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                          {product.isFree ? 'FREE' : `$${product.price}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.category}
                      </Badge>
                      <Badge variant="secondary" className={getConditionColor(product.condition)}>
                        {product.condition}
                      </Badge>
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {product.views} views
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {product.likes} likes
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Seller Information */}
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Seller Information</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={product.seller.avatar} />
                        <AvatarFallback>
                          {product.seller.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {product.seller.name}
                          </h4>
                          {product.seller.verified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.seller.reputation} rating
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.location}
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleFavoriteClick}
                        className={isFavorited ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
