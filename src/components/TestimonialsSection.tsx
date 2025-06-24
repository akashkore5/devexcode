'use client';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const TestimonialsSection = ({ className }: { className?: string }) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-card rounded-xl shadow-md border"
          >
            <p className="italic text-muted-foreground">"DevExCode helped me land my dream job at a FAANG company. The system design guides are top-notch!"</p>
            <p className="mt-4 font-semibold text-foreground">- Alex Johnson</p>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="p-6 bg-card rounded-xl shadow-md border"
          >
            <p className="italic text-muted-foreground">"The daily terms feature is a great way to stay sharp. I've learned so much in just a few minutes each day."</p>
            <p className="mt-4 font-semibold text-foreground">- Samantha Lee</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
