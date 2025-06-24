'use client';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { signIn } from 'next-auth/react';

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'signin' | 'register';
    onLoginSuccess: () => void;
}

export const LoginModal = ({ isOpen, onClose, initialMode, onLoginSuccess }: LoginModalProps) => {
    if (!isOpen) return null;
    
    const handleGoogleSignIn = async () => {
        const result = await signIn('google', { redirect: false });
        if (result?.ok) {
            onLoginSuccess();
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">{initialMode === 'signin' ? 'Sign In' : 'Register'}</h2>
                <button onClick={handleGoogleSignIn} className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-md">
                    Sign in with Google
                </button>
            </motion.div>
        </motion.div>
    );
}
