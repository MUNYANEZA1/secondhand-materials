// ItemForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { useNotification } from '../../hooks/useNotification';
import { validateForm } from '../../utils/validators';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../utils/constants';
import itemService from '../../services/itemService';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const ItemForm = ({ editMode = false, initialData = null }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  
  const { 
    values, 
    errors, 
    isSubmitting, 
    setErrors, 
    setIsSubmitting, 
    handleChange 
  } = useForm(initialData || {
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      if (e.target.files.length > 5) {
        addNotification('You can upload maximum 5 photos', 'warning');
        return;
      }
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm(values, [
      { name: 'title', required: true, label: 'Title' },
      { name: 'description', required: true, label: 'Description' },
      { name: 'price', type: 'price', required: true, label: 'Price' },
      { name: 'category', required: true, label: 'Category' },
      { name: 'condition', required: true, label: 'Condition' }
    ]);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Format data
      const itemData = {
        ...values,
        price: parseFloat(values.price)
      };
      
      let response;
      
      if (editMode && initialData?._id) {
        // Update existing item
        response = await itemService.updateItem(initialData._id, itemData);
        
        // Upload photos if any
        if (photos.length > 0) {
          await itemService.uploadItemPhotos(initialData._id, photos);
        }
        
        addNotification('Item updated successfully!', 'success');
      } else {
        // Create new item
        response = await itemService.createItem(itemData);
        
        // Upload photos if any
        if (photos.length > 0) {
          await itemService.uploadItemPhotos(response.data.data._id, photos);
        }
        
        addNotification('Item created successfully!', 'success');
      }
      
      // Navigate to item detail page
      navigate(`/items/${response.data.data._id}`);
    } catch (err) {
      console.error('Error saving item:', err);
      setError(err.response?.data?.error || 'An error occurred while saving the item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {editMode ? 'Edit Item' : 'Create New Listing'}
      </h2>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={values.title || ''}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter a descriptive title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description || ''}
            onChange={handleChange}
            rows="5"
            className={`form-input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Describe your item in detail"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="form-label">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={values.price || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`form-input ${errors.price ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              value={values.category || ''}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          
          <div>
            <label htmlFor="condition" className="form-label">Condition</label>
            <select
              id="condition"
              name="condition"
              value={values.condition || ''}
              onChange={handleChange}
              className={`form-input ${errors.condition ? 'border-red-500' : ''}`}
            >
              <option value="">Select condition</option>
              {ITEM_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </select>
            {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="photos" className="form-label">Photos (Max 5)</label>
          <input
            type="file"
            id="photos"
            name="photos"
            onChange={handlePhotoChange}
            multiple
            accept="image/*"
            className="form-input"
          />
          <p className="text-gray-500 text-sm mt-1">
            {photos.length > 0 
              ? `${photos.length} file(s) selected` 
              : editMode 
                ? 'Upload new photos to replace existing ones' 
                : 'Select up to 5 photos of your item'
            }
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" text="" />
            ) : editMode ? (
              'Update Item'
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
