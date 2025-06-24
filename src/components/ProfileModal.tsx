'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

type ProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

export const ProfileModal = ({ isOpen, onClose, isMobile }: ProfileModalProps) => {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-16 right-4 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-50 border dark:border-slate-700"
                    onMouseLeave={onClose}
                >
                    <div className="py-1">
                        <div className="px-4 py-2 border-b dark:border-slate-700">
                            <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                        <Link href="/profile" onClick={onClose} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                            Profile
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            Sign Out
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
