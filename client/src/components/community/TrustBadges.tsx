
import { motion } from 'framer-motion';
import { Shield, Star, Award, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrustScore {
  overall: number;
  breakdown: {
    verification: number;
    sales: number;
    reviews: number;
    responseTime: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  progress?: number;
  color: string;
}

interface TrustBadgesProps {
  trustScore: TrustScore;
  achievements: Achievement[];
  verified: boolean;
  memberSince: string;
  totalSales: number;
  rating: number;
  responseTime: string;
}

const TrustBadges = ({ 
  trustScore, 
  achievements, 
  verified, 
  memberSince, 
  totalSales, 
  rating, 
  responseTime 
}: TrustBadgesProps) => {
  
  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: 'Platinum', color: 'from-purple-500 to-purple-600' };
    if (score >= 80) return { level: 'Gold', color: 'from-yellow-500 to-yellow-600' };
    if (score >= 70) return { level: 'Silver', color: 'from-gray-400 to-gray-500' };
    if (score >= 60) return { level: 'Bronze', color: 'from-orange-400 to-orange-500' };
    return { level: 'New', color: 'from-gray-300 to-gray-400' };
  };

  const trustLevel = getTrustLevel(trustScore.overall);

  const earnedAchievements = achievements.filter(a => a.earned);
  const availableAchievements = achievements.filter(a => !a.earned);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Trust Score Overview */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Trust Score</h3>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${trustLevel.color} text-white text-sm font-semibold`}>
                  {trustLevel.level}
                </div>
                <div className="text-2xl font-bold">{trustScore.overall}%</div>
              </div>
            </div>

            {/* Trust Score Breakdown */}
            <div className="space-y-3">
              {[
                { label: 'Identity Verification', value: trustScore.breakdown.verification, icon: Shield },
                { label: 'Sales History', value: trustScore.breakdown.sales, icon: TrendingUp },
                { label: 'Customer Reviews', value: trustScore.breakdown.reviews, icon: Star },
                { label: 'Response Time', value: trustScore.breakdown.responseTime, icon: Clock }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="flex items-center justify-center mb-2">
              {verified ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Shield className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600">Verification</p>
            <p className="font-semibold">{verified ? 'Verified' : 'Pending'}</p>
          </Card>

          <Card className="text-center p-4">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="font-semibold">{memberSince}</p>
          </Card>

          <Card className="text-center p-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="font-semibold">{totalSales}</p>
          </Card>

          <Card className="text-center p-4">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="font-semibold">{rating}/5</p>
          </Card>
        </div>

        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {earnedAchievements.map((achievement) => (
                  <Tooltip key={achievement.id}>
                    <TooltipTrigger>
                      <motion.div
                        className={`p-4 rounded-lg bg-gradient-to-r ${achievement.color} text-white text-center cursor-help`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <achievement.icon className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{achievement.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Achievements (Progress) */}
        {availableAchievements.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Progress to Next Achievements</h3>
              <div className="space-y-4">
                {availableAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <achievement.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <span className="text-sm text-gray-600">
                          {achievement.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trust Verification */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Trust & Safety</h3>
                <p className="text-sm text-gray-600">
                  This seller has been verified through our trust and safety program
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default TrustBadges;
