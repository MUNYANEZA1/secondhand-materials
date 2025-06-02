import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilters from '../components/items/SearchFilters';
import ItemGrid from '../components/items/ItemGrid';
import itemService from '../services/itemService';
import { ITEM_CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await itemService.getItems(filters);
        setItems(response.data.data);
        setError('');
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [filters]);
  
  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-primary bg-opacity-10 rounded-lg p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          INES-Ruhengeri Second-hand Materials
        </h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Buy and sell second-hand items within the INES-Ruhengeri community. 
          Find great deals on textbooks, electronics, furniture, and more!
        </p>
        <Link to="/items/create" className="btn btn-primary">
          Post an Item
        </Link>
      </div>
      
      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ITEM_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/items/search?category=${category}`}
              className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-primary text-3xl mb-2">
                {category === 'books' && '📚'}
                {category === 'electronics' && '💻'}
                {category === 'furniture' && '🪑'}
                {category === 'clothing' && '👕'}
                {category === 'other' && '📦'}
              </div>
              <h3 className="font-medium">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Search & Items */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters onSearch={handleSearch} />
        </div>
        
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4">Latest Items</h2>
          <ItemGrid items={items} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
