
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, Share2, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/productsSlice';
import { Product } from '@/store/slices/productsSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onContactSeller?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const ProductCard = ({ product, onContactSeller, onViewDetails }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector(state => state.products);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const isFavorited = favorites.includes(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }
    
    dispatch(toggleFavorite(product.id));
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleContactSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to contact sellers');
      return;
    }
    onContactSeller?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full h-full"
    >
      <Card 
        className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-green-500/20 dark:hover:shadow-green-400/20 h-full flex flex-col"
        onClick={handleViewDetails}
      >
        <div className="relative overflow-hidden rounded-t-lg h-40">
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Top badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className="bg-yellow-400 text-black text-xs">
              {product.category}
            </Badge>
            {product.isFree && (
              <Badge className="bg-green-500 text-white text-xs">
                FREE
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleFavoriteClick}
              className={`h-6 w-6 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/80 hover:bg-white text-gray-700'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
              className="h-6 w-6 rounded-full bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm"
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Overlay with quick info */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center space-x-1">
              <Badge className="bg-black/60 text-white text-xs backdrop-blur-sm">
                <Eye className="w-3 h-3 mr-1" />
                {product.views}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-1">
              {product.title}
            </h3>
            <div className="text-right ml-2">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {product.isFree ? 'FREE' : `$${product.price}`}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Seller info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Avatar className="h-4 w-4 flex-shrink-0">
                <AvatarImage src={product.seller.avatar} />
                <AvatarFallback className="text-xs">
                  {product.seller.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {product.seller.name}
              </span>
              {product.seller.verified && (
                <Badge className="text-xs bg-green-500 text-white px-1">
                  ✓
                </Badge>
              )}
            </div>
            
            <Badge variant="outline" className="text-xs">
              ⭐ {product.seller.reputation}
            </Badge>
          </div>

          {/* Location and time */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{product.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white text-xs py-1"
              onClick={handleContactSeller}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
