
import { motion } from 'framer-motion';
import { Users, Clock, BookOpen, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudyGroup {
  id: string;
  title: string;
  subject: string;
  description: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    year: string;
    major: string;
  };
  schedule: string;
  location: string;
  maxMembers: number;
  currentMembers: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  rating: number;
  isOnline: boolean;
}

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoinGroup?: (group: StudyGroup) => void;
  onContactOrganizer?: (group: StudyGroup) => void;
}

const StudyGroupCard = ({ group, onJoinGroup, onContactOrganizer }: StudyGroupCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const spotsLeft = group.maxMembers - group.currentMembers;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
    >
      <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 h-full flex flex-col">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {group.title}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{group.subject}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={getDifficultyColor(group.difficulty)}>
                {group.difficulty}
              </Badge>
              {group.isOnline && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                  Online
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={group.organizer.avatar} />
              <AvatarFallback className="text-sm">
                {group.organizer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {group.organizer.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {group.organizer.year} • {group.organizer.major}
              </p>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                {group.rating}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {group.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{group.schedule}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{group.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{group.currentMembers}/{group.maxMembers} members</span>
              {spotsLeft <= 3 && spotsLeft > 0 && (
                <Badge variant="outline" className="ml-2 text-xs text-orange-600 border-orange-600">
                  {spotsLeft} spots left
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {group.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => onJoinGroup?.(group)}
              disabled={spotsLeft === 0}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {spotsLeft === 0 ? 'Full' : 'Join Group'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => onContactOrganizer?.(group)}
            >
              Contact
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StudyGroupCard;
