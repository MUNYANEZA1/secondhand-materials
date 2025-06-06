
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Eye,
  Filter,
  Download,
  Settings,
  Bell,
  Shield,
  Activity,
  Mail,
  Ban,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7days');

  const adminStats = [
    { label: 'Total Users', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Active Listings', value: '2,847', change: '+8%', icon: Package, color: 'text-green-500' },
    { label: 'Total Revenue', value: '45.2M', change: '+23%', icon: DollarSign, color: 'text-yellow-500' },
    { label: 'Transactions', value: '892', change: '+15%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Reported Items', value: '12', change: '-5%', icon: AlertTriangle, color: 'text-red-500' },
    { label: 'New Services', value: '156', change: '+31%', icon: Activity, color: 'text-indigo-500' }
  ];

  const recentUsers = [
    {
      id: '1',
      name: 'Jean Claude Uwimana',
      email: 'jean.claude@student.ur.ac.rw',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      joinDate: '2024-01-15',
      verified: true,
      listings: 5,
      reputation: 4.8
    },
    {
      id: '2',
      name: 'Marie Gasana',
      email: 'marie.gasana@student.ur.ac.rw',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      status: 'active',
      joinDate: '2024-01-14',
      verified: true,
      listings: 3,
      reputation: 4.9
    },
    {
      id: '3',
      name: 'David Nshuti',
      email: 'david.nshuti@student.ur.ac.rw',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      status: 'pending',
      joinDate: '2024-01-13',
      verified: false,
      listings: 1,
      reputation: 4.2
    }
  ];

  const recentListings = [
    {
      id: '1',
      title: 'MacBook Pro 13" M1',
      seller: 'Jean Claude',
      category: 'Electronics',
      price: 850000,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
      createdAt: '2024-01-15',
      views: 45,
      reports: 0
    },
    {
      id: '2',
      title: 'Calculus Textbook',
      seller: 'Marie Gasana',
      category: 'Books',
      price: 25000,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300',
      createdAt: '2024-01-14',
      views: 23,
      reports: 1
    }
  ];

  const reportedItems = [
    {
      id: '1',
      title: 'Suspicious Electronics Deal',
      reporter: 'Anonymous User',
      reason: 'Fake product',
      status: 'under_review',
      priority: 'high',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Inappropriate Content',
      reporter: 'John Doe',
      reason: 'Offensive description',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-14'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg opacity-90">Monitor and manage the campus marketplace</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Last 24 hours</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {adminStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-500">Marie Gasana joined the platform</p>
                    </div>
                    <span className="text-xs text-gray-500">2m ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New listing created</p>
                      <p className="text-xs text-gray-500">MacBook Pro 13" posted by Jean Claude</p>
                    </div>
                    <span className="text-xs text-gray-500">5m ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Report submitted</p>
                      <p className="text-xs text-gray-500">Suspicious electronics deal reported</p>
                    </div>
                    <span className="text-xs text-gray-500">15m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-16 flex-col space-y-1 bg-blue-500 hover:bg-blue-600">
                    <Mail className="w-5 h-5" />
                    <span className="text-xs">Send Notification</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Shield className="w-5 h-5" />
                    <span className="text-xs">Verify User</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Ban className="w-5 h-5" />
                    <span className="text-xs">Suspend Account</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Eye className="w-5 h-5" />
                    <span className="text-xs">Review Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle>User Management</CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search users..." className="w-64" />
                  <Button variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
                        {user.verified && <Shield className="w-4 h-4 text-green-500" />}
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Joined: {user.joinDate}</span>
                        <span>Listings: {user.listings}</span>
                        <span>Rating: ⭐ {user.reputation}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle>Listings Management</CardTitle>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <img src={listing.image} alt={listing.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{listing.title}</h3>
                        <Badge className={getStatusColor(listing.status)}>{listing.status}</Badge>
                        {listing.reports > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {listing.reports} report{listing.reports > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>By: {listing.seller}</span>
                        <span>Category: {listing.category}</span>
                        <span>Price: {listing.price.toLocaleString()} RWF</span>
                        <span>Views: {listing.views}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Created: {listing.createdAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      {listing.status === 'pending' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">Approve</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Reports & Moderation
                </CardTitle>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedItems.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{report.title}</h3>
                        <Badge className={getPriorityColor(report.priority)}>{report.priority} priority</Badge>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>
                      <span className="text-xs text-gray-500">{report.createdAt}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <p><strong>Reported by:</strong> {report.reporter}</p>
                      <p><strong>Reason:</strong> {report.reason}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">Resolve</Button>
                      <Button variant="outline" size="sm" className="text-red-600">Escalate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500">Analytics charts will be implemented here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium">Daily Active Users</span>
                    <span className="text-lg font-bold text-blue-600">234</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium">New Listings Today</span>
                    <span className="text-lg font-bold text-green-600">18</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium">Messages Sent</span>
                    <span className="text-lg font-bold text-purple-600">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
