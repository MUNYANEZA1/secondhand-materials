import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import adminService from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const PendingItems = () => {
  const { isAdmin } = useAuth();
  const { addNotification } = useNotification();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const response = await adminService.getPendingItems();
        setItems(response.data.data);
      } catch (err) {
        console.error('Error fetching pending items:', err);
        setError('Failed to load pending items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingItems();
  }, []);
  
  const handleApprove = async (id) => {
    try {
      await adminService.approveItem(id);
      setItems(items.filter(item => item._id !== id));
      addNotification('Item approved successfully', 'success');
    } catch (err) {
      console.error('Error approving item:', err);
      addNotification('Failed to approve item', 'error');
    }
  };
  
  const handleReject = async (id) => {
    try {
      await adminService.rejectItem(id);
      setItems(items.filter(item => item._id !== id));
      addNotification('Item rejected successfully', 'success');
    } catch (err) {
      console.error('Error rejecting item:', err);
      addNotification('Failed to reject item', 'error');
    }
  };
  
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
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pending items to review.</p>
        <a href="/admin" className="btn btn-primary mt-4">
          Back to Dashboard
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Items</h2>
        <a href="/admin" className="btn btn-outline">
          Back to Dashboard
        </a>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        <img 
                          src={item.photos && item.photos.length > 0 ? `/uploads/items/${item.photos[0]}` : '/assets/default-item.png'} 
                          alt={item.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div className="truncate max-w-xs">
                        <a 
                          href={`/items/${item._id}`}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      </div>
                    </div>
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
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingItems;
