
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Flag, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
    rating: number;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  reply?: {
    content: string;
    date: string;
  };
}

interface ReviewSystemProps {
  productId: string;
  reviews: Review[];
  canReview: boolean;
  onSubmitReview: (review: { rating: number; title: string; content: string }) => void;
}

const ReviewSystem = ({ productId, reviews, canReview, onSubmitReview }: ReviewSystemProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: ''
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.content.trim()) {
      onSubmitReview(newReview);
      setNewReview({ rating: 0, title: '', content: '' });
      setShowReviewForm(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setNewReview(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {canReview && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating))}
              <p className="text-gray-600 mt-2">{reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{dist.rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Write Your Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(newReview.rating, true, 'w-8 h-8')}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <Textarea
                  placeholder="Share details about your experience with this product"
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleSubmitReview} disabled={!newReview.rating || !newReview.content.trim()}>
                  Submit Review
                </Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{review.user.name}</h4>
                      {review.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <div className="flex items-center space-x-1">
                        {renderStars(review.user.rating, false, 'w-3 h-3')}
                        <span className="text-xs text-gray-500">({review.user.rating})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    
                    {review.title && (
                      <h5 className="font-medium mb-2">{review.title}</h5>
                    )}
                    
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        ({review.notHelpful})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                    
                    {review.reply && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <p className="text-sm font-medium mb-1">Seller Response</p>
                        <p className="text-gray-700 text-sm mb-1">{review.reply.content}</p>
                        <p className="text-xs text-gray-500">{review.reply.date}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
