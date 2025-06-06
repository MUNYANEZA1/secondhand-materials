
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  contactId?: string;
}

const ChatSystem = ({ isOpen, onClose, contactId }: ChatSystemProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(contactId || null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'John Uwimana',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'Is the laptop still available?',
      timestamp: '2 min ago',
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      name: 'Marie Mukamana',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b734?w=150',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '1 hour ago',
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      name: 'David Niyonzima',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'Can we meet tomorrow?',
      timestamp: '3 hours ago',
      unreadCount: 1,
      online: true
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: '1',
        content: 'Hi! I saw your MacBook listing. Is it still available?',
        timestamp: '2:30 PM',
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        content: 'Yes, it is! Are you interested in seeing it?',
        timestamp: '2:32 PM',
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        senderId: '1',
        content: 'Definitely! What time works for you?',
        timestamp: '2:35 PM',
        status: 'delivered',
        type: 'text'
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '2',
        content: 'Thank you for organizing the study group!',
        timestamp: '1:00 PM',
        status: 'read',
        type: 'text'
      }
    ],
    '3': [
      {
        id: '1',
        senderId: '3',
        content: 'Hey, can we meet to discuss the room booking?',
        timestamp: '11:00 AM',
        status: 'sent',
        type: 'text'
      }
    ]
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  useEffect(() => {
    if (contactId && contacts.find(c => c.id === contactId)) {
      setActiveChat(contactId);
      setShowMobileChat(true);
    }
  }, [contactId, contacts]);

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSelect = (contactId: string) => {
    setActiveChat(contactId);
    setShowMobileChat(true);
  };

  const handleBackToContacts = () => {
    setShowMobileChat(false);
    setActiveChat(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl h-[95vh] md:h-[85vh] w-full md:w-[90%] lg:w-[80%] xl:w-[70%] flex overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      >
        {/* Mobile/Tablet Layout */}
        <div className="flex-1 md:hidden">
          <AnimatePresence mode="wait">
            {!showMobileChat ? (
              <motion.div
                key="contacts"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Mobile Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-yellow-500">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/90 border-0"
                    />
                  </div>
                </div>

                {/* Mobile Contacts List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800"
                      onClick={() => handleContactSelect(contact.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {contact.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {contact.name}
                            </h3>
                            <span className="text-xs text-gray-500">{contact.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {contact.lastMessage}
                          </p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Mobile Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-yellow-500">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToContacts}
                      className="text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <img
                      src={contacts.find(c => c.id === activeChat)?.avatar}
                      alt="Contact"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {contacts.find(c => c.id === activeChat)?.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {contacts.find(c => c.id === activeChat)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/30 to-yellow-50/30 dark:from-gray-800 dark:to-gray-900">
                  {(messages[activeChat!] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-md ${
                          msg.senderId === 'me'
                            ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">{msg.timestamp}</span>
                          {msg.senderId === 'me' && (
                            <div className="ml-2">
                              {msg.status === 'sent' && <Check className="w-3 h-3 opacity-70" />}
                              {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 opacity-70" />}
                              {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-green-200" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Mobile Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 rounded-full border-gray-300 focus:border-green-500"
                    />
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-500">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="rounded-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-1">
          {/* Contacts Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-800/50">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-500 to-yellow-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Messages</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 border-0 rounded-full"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition-colors ${
                    activeChat === contact.id ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : ''
                  }`}
                  onClick={() => handleContactSelect(contact.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-500">{contact.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <Badge className="bg-green-500 text-white text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contacts.find(c => c.id === activeChat)?.avatar}
                        alt="Contact"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          {contacts.find(c => c.id === activeChat)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {contacts.find(c => c.id === activeChat)?.online ? (
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Online now
                            </span>
                          ) : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-800">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-yellow-100 dark:hover:bg-yellow-800">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-green-50/30 to-yellow-50/30 dark:from-gray-900 dark:to-gray-800">
                  {(messages[activeChat] || []).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${
                          msg.senderId === 'me'
                            ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">{msg.timestamp}</span>
                          {msg.senderId === 'me' && (
                            <div className="ml-2">
                              {msg.status === 'sent' && <Check className="w-3 h-3 opacity-70" />}
                              {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 opacity-70" />}
                              {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-green-200" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-500">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-12 rounded-full border-gray-300 focus:border-green-500 bg-gray-50 dark:bg-gray-700"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="rounded-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a contact to start messaging
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatSystem;
