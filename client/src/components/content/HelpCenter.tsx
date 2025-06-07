
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'buying', name: 'Buying', count: 6 },
    { id: 'selling', name: 'Selling', count: 5 },
    { id: 'payments', name: 'Payments', count: 3 },
    { id: 'safety', name: 'Safety', count: 2 }
  ];

  const faqs = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button and follow the registration process. You\'ll need your university email to verify your student status.',
      helpful: 25,
      views: 156
    },
    {
      id: '2',
      category: 'selling',
      question: 'How do I list an item for sale?',
      answer: 'Click on the "Sell Item" button, fill out the product details including photos, price, and description. Your listing will be reviewed and published within 24 hours.',
      helpful: 18,
      views: 98
    },
    {
      id: '3',
      category: 'buying',
      question: 'How do I contact a seller?',
      answer: 'Click on the "Message Seller" button on any product page to start a conversation. You can also use the chat feature to negotiate prices or ask questions.',
      helpful: 22,
      views: 134
    },
    {
      id: '4',
      category: 'payments',
      question: 'What payment methods are accepted?',
      answer: 'We accept cash on delivery (COD), digital payments through our secure platform, and bank transfers. All transactions are protected by our buyer protection policy.',
      helpful: 15,
      views: 89
    },
    {
      id: '5',
      category: 'safety',
      question: 'How do I report a suspicious listing?',
      answer: 'Click the "Report" button on any listing that seems suspicious. Our team will review the report within 24 hours and take appropriate action.',
      helpful: 12,
      views: 67
    }
  ];

  const quickActions = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Chat with our support team', action: 'chat' },
    { icon: Mail, title: 'Email Support', description: 'Send us an email', action: 'email' },
    { icon: Phone, title: 'Call Us', description: 'Speak with support', action: 'call' },
    { icon: Book, title: 'User Guide', description: 'Complete platform guide', action: 'guide' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions or get in touch with our support team
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6 text-center">
                <action.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Frequently Asked Questions
                  <Badge variant="outline" className="ml-2">
                    {filteredFaqs.length} results
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                          <h3 className="font-semibold text-left">{faq.question}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{faq.views} views</span>
                              <span>{faq.helpful} helpful</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 bg-white border border-gray-100 rounded-b-lg">
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button variant="outline" size="sm">
                                👍 Helpful
                              </Button>
                              <Button variant="outline" size="sm">
                                👎 Not helpful
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                ))}

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">No results found</h3>
                    <p className="text-gray-400">Try adjusting your search terms or browse categories</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="mb-6 text-blue-100">
                Our support team is here to help you with any questions or issues
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-500">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;
