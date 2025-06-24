'use client';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const DevTipsSection = ({ className }: { className?: string }) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Micro Dev Tips
        </motion.h2>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Tip of the Day</h3>
          <p>Use `Promise.allSettled` when you need all promises to complete, regardless of success or failure.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default DevTipsSection;
