'use client';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const TechBattlesSection = ({ className }: { className?: string }) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          Tech Battles
        </motion.h2>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Upcoming Battle: React vs. Vue</h3>
          <p>Join the live debate and see which framework comes out on top.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechBattlesSection;
