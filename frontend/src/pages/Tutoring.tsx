
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, GraduationCap, Plus, Filter, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import TutorCard from '@/components/marketplace/TutorCard';
import FloatingActionButton from '@/components/ui/floating-action-button';

const Tutoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for tutors
    const mockTutors = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        major: 'Mathematics',
        year: 'PhD Candidate',
        subjects: ['Calculus', 'Linear Algebra', 'Statistics', 'Discrete Math'],
        rating: 4.9,
        reviewCount: 127,
        hourlyRate: 25,
        experience: '3+ years teaching experience',
        availability: ['Mon 2-6 PM', 'Wed 2-8 PM', 'Fri 10-4 PM'],
        languages: ['English', 'Spanish'],
        teachingStyle: 'Patient and methodical approach, focusing on building strong fundamentals and problem-solving skills.',
        achievements: ['Dean\'s List', 'Math Tutor Award 2023'],
        responseTime: '< 1 hour',
        completedSessions: 340
      },
      {
        id: '2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        major: 'Computer Science',
        year: 'Senior',
        subjects: ['Programming', 'Data Structures', 'Algorithms', 'Web Development'],
        rating: 4.8,
        reviewCount: 89,
        hourlyRate: 20,
        experience: '2 years tutoring experience',
        availability: ['Tue 4-8 PM', 'Thu 4-8 PM', 'Sat 10-6 PM'],
        languages: ['English', 'Mandarin'],
        teachingStyle: 'Hands-on coding approach with real-world projects and practical examples.',
        achievements: ['Google Code-in Mentor', 'CS Department TA'],
        responseTime: '< 2 hours',
        completedSessions: 156
      },
    ];
    
    setTimeout(() => {
      setTutors(mockTutors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-4">
            Find a Tutor
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with experienced tutors and boost your academic performance with personalized learning
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tutors, subjects, or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-green-200 focus:border-green-400 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-12 px-4">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <Button variant="outline" className="h-12 px-4">
                <Star className="w-5 h-5 mr-2" />
                Top Rated
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Economics'].map((subject) => (
              <Badge key={subject} variant="outline" className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20">
                {subject}
              </Badge>
            ))}
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
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No tutors found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Try adjusting your search terms or become a tutor yourself
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard 
                  key={tutor.id} 
                  tutor={tutor}
                  onContactTutor={() => {}}
                  onBookSession={() => {}}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <FloatingActionButton
        onClick={() => {}}
        icon={<Plus className="w-6 h-6" />}
        tooltip="Become a Tutor"
      />
    </div>
  );
};

export default Tutoring;
