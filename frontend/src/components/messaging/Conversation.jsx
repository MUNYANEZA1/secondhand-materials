import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import messageService from '../../services/messageService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const Conversation = ({ conversationId }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState(null);
  
  // Fetch conversation details and messages
  useEffect(() => {
    const fetchData = async () => {
      if (!conversationId) return;
      
      setLoading(true);
      setError('');
      
      try {
        // Get conversation details
        const convResponse = await messageService.getConversation(conversationId);
        setConversation(convResponse.data.data);
        
        // Get messages
        const msgResponse = await messageService.getMessagesByConversation(conversationId);
        setMessages(msgResponse.data.data);
      } catch (err) {
        console.error('Error fetching conversation data:', err);
        setError('Failed to load conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [conversationId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const response = await messageService.sendMessage({
        conversationId,
        content: newMessage
      });
      
      // Add new message to the list
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      addNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };
  
  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  // Find the other participant (not the current user)
  const otherParticipant = conversation?.participants.find(
    (p) => p._id !== currentUser._id
  );
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation Header */}
      <div className="bg-white p-4 border-b flex items-center space-x-3">
        <img
          src={otherParticipant?.profilePhoto ? `/uploads/profiles/${otherParticipant.profilePhoto}` : '/assets/default-profile.jpg'}
          alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">
            {otherParticipant?.firstName} {otherParticipant?.lastName}
          </h3>
          
          {conversation?.itemId && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>About:</span>
              <a 
                href={`/items/${conversation.itemId._id}`}
                className="hover:text-primary truncate max-w-xs"
              >
                {conversation.itemId.title}
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser._id;
              
              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      isCurrentUser
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white border rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="form-input flex-grow"
            disabled={sending}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? <LoadingSpinner size="small" text="" /> : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
