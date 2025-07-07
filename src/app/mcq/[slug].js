import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import mcqTopics from "../../data/mcq_topics.json";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

// Dynamic import of MCQ data based on slug
const loadMCQData = async (slug) => {
  try {
    const data = await import(`../../data/mcq/${slug}_mcq.json`);
    return data.default;
  } catch (error) {
    console.error(`Error loading MCQ data for ${slug}:`, error);
    return [];
  }
};

// Shuffle array for random question selection
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MCQChallengePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { slug } = router.query;

  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolutions, setShowSolutions] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(null); // null means not selected yet
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false); // New lock state

  // Find the topic details from mcq_topics.json
  const topic = mcqTopics.find((t) => t.slug === slug);

  // Load questions
  useEffect(() => {
    if (slug) {
      const loadData = async () => {
        setIsLoading(true);
        const data = await loadMCQData(slug);
        if (data.length === 0) {
          console.warn(`No questions found for slug: ${slug}`);
          toast.error("Failed to load questions. Please try again.");
        }
        setAllQuestions(data);
        setIsLoading(false);
      };
      loadData();
    }
  }, [slug]);

  // Set questions based on quiz type
  useEffect(() => {
    if (allQuestions.length > 0 && topic) {
      if (topic.noOfQuestions === 100 && questionLimit !== null) {
        // Easy/Medium quiz with user-selected limit
        const shuffled = shuffleArray(allQuestions);
        setQuestions(shuffled.slice(0, questionLimit));
        setTimeLeft((questionLimit / 100) * topic.timeInMinutes * 60);
        setIsQuizStarted(true);
      } else if (topic.noOfQuestions !== 100) {
        // Advanced quiz, use all questions
        setQuestions(allQuestions);
        setTimeLeft(topic.timeInMinutes * 60);
        setIsQuizStarted(true);
      }
    }
  }, [allQuestions, questionLimit, topic]);

  // Update session state
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || isQuizFinished || !isQuizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsQuizFinished(true);
          toast.error("Time's up! Quiz finished.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isQuizFinished, isQuizStarted]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle question limit selection
  const handleQuestionLimitSelect = (limit) => {
    setQuestionLimit(limit);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (isActionProcessing || selectedOption || isQuizFinished) return;
    setIsActionProcessing(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    setSelectedOption(option);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast.success("Correct!", { duration: 2000 });
    } else {
      toast.error("Incorrect!", { duration: 2000 });
    }

    setUserAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, selectedOption: option, isCorrect },
    ]);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizFinished(true);
      toast.success("Quiz completed!");
    }
    setIsActionProcessing(false);
  };

  // Handle skip question
  const handleSkip = () => {
    if (isActionProcessing || isQuizFinished) return;
    setIsActionProcessing(true);

    setUserAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, selectedOption: null, isCorrect: false },
    ]);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      toast("Question skipped!", { duration: 2000 });
    } else {
      setIsQuizFinished(true);
      toast.success("Quiz completed!");
    }
    setIsActionProcessing(false);
  };

  // Handle next question
  const handleNext = () => {
    if (isActionProcessing || isQuizFinished) return;
    if (selectedOption) {
      setIsActionProcessing(true);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsQuizFinished(true);
        toast.success("Quiz completed!");
      }
      setIsActionProcessing(false);
    } else {
      toast.error("Please select an option before proceeding!", { duration: 2000 });
    }
  };

  // Handle restart quiz
  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setScore(0);
    setIsQuizFinished(false);
    setShowSolutions(false);
    setQuestionLimit(null);
    setIsQuizStarted(false);
    setIsActionProcessing(false);
  };

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    if (isQuizFinished) return 100;
    return Math.min(((currentQuestionIndex / questions.length) * 100), 100);
  }, [currentQuestionIndex, questions.length, isQuizFinished]);

  // Handle loading or error state
  if (status === "loading" || isLoading || !topic) {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto"
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
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>{`${topic.title} - DevExCode`}</title>
        <meta
          name="description"
          content={`Test your skills with ${topic.noOfQuestions} multiple-choice questions on ${topic.title.split(" ")[0]}.`}
        />
        <meta
          name="keywords"
          content={`${topic.title}, MCQ, interview preparation, coding quiz, DevExCode`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${topic.title} - DevExCode`} />
        <meta
          property="og:description"
          content={`Test your skills with ${topic.noOfQuestions} multiple-choice questions on ${topic.title.split(" ")[0]}.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://devexcode.com/mcq/${slug}`} />
        <meta property="og:image" content="https://devexcode.com/og-image-mcq.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${topic.title} - DevExCode`} />
        <meta
          property="twitter:description"
          content={`Test your skills with ${topic.noOfQuestions} multiple-choice questions on ${topic.title.split(" ")[0]}.`}
        />
        <link rel="canonical" href={`https://devexcode.com/mcq/${slug}`} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#4f46e5" />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-4" }} />

      <section className="py-0 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/interview" prefetch={true}>
              <button
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                aria-label="Back to Interview Preparation"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Interview Prep
              </button>
            </Link>
          </motion.div>

          {/* Question Limit Selection */}
          {!isQuizStarted && topic.noOfQuestions === 100 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Select Number of Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This challenge has 100 questions. Choose how many you want to attempt:
              </p>
              <div className="flex justify-center space-x-4">
                {[20, 50, 100].map((limit) => (
                  <motion.button
                    key={limit}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                    onClick={() => handleQuestionLimitSelect(limit)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Select ${limit} questions`}
                  >
                    {limit} Questions
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quiz Content */}
          {isQuizStarted && (
            <>
              {/* Header */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="text-center mb-8"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {topic.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{topic.description}</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <ClockIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    <span>Time Left: {formatTime(timeLeft)}</span>
                  </div>
                  <div className="text-gray-700 dark:text-gray-200">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="text-gray-700 dark:text-gray-200">Score: {score}</div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Progress: {Math.round(progressPercentage)}%
                  </p>
                </div>
              </motion.div>

              {/* Quiz Finished State */}
              {isQuizFinished ? (
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quiz Completed!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your final score: {score} out of {questions.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Percentage: {((score / questions.length) * 100).toFixed(2)}%
                  </p>
                  <div className="flex justify-center space-x-4">
                    <motion.button
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                      onClick={() => setShowSolutions(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="View Solutions"
                    >
                      View Solutions
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                      onClick={handleRestart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Restart Quiz"
                    >
                      Restart Quiz
                    </motion.button>
                    <Link href="/interview" prefetch={true}>
                      <motion.button
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Back to Interview Preparation"
                      >
                        Back to Interview Prep
                      </motion.button>
                    </Link>
                  </div>

                  {/* Solutions View */}
                  {showSolutions && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Solutions
                      </h3>
                      {questions.map((question, index) => {
                        const userAnswer = userAnswers.find(
                          (ans) => ans.questionIndex === index
                        );
                        return (
                          <motion.div
                            key={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-gray-100 dark:bg-slate-700 rounded-lg p-6 mb-4"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Question {index + 1}: {question.question}
                            </h4>
                            {question.code && (
                              <pre className="bg-gray-800 text-white p-4 rounded-lg mt-2 overflow-x-auto">
                                <code>{question.code}</code>
                              </pre>
                            )}
                            <div className="mt-4">
                              {question.options.map((option, optIndex) => {
                                const isCorrect = option === question.correctAnswer;
                                const isSelected = userAnswer?.selectedOption === option;
                                let bgColor = "bg-gray-200 dark:bg-slate-600";
                                if (isCorrect) {
                                  bgColor = "bg-green-100 dark:bg-green-900";
                                } else if (isSelected && !isCorrect) {
                                  bgColor = "bg-red-100 dark:bg-red-900";
                                }
                                return (
                                  <div
                                    key={optIndex}
                                    className={`p-3 rounded-lg ${bgColor} text-gray-900 dark:text-gray-200 mb-2 flex items-center`}
                                  >
                                    {option}
                                    {isCorrect && (
                                      <CheckCircleIcon className="w-5 h-5 ml-2 text-green-600 dark:text-green-400" />
                                    )}
                                    {isSelected && !isCorrect && (
                                      <XCircleIcon className="w-5 h-5 ml-2 text-red-600 dark:text-red-400" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {question.explanation && (
                              <p className="text-gray-600 dark:text-gray-300 mt-4">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : !currentQuestion ? (
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    No Questions Available
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    There was an issue loading the questions. Please try again.
                  </p>
                  <Link href="/interview" prefetch={true}>
                    <motion.button
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Back to Interview Preparation"
                    >
                      Back to Interview Prep
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8"
                >
                  {/* Question */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.code && (
                    <pre className="bg-gray-800 text-white p-4 rounded-lg mb-4 overflow-x-auto">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={`p-4 rounded-lg text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          selectedOption === option
                            ? option === currentQuestion.correctAnswer
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 border-gray-300 dark:border-slate-600"
                        } border`}
                        onClick={() => handleOptionSelect(option)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleOptionSelect(option);
                          }
                        }}
                        disabled={isActionProcessing || selectedOption}
                        whileHover={{ scale: isActionProcessing || selectedOption ? 1 : 1.02 }}
                        whileTap={{ scale: isActionProcessing || selectedOption ? 1 : 0.98 }}
                        tabIndex={0}
                        aria-label={`Select option ${option}`}
                      >
                        {option}
                        {selectedOption === option && (
                          <span className="ml-2">
                            {option === currentQuestion.correctAnswer ? (
                              <CheckCircleIcon className="w-5 h-5 inline text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 inline text-red-600 dark:text-red-400" />
                            )}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Skip and Next Buttons */}
                  <div className="flex justify-between mt-6">
                    <motion.button
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition shadow-md focus:outline-none focus:ring-2 focusMinMax focus:ring-yellow-500"
                      onClick={handleSkip}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSkip();
                        }
                      }}
                      whileHover={{ scale: isActionProcessing ? 1 : 1.05 }}
                      whileTap={{ scale: isActionProcessing ? 1 : 0.95 }}
                      tabIndex={0}
                      aria-label="Skip Question"
                      disabled={isActionProcessing}
                    >
                      Skip
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={handleNext}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleNext();
                        }
                      }}
                      whileHover={{ scale: isActionProcessing ? 1 : 1.05 }}
                      whileTap={{ scale: isActionProcessing ? 1 : 0.95 }}
                      tabIndex={0}
                      aria-label="Next Question"
                      disabled={isActionProcessing}
                    >
                      Next
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}