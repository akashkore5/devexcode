import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BugIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ReportBug({
  buttonClassName = "flex items-center px-4 py-2 rounded-lg shadow-md bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:scale-105",
  buttonText = "Report Bug",
  iconClassName = "w-5 h-5 mr-2",
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [bugReportData, setBugReportData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUrl = `https://devexcode.com${router.asPath}`;

  const validateForm = () => {
    const newErrors = {};
    if (!bugReportData.title.trim()) newErrors.title = "Title is required";
    else if (bugReportData.title.length > 100) newErrors.title = "Title must be 100 characters or less";
    if (!bugReportData.description.trim()) newErrors.description = "Description is required";
    else if (bugReportData.description.length > 1000) newErrors.description = "Description must be 1000 characters or less";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBugReportData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/report-bug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: bugReportData.title,
            description: bugReportData.description,
            url: currentUrl,
            userId: session?.user?.id || null,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to submit bug report");
        }
        setBugReportData({ title: "", description: "" });
        setIsOpen(false);
        toast.success("Bug report submitted successfully!");
      } catch (error) {
        console.error("Error submitting bug report:", error);
        toast.error(error.message || "Failed to submit bug report");
      } finally {
        setIsSubmitting(false);
      }
    },
    [bugReportData, currentUrl, session]
  );

  useEffect(() => {
    if (!isOpen) {
      setBugReportData({ title: "", description: "" });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Report a bug"
      >
        <BugIcon className={iconClassName} />
        {buttonText}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="report-bug-title"
              aria-modal="true"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="report-bug-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Report a Bug
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="bug-title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Bug Title
                  </label>
                  <input
                    type="text"
                    id="bug-title"
                    name="title"
                    value={bugReportData.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-2 px-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    aria-invalid={errors.title ? "true" : "false"}
                    aria-describedby={errors.title ? "title-error" : undefined}
                    maxLength={100}
                  />
                  {errors.title && (
                    <p id="title-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="bug-description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="bug-description"
                    name="description"
                    value={bugReportData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-2 px-3 text-base shadow-sm min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    aria-invalid={errors.description ? "true" : "false"}
                    aria-describedby={errors.description ? "description-error" : undefined}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Page URL: <span className="break-all">{currentUrl}</span></p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium rounded-md transition-colors duration-200"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Submit bug report"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}