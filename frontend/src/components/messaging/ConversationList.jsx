import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import messageService from '../../services/messageService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ConversationList = ({ onSelectConversation, selectedId }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageService.getConversations();
        setConversations(response.data.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No conversations yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        // Find the other participant (not the current user)
        const otherParticipant = conversation.participants.find(
          (p) => p._id !== currentUser._id
        );
        
        // Check if there are unread messages
        const hasUnreadMessages = false; // This would need to be implemented with the backend
        
        return (
          <button
            key={conversation._id}
            onClick={() => onSelectConversation(conversation._id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedId === conversation._id
                ? 'bg-primary bg-opacity-10'
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={otherParticipant?.profilePhoto ? `/uploads/profiles/${otherParticipant.profilePhoto}` : '/assets/default-profile.jpg'}
                  alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {hasUnreadMessages && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full"></span>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-medium truncate">
                    {otherParticipant?.firstName} {otherParticipant?.lastName}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
            
            {conversation.itemId && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={conversation.itemId.photos && conversation.itemId.photos.length > 0 
                      ? `/uploads/items/${conversation.itemId.photos[0]}` 
                      : '/assets/default-item.jpg'}
                    alt={conversation.itemId.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-500 truncate">
                  {conversation.itemId.title}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
