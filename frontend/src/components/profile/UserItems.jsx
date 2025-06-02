import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import itemService from '../../services/itemService';
import ItemCard from '../items/ItemCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const UserItems = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!currentUser?._id) return;
      
      try {
        const response = await itemService.getItemsByUser(currentUser._id);
        setItems(response.data.data);
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserItems();
  }, [currentUser]);
  
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
        <p className="text-gray-500 text-lg mb-4">You haven't posted any items yet.</p>
        <a href="/items/create" className="btn btn-primary">
          Post Your First Item
        </a>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Items</h2>
        <a href="/items/create" className="btn btn-primary">
          Post New Item
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default UserItems;
