import { motion } from "framer-motion";
import { BellIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { memo } from "react";

// Notification Signup Section: Prompts authenticated users to subscribe to daily technical term notifications via a popup and provides a final CTA for all users to subscribe.
function NotificationSignupSection({
  session,
  showNotificationPrompt,
  setShowNotificationPrompt,
  hasDismissedPrompt,
  handleDismissPrompt,
  subscribeToNotifications,
}) {
  return (
    <>
      {/* Notification Prompt: Shown to authenticated users who haven’t subscribed and haven’t dismissed the prompt. */}
      {showNotificationPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl max-w-sm z-50 border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center mb-4">
            <BellIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily TechBit</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Subscribe to receive daily technical terms directly to your device.
          </p>
          <div className="flex justify-end gap-3">
            <motion.button
              onClick={handleDismissPrompt}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Dismiss notification prompt"
            >
              Not Now
            </motion.button>
            <motion.button
              onClick={async () => {
                try {
                  const success = await subscribeToNotifications(session?.user?.id);
                  if (success) {
                    setShowNotificationPrompt(false);
                    toast.success("Subscribed to daily TechBit notifications!");
                  }
                } catch (error) {
                  toast.error(error.message || "Failed to subscribe");
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Enable daily TechBit notifications"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Notification Signup: Final CTA for all users to subscribe to daily notifications. */}
      <section className="py-16 bg-indigo-50 dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Get Daily TechBit Notifications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          >
            Receive daily push notifications for new technical terms directly on your mobile or laptop.
          </motion.p>
          <motion.button
            onClick={async () => {
              try {
                const success = await subscribeToNotifications(session?.user?.id || "anonymous");
                if (success) {
                  toast.success("Subscribed to daily TechBit notifications!");
                }
              } catch (error) {
                toast.error(error.message || "Failed to subscribe");
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Subscribe to daily TechBit notifications"
          >
            Subscribe to Notifications
          </motion.button>
        </div>
      </section>
    </>
  );
}

export default memo(NotificationSignupSection);