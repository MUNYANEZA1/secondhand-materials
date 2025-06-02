import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useNotification } from '../../hooks/useNotification';
import messageService from '../../services/messageService';
import LoadingSpinner from '../common/LoadingSpinner';

const MessageForm = ({ receiverId, itemId, onMessageSent }) => {
  const { addNotification } = useNotification();
  const [sending, setSending] = useState(false);
  
  const { 
    values, 
    errors, 
    setErrors, 
    handleChange, 
    resetForm 
  } = useForm({
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!values.message.trim()) {
      setErrors({ message: 'Please enter a message' });
      return;
    }
    
    setSending(true);
    
    try {
      await messageService.createConversation({
        receiverId,
        itemId,
        initialMessage: values.message
      });
      
      addNotification('Message sent successfully!', 'success');
      resetForm();
      
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      addNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="message" className="form-label">Your Message</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={handleChange}
          rows="4"
          className={`form-input ${errors.message ? 'border-red-500' : ''}`}
          placeholder="Hi, I'm interested in your item..."
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>
      
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={sending}
      >
        {sending ? <LoadingSpinner size="small" text="" /> : 'Send Message'}
      </button>
    </form>
  );
};

export default MessageForm;
