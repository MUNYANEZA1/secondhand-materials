
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Image, Paperclip, Smile, MoreVertical, 
  Phone, Video, Shield, Archive, Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'offer';
  status: 'sent' | 'delivered' | 'read';
  offer?: {
    amount: number;
    productTitle: string;
  };
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  online: boolean;
  lastSeen?: string;
}

interface EnhancedChatProps {
  currentUser: ChatUser;
  otherUser: ChatUser;
  productTitle?: string;
  onSendMessage?: (message: string) => void;
  onMakeOffer?: (amount: number) => void;
  onClose?: () => void;
}

const EnhancedChat = ({
  currentUser,
  otherUser,
  productTitle,
  onSendMessage,
  onMakeOffer,
  onClose
}: EnhancedChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: otherUser.id,
      content: `Hi! I'm interested in your ${productTitle}. Is it still available?`,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: currentUser.id,
      content: 'Yes, it\'s still available! Would you like to see it in person?',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: otherUser.id,
      content: 'That would be great! When would be a good time to meet?',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: 'text',
      status: 'read'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    onSendMessage?.(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-md mx-auto">
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {otherUser.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{otherUser.name}</h3>
                {otherUser.verified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {otherUser.online ? 'Online' : `Last seen ${otherUser.lastSeen}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Chat
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Flag className="w-4 h-4 mr-2" />
                  Report User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {productTitle && (
          <>
            <Separator />
            <div className="text-sm text-gray-600">
              Discussing: <span className="font-medium">{productTitle}</span>
            </div>
          </>
        )}
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.senderId === currentUser.id ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.senderId === currentUser.id
                      ? 'bg-emerald-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  {msg.type === 'offer' && msg.offer ? (
                    <div className="space-y-2">
                      <p className="font-semibold">Price Offer</p>
                      <div className="bg-white/20 rounded-lg p-2">
                        <p className="text-sm">{msg.offer.productTitle}</p>
                        <p className="text-lg font-bold">${msg.offer.amount}</p>
                      </div>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
                  msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.senderId === currentUser.id && (
                    <div className={`w-2 h-2 rounded-full ${
                      msg.status === 'read' ? 'bg-blue-500' : 
                      msg.status === 'delivered' ? 'bg-gray-400' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-1" />
                Photo
              </Button>
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4 mr-1" />
                File
              </Button>
              {productTitle && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onMakeOffer?.(0)}
                >
                  Make Offer
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedChat;
