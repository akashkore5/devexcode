'use client';
import { motion } from 'framer-motion';

export const StatsSection = ({ className }: { className?: string }) => {
  const stats = [
      { label: "Problems Solved", value: "10,000+" },
      { label: "Happy Learners", value: "5,000+" },
      { label: "Design Guides", value: "50+" },
      { label: "Code Submissions", value: "25,000+" },
  ];

  return (
    <section className={`py-20 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Empowering Coders Worldwide
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
                 <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4"
                >
                    <p className="text-4xl font-bold text-primary">
                        {stat.value}
                    </p>
                    <p className="text-muted-foreground mt-2">{stat.label}</p>
                 </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
