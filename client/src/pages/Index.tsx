
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, Star, Users, BookOpen, Calendar, MapPin, Clock, Zap, Target, Award, Menu, Filter } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import ProductDetailsModal from '@/components/marketplace/ProductDetailsModal';
import ChatModal from '@/components/marketplace/ChatModal';
import SellItemModal from '@/components/marketplace/SellItemModal';
import FloatingActionButton from '@/components/ui/floating-action-button';
import HomeSidebar from '@/components/sidebar/HomeSidebar';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/store/slices/productsSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Index = () => {
  const dispatch = useAppDispatch();
  const productsState = useAppSelector(state => state.products);
  const { items: products = [], loading = false, searchTerm = '' } = productsState || {};
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatSeller, setChatSeller] = useState<{
    id: string;
    name: string;
    avatar: string;
    reputation: number;
    verified: boolean;
  } | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSeller = (product: Product) => {
    setChatSeller({
      id: product.seller.id,
      name: product.seller.name,
      avatar: product.seller.avatar || '',
      reputation: product.seller.reputation,
      verified: product.seller.verified
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const stats = [
    { icon: Users, value: '15,247', label: 'Active Students', color: 'text-yellow-600', bgColor: 'bg-yellow-100/80' },
    { icon: BookOpen, value: '3,892', label: 'Items Listed', color: 'text-green-600', bgColor: 'bg-green-100/80' },
    { icon: Award, value: '94%', label: 'Success Rate', color: 'text-yellow-600', bgColor: 'bg-yellow-100/80' },
    { icon: Target, value: '1,247', label: 'Deals Completed', color: 'text-green-600', bgColor: 'bg-green-100/80' }
  ];

  const featuredCategories = [
    { name: 'Textbooks', icon: BookOpen, count: 847, color: 'from-green-400 to-green-600' },
    { name: 'Electronics', icon: Zap, count: 234, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Study Materials', icon: Target, count: 567, color: 'from-green-500 to-green-700' },
    { name: 'Events', icon: Calendar, count: 89, color: 'from-yellow-500 to-yellow-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 dark:from-gray-900 dark:via-green-900/20 dark:to-yellow-900/20">
      <Navigation />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-0">
            <HomeSidebar
              isOpen={true}
              onClose={() => {}}
              onCategoryFilter={handleCategoryFilter}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="lg:hidden">
              <HomeSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onCategoryFilter={handleCategoryFilter}
                selectedCategory={selectedCategory}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:pl-6">
          <div className="container mx-auto px-4 py-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center space-x-2"
              >
                <Menu className="w-4 h-4" />
                <span>Filters</span>
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Hero Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
                <h1 className="relative text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-green-600 via-yellow-600 to-green-700 bg-clip-text text-transparent animate-gradient">
                    Campus
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-600 via-green-600 to-yellow-700 bg-clip-text text-transparent animate-gradient">
                    Marketplace
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed"
              >
                Your university's premier marketplace for buying, selling, and trading with fellow students
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-6 py-2 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  onClick={() => setShowSellModal(true)}
                >
                  Start Selling <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-6 py-2 text-base font-semibold"
                >
                  Browse Items
                </Button>
              </motion.div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-8"
            >
              <SearchBar />
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <Card className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex p-2 rounded-full ${stat.bgColor.replace('100/80', '200')} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Featured Categories */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-12"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  Popular Categories
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover what your fellow students are buying and selling
                </p>
              </motion.div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {featuredCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="perspective-1000 cursor-pointer"
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    <Card className="h-24 overflow-hidden group hover:shadow-xl transition-all duration-300 transform-gpu">
                      <CardContent className={`h-full relative bg-gradient-to-br ${category.color} text-white p-3 flex flex-col justify-between`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div className="relative z-10">
                          <category.icon className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform duration-300" />
                          <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                          <p className="text-xs opacity-90">{category.count} items</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {selectedCategory !== 'All' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {selectedCategory} ({filteredProducts.length} items)
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCategory('All')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Clear Filter
                    </Button>
                  </div>
                </motion.div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {[...Array(10)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      variants={itemVariants}
                      className="h-64 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur-sm"
                    >
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-t-xl mb-4"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {filteredProducts.slice(0, 15).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onContactSeller={handleContactSeller}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mt-12 py-12 bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-green-500/10 rounded-3xl backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                Ready to Start Trading?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Join thousands of students making campus life more affordable and sustainable
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowSellModal(true)}
              >
                <Plus className="mr-2 w-5 h-5" />
                List Your First Item
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onContactSeller={handleContactSeller}
        />
      )}

      {chatSeller && (
        <ChatModal
          isOpen={!!chatSeller}
          onClose={() => setChatSeller(null)}
          seller={chatSeller}
          itemTitle="Product inquiry"
        />
      )}

      <SellItemModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
      />

      <FloatingActionButton
        onClick={() => setShowSellModal(true)}
        icon={<Plus className="w-6 h-6" />}
        tooltip="Sell Item"
      />
    </div>
  );
};

export default Index;
