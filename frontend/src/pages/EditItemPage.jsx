import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemForm from '../components/items/ItemForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import itemService from '../services/itemService';

const EditItemPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemService.getItem(id);
        const itemData = response.data.data;
        
        // Check if current user is the owner
        if (currentUser && itemData.userId && itemData.userId._id !== currentUser._id) {
          setError('You do not have permission to edit this item.');
          setLoading(false);
          return;
        }
        
        setItem(itemData);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id, currentUser]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (!item) {
    return <ErrorMessage message="Item not found" />;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
      <ItemForm editMode={true} initialData={item} />
    </div>
  );
};

export default EditItemPage;
