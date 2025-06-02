import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileView from '../components/profile/ProfileView';
import UserItems from '../components/profile/UserItems';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProfilePage = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <ErrorMessage message="Please login to view your profile" />
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'items'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Items
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' ? (
            <ProfileView />
          ) : (
            <UserItems />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
