import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/solid";

const formVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } },
};

const inputVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } },
  blur: { scale: 1, transition: { duration: 0.2 } },
};

export default function ContactForm({ formData, setFormData, showForm, setShowForm, servicesData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/servicecontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Your request has been sent successfully!", { duration: 5000 });
        setFormData({ name: formData.name, email: formData.email, service: "", message: "" });
        setShowForm(false);
      } else {
        toast.error("Failed to send your request. Please try again.", { duration: 5000 });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className="relative max-w-md sm:max-w-lg w-full bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-indigo-200/50 dark:border-indigo-800/50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="form-title"
            aria-modal="true"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={() => setShowForm(false)}
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 id="form-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Service Request
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Let us help you elevate your career</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Your Name
                </label>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-md px-4 py-3 text-gray-900 dark:text-gray-100 font-medium border border-gray-200 dark:border-slate-700">
                  {formData.name || "User"}
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Select Service
                </label>
                <motion.select
                  name="service"
                  id="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border ${
                    errors.service ? "border-red-500" : "border-gray-300 dark:border-slate-700"
                  } px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors shadow-sm text-sm`}
                  variants={inputVariants}
                  whileFocus="focus"
                >
                  <option value="" disabled>
                    Choose a service
                  </option>
                  {servicesData.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </motion.select>
                {errors.service && (
                  <p className="mt-1 text-xs text-red-500">{errors.service}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Message
                </label>
                <motion.textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full rounded-md bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 border ${
                    errors.message ? "border-red-500" : "border-gray-300 dark:border-slate-700"
                  } px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors shadow-sm text-sm resize-none`}
                  placeholder="Tell us about your needs or specific requirements"
                  variants={inputVariants}
                  whileFocus="focus"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
                  onClick={() => setShowForm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Cancel form"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-semibold text-white shadow-sm transition-colors ${
                    isSubmitting
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  aria-label="Send request"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Send Request"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}