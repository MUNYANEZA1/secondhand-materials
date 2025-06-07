
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Download, Star, FileText, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchResources, setResourceSearchTerm } from '@/store/slices/resourcesSlice';
import toast from 'react-hot-toast';

const Resources = () => {
  const dispatch = useAppDispatch();
  const { resources, loading, searchTerm } = useAppSelector(state => state.resources);

  useEffect(() => {
    dispatch(fetchResources());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResourceSearchTerm(e.target.value));
  };

  const handleDownload = (resource: any) => {
    toast.success(`Downloading ${resource.title}...`);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'ppt': return '📊';
      case 'dataset': return '📊';
      default: return '📁';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'doc': return 'bg-blue-100 text-blue-800';
      case 'ppt': return 'bg-orange-100 text-orange-800';
      case 'dataset': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
            Academic Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Access study materials, past papers, lab reports, and academic resources shared by the community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search resources, courses, or topics..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 h-12 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No resources found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <motion.div key={resource.id} whileHover={{ y: -4 }}>
                  <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getFileTypeIcon(resource.fileType)}</span>
                          <div>
                            <Badge className={`text-xs ${getFileTypeColor(resource.fileType)}`}>
                              {resource.fileType.toUpperCase()}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{resource.fileSize}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{resource.rating}</span>
                          <span className="text-xs text-gray-500">({resource.ratingCount})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2 mb-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {resource.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Course:</span>
                          <Badge variant="outline">{resource.course}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium">{resource.department}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{resource.downloads} downloads</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={resource.uploader.avatar} />
                          <AvatarFallback className="text-xs">
                            {resource.uploader.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-medium">{resource.uploader.name}</span>
                          {resource.uploader.year && (
                            <span className="text-xs text-gray-500 ml-1">({resource.uploader.year})</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {resource.accessType === 'view-only' ? (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => handleDownload(resource)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Only
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => handleDownload(resource)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
