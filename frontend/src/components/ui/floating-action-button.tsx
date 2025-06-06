
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  tooltip?: string;
}

const FloatingActionButton = ({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />, 
  tooltip = "Add new item" 
}: FloatingActionButtonProps) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-2xl hover:shadow-3xl transition-all duration-300"
        title={tooltip}
      >
        {icon}
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;
