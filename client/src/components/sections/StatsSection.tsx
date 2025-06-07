
import { motion } from 'framer-motion';
import { Users, Package, Recycle, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '2,847',
      label: 'Active Students',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
    },
    {
      icon: Package,
      value: '1,293',
      label: 'Items Listed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Recycle,
      value: '847',
      label: 'Items Recycled',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: TrendingUp,
      value: '94%',
      label: 'Success Rate',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-y border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Making Impact Together
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of students creating a sustainable campus economy
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`inline-flex p-4 rounded-2xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
