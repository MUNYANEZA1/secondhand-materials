
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import StudyGroupCard from '@/components/marketplace/StudyGroupCard';
import FloatingActionButton from '@/components/ui/floating-action-button';

const StudyGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for study groups
    const mockGroups = [
      {
        id: '1',
        title: 'Advanced Calculus Study Group',
        subject: 'Mathematics',
        description: 'Weekly study sessions for Advanced Calculus. We cover problem-solving techniques and prepare for exams together.',
        organizer: {
          id: 'org1',
          name: 'Sarah Kim',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
          year: 'Junior',
          major: 'Engineering'
        },
        schedule: 'Tuesdays & Thursdays 6-8 PM',
        location: 'Library Study Room 3',
        maxMembers: 8,
        currentMembers: 5,
        difficulty: 'Advanced',
        tags: ['calculus', 'mathematics', 'problem-solving'],
        rating: 4.8,
        isOnline: false
      },
      {
        id: '2',
        title: 'Computer Science Fundamentals',
        subject: 'Computer Science',
        description: 'Learn programming basics, data structures, and algorithms. Perfect for beginners and those looking to strengthen their foundation.',
        organizer: {
          id: 'org2',
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          year: 'Senior',
          major: 'Computer Science'
        },
        schedule: 'Mondays & Wednesdays 7-9 PM',
        location: 'Online (Zoom)',
        maxMembers: 12,
        currentMembers: 9,
        difficulty: 'Beginner',
        tags: ['programming', 'algorithms', 'coding'],
        rating: 4.9,
        isOnline: true
      },
    ];
    
    setTimeout(() => {
      setStudyGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGroups = studyGroups.filter(group =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-4">
            Study Groups
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Join study groups, collaborate with peers, and excel together in your academic journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search study groups, subjects, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl"
              />
            </div>
            <Button variant="outline" className="h-12 px-4">
              <Filter className="w-5 h-5" />
            </Button>
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
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No study groups found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search terms or create a new study group
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <StudyGroupCard 
                  key={group.id} 
                  group={group}
                  onJoinGroup={() => {}}
                  onContactOrganizer={() => {}}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <FloatingActionButton
        onClick={() => {}}
        icon={<Plus className="w-6 h-6" />}
        tooltip="Create Study Group"
      />
    </div>
  );
};

export default StudyGroups;
