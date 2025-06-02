import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from '../components/items/ItemDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import itemService from '../services/itemService';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemService.getItem(id);
        setItem(response.data.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
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
  
  return <ItemDetail item={item} />;
};

export default ItemDetailPage;
