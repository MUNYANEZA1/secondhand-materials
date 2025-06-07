
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Flag, 
  Settings, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';

const AdminPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const adminStats = [
    { label: 'Total Users', value: '2,547', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Active Listings', value: '1,234', icon: Package, color: 'from-green-500 to-green-600', change: '+8%' },
    { label: 'Flagged Items', value: '23', icon: Flag, color: 'from-red-500 to-red-600', change: '-5%' },
    { label: 'Revenue', value: '₹45,680', icon: DollarSign, color: 'from-yellow-500 to-yellow-600', change: '+15%' }
  ];

  const recentUsers = [
    { id: '1', name: 'John Doe', email: 'john@university.edu', role: 'student', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@vendor.com', role: 'vendor', status: 'pending', joinDate: '2024-01-14' },
    { id: '3', name: 'Mike Johnson', email: 'mike@university.edu', role: 'student', status: 'active', joinDate: '2024-01-13' }
  ];

  const flaggedListings = [
    { id: '1', title: 'Suspicious Electronics', seller: 'Unknown User', reason: 'Inappropriate content', severity: 'high' },
    { id: '2', title: 'Overpriced Books', seller: 'Book Seller', reason: 'Price manipulation', severity: 'medium' },
    { id: '3', title: 'Fake Designer Items', seller: 'Fashion Store', reason: 'Counterfeit goods', severity: 'high' }
  ];

  const handleApproveUser = (userId: string) => {
    console.log('Approving user:', userId);
  };

  const handleRejectUser = (userId: string) => {
    console.log('Rejecting user:', userId);
  };

  const handleResolveListing = (listingId: string) => {
    console.log('Resolving listing:', listingId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
              <p className="text-indigo-100">Manage users, listings, and platform analytics</p>
            </div>
            <Shield className="w-16 h-16 text-indigo-200" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Platform Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{user.role}</Badge>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApproveUser(user.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="listings" className="space-y-4">
                <div className="space-y-4">
                  {flaggedListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-red-900">{listing.title}</h3>
                        <p className="text-sm text-red-700">Seller: {listing.seller}</p>
                        <p className="text-sm text-red-600">Reason: {listing.reason}</p>
                        <Badge variant={listing.severity === 'high' ? 'destructive' : 'secondary'} className="mt-1">
                          {listing.severity} priority
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => handleResolveListing(listing.id)}>
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">+15%</span>
                        <span className="text-gray-600">this month</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Platform Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">₹45,680</span>
                        <span className="text-gray-600">total</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;
