'use client';
import { motion } from 'framer-motion';
import { Session } from 'next-auth';
import { Button } from './ui/button';

type NotificationSignupSectionProps = {
    session: Session | null;
    className?: string;
}

export const NotificationSignupSection = ({ session, className }: NotificationSignupSectionProps) => {
    if (!session) return null;

    return (
        <section className={`py-20 ${className}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl font-bold mb-6"
                >
                    Get Daily Tech Terms
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground"
                >
                    Subscribe to receive a new technical term each day directly via push notifications.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Button size="lg"
                        className="text-lg font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Subscribe Now
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};
