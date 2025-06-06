
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  size?: number;
  className?: string;
}

const SuccessAnimation = ({ size = 24, className = '' }: SuccessAnimationProps) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      }}
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500 text-white ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Check size={size * 0.6} />
      </motion.div>
    </motion.div>
  );
};

export default SuccessAnimation;
