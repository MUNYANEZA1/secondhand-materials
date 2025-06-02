import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import adminService from '../../services/adminService';
import ReportDownloads from "./ReportDownloads";
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { addNotification } = useNotification();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <ErrorMessage message="You do not have permission to access this page." />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{stats.counts.users}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Items</h3>
          <p className="text-3xl font-bold">{stats.counts.items}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Pending Items</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.counts.pendingItems}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Pending Reports</h3>
          <p className="text-3xl font-bold text-red-500">{stats.counts.pendingReports}</p>
        </div>
      </div>
      
      {/* Report Downloads Section */}
      <ReportDownloads />
      
      {/* Recent Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Items</h3>
        
        {stats.recentItems.length === 0 ? (
          <p className="text-gray-500">No recent items.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/items/${item._id}`}
                        className="text-primary hover:underline"
                      >
                        {item.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.userId ? `${item.userId.firstName} ${item.userId.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.approved 
                          ? item.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.approved 
                          ? item.status === 'available' ? 'Available' : 'Sold'
                          : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={`/items/${item._id}`}
                        className="text-primary hover:underline mr-3"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
        
        {stats.recentReports.length === 0 ? (
          <p className="text-gray-500">No recent reports.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentReports.map((report) => (
                  <tr key={report._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.reporterId ? `${report.reporterId.firstName} ${report.reporterId.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.targetType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="truncate max-w-xs">
                        {report.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : report.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a 
                        href={`/admin/reports/${report._id}`}
                        className="text-primary hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="flex flex-wrap gap-4">
        <a href="/admin/items/pending" className="btn btn-primary">
          Manage Pending Items
        </a>
        <a href="/admin/reports" className="btn btn-primary">
          View All Reports
        </a>
        <a href="/admin/reports/downloads" className="btn btn-primary">
          Download Reports
        </a>
        <a href="/admin/users" className="btn btn-primary">
          Manage Users
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
