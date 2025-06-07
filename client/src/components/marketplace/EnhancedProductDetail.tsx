
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Heart, Share2, Flag, MapPin, Calendar, 
  Eye, MessageCircle, Shield, Truck, CreditCard,
  ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/store/slices/productsSlice';

interface EnhancedProductDetailProps {
  product: Product;
  onContactSeller: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onReport?: () => void;
  onShare?: () => void;
}

const EnhancedProductDetail = ({
  product,
  onContactSeller,
  onAddToCart,
  onAddToWishlist,
  onReport,
  onShare
}: EnhancedProductDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {product.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              onClick={() => setShowImageModal(true)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            
            {product.isFree && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                FREE
              </Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-emerald-500' : 'border-gray-200'
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

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={onAddToWishlist}>
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={onShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={onReport}>
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-emerald-600">
                {product.isFree ? 'FREE' : `$${product.price}`}
              </span>
              <Badge className={getConditionColor(product.condition)}>
                {product.condition.toUpperCase()}
              </Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{product.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{product.likes} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{product.seller.name}</h3>
                    {product.seller.verified && (
                      <Shield className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.seller.reputation} rating
                    </span>
                  </div>
                </div>
                <Button variant="outline" onClick={onContactSeller}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              onClick={onAddToCart}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {product.isFree ? 'Request Item' : 'Add to Cart'}
            </Button>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Campus delivery available</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Buyer protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Item Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <span className="text-gray-600">Condition:</span>
              <p className="font-medium">{product.condition}</p>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <p className="font-medium">{product.location}</p>
            </div>
            <div>
              <span className="text-gray-600">Posted:</span>
              <p className="font-medium">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProductDetail;
