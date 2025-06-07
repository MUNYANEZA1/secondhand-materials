
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createThread } from '@/store/slices/chatSlice';
import ChatSystem from '@/components/chat/ChatSystem';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    id: string;
    name: string;
    avatar: string;
    reputation: number;
    verified: boolean;
  };
  itemTitle: string;
  productId?: string;
}

const ChatModal = ({ isOpen, onClose, seller, itemTitle, productId }: ChatModalProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen && seller.id) {
      dispatch(createThread({ 
        recipientId: seller.id, 
        productId 
      }));
    }
  }, [isOpen, seller.id, productId, dispatch]);

  return (
    <ChatSystem 
      isOpen={isOpen} 
      onClose={onClose} 
      contactId={seller.id}
    />
  );
};

export default ChatModal;
