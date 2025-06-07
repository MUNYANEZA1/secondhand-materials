
import { motion } from 'framer-motion';
import { Star, Clock, DollarSign, BookOpen, Award, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  major: string;
  year: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  experience: string;
  availability: string[];
  languages: string[];
  teachingStyle: string;
  achievements: string[];
  responseTime: string;
  completedSessions: number;
}

interface TutorCardProps {
  tutor: Tutor;
  onContactTutor?: (tutor: Tutor) => void;
  onBookSession?: (tutor: Tutor) => void;
}

const TutorCard = ({ tutor, onContactTutor, onBookSession }: TutorCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-400/10 h-full flex flex-col">
        <CardHeader className="p-4">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.avatar} />
              <AvatarFallback>
                {tutor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {tutor.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tutor.year} • {tutor.major}
              </p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  {tutor.rating}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({tutor.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${tutor.hourlyRate}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                per hour
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {tutor.subjects.slice(0, 3).map((subject, index) => (
              <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {subject}
              </Badge>
            ))}
            {tutor.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tutor.subjects.length - 3} more
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {tutor.teachingStyle}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Responds in {tutor.responseTime}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{tutor.completedSessions} sessions completed</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Award className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{tutor.experience}</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Languages:</p>
            <div className="flex flex-wrap gap-1">
              {tutor.languages.map((language, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available:</p>
            <div className="flex flex-wrap gap-1">
              {tutor.availability.slice(0, 3).map((time, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              onClick={() => onBookSession?.(tutor)}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Book Session
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-green-50 dark:hover:bg-green-900/20"
              onClick={() => onContactTutor?.(tutor)}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TutorCard;
