
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Edit, MapPin, Phone, Mail, Calendar, Star, Trophy, 
  Shield, Verified, Camera, Save, X, Badge as BadgeIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUserProfile } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    contactNumber: user?.contactNumber || '',
    socialMedia: user?.socialMedia || {},
  });

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      verified_student: 'bg-blue-500',
      trusted_seller: 'bg-green-500',
      top_seller: 'bg-yellow-500',
      early_adopter: 'bg-purple-500',
      verified_vendor: 'bg-emerald-500',
      premium_partner: 'bg-orange-500',
      admin: 'bg-red-500',
      platform_guardian: 'bg-gray-500',
      new_member: 'bg-slate-500',
    };
    return colors[badge] || 'bg-gray-500';
  };

  const formatBadgeName = (badge: string) => {
    return badge.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="overflow-hidden">
          {/* Cover Photo Placeholder */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
          
          <CardContent className="relative pt-0">
            {/* Profile Picture */}
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-3xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 bg-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.verified && (
                    <Verified className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{user.reputation}/5.0</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Trust Score: {user.trustScore}%</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      className={`${getBadgeColor(badge)} text-white hover:opacity-80`}
                    >
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {formatBadgeName(badge)}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="md:mb-4"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.bio && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Bio</h4>
                      <p className="text-sm">{user.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{user.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {user.contactNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{user.contactNumber}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Joined</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Role-specific information */}
                  {user.role === 'student' && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Student Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">University:</span>
                          <span className="ml-2">{user.university}</span>
                        </div>
                        {user.studentId && (
                          <div>
                            <span className="text-muted-foreground">Student ID:</span>
                            <span className="ml-2">{user.studentId}</span>
                          </div>
                        )}
                        {user.major && (
                          <div>
                            <span className="text-muted-foreground">Major:</span>
                            <span className="ml-2">{user.major}</span>
                          </div>
                        )}
                        {user.graduationYear && (
                          <div>
                            <span className="text-muted-foreground">Graduation:</span>
                            <span className="ml-2">{user.graduationYear}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {user.role === 'vendor' && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Business Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {user.businessName && (
                          <div>
                            <span className="text-muted-foreground">Business Name:</span>
                            <span className="ml-2">{user.businessName}</span>
                          </div>
                        )}
                        {user.businessType && (
                          <div>
                            <span className="text-muted-foreground">Business Type:</span>
                            <span className="ml-2 capitalize">{user.businessType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats & Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">{user.totalSales}</p>
                  <p className="text-xs text-muted-foreground">Items Sold</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{user.totalPurchases}</p>
                  <p className="text-xs text-muted-foreground">Items Bought</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{user.reputation}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{user.trustScore}%</p>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <Verified className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Verified</span>
                  {user.verificationLevel === 'full' ? (
                    <Verified className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Verified</span>
                  {user.contactNumber ? (
                    <Verified className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              
              {user.verificationLevel !== 'full' && (
                <Button size="sm" className="w-full mt-4">
                  Complete Verification
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
