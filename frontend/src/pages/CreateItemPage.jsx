import React from 'react';
import ItemForm from '../components/items/ItemForm';

const CreateItemPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
      <ItemForm />
    </div>
  );
};

export default CreateItemPage;
