import React, { useState, useEffect } from 'react';
import ConversationList from '../components/messaging/ConversationList';
import Conversation from '../components/messaging/Conversation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const MessagesPage = () => {
  const { currentUser, loading } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <ErrorMessage message="Please login to view your messages" />
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r md:col-span-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="p-2">
              <ConversationList 
                onSelectConversation={setSelectedConversation}
                selectedId={selectedConversation}
              />
            </div>
          </div>
          
          {/* Conversation Messages */}
          <div className="md:col-span-2 flex flex-col h-full">
            <Conversation conversationId={selectedConversation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
