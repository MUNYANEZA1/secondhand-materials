import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import messageService from '../../services/messageService';
import LoadingSpinner from '../common/LoadingSpinner';

const ContactSellerModal = ({ item, onClose }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      addNotification('Please enter a message', 'warning');
      return;
    }
    
    setSending(true);
    
    try {
      await messageService.createConversation({
        receiverId: item.userId._id,
        itemId: item._id,
        initialMessage: message
      });
      
      addNotification('Message sent successfully!', 'success');
      onClose();
    } catch (err) {
      console.error('Error sending message:', err);
      addNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Contact Seller</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-semibold">Item:</span> {item.title}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Seller:</span> {item.userId.firstName} {item.userId.lastName}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="form-label">Your Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="form-input"
              placeholder="Hi, I'm interested in your item..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending}
            >
              {sending ? <LoadingSpinner size="small" text="" /> : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSellerModal;
