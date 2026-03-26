"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "../../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

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

export default function MCQChallengeClient({ topic, initialQuestions }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  useEffect(() => {
    if (initialQuestions.length > 0 && topic) {
      if (topic.noOfQuestions === 100 && questionLimit !== null) {
        const shuffled = shuffleArray(initialQuestions);
        setQuestions(shuffled.slice(0, questionLimit));
        setTimeLeft((questionLimit / 100) * topic.timeInMinutes * 60);
        setIsQuizStarted(true);
      } else if (topic.noOfQuestions !== 100) {
        setQuestions(initialQuestions);
        setTimeLeft(topic.timeInMinutes * 60);
        setIsQuizStarted(true);
      }
    }
  }, [initialQuestions, questionLimit, topic]);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleQuestionLimitSelect = (limit) => {
    setQuestionLimit(limit);
  };

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
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsActionProcessing(false);
      }, 1000);
    } else {
      setIsQuizFinished(true);
      toast.success("Quiz completed!");
      setIsActionProcessing(false);
    }
  };

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

  const handleRestart = () => {
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

  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    if (isQuizFinished) return 100;
    return Math.min(((currentQuestionIndex / questions.length) * 100), 100);
  }, [currentQuestionIndex, questions.length, isQuizFinished]);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-4" }} />

      <section className="py-0 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/interview">
              <button
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
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
              <div className="flex justify-center flex-wrap gap-4">
                {[20, 50, 100].map((limit) => (
                  <motion.button
                    key={limit}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                    onClick={() => handleQuestionLimitSelect(limit)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                    <ClockIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    <span>Time: {formatTime(timeLeft)}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm text-gray-700 dark:text-gray-200">
                    Score: {score}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-6 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="bg-indigo-600 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>
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
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Quiz Completed!
                  </h2>
                  <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                    {score} / {questions.length}
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Your Score: {((score / questions.length) * 100).toFixed(0)}%
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <motion.button
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                      onClick={() => setShowSolutions(!showSolutions)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showSolutions ? "Hide Solutions" : "View Solutions"}
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                      onClick={handleRestart}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Restart Quiz
                    </motion.button>
                  </div>

                  {showSolutions && (
                    <div className="mt-12 text-left space-y-6">
                      <h3 className="text-2xl font-bold mb-6">Solutions</h3>
                      {questions.map((question, index) => {
                        const userAnswer = userAnswers.find(
                          (ans) => ans.questionIndex === index
                        );
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-200 dark:border-slate-600">
                            <h4 className="font-bold text-lg mb-4">Q{index + 1}: {question.question}</h4>
                            {question.code && (
                              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm mb-4 overflow-x-auto">
                                <code>{question.code}</code>
                              </pre>
                            )}
                            <div className="space-y-2">
                              {question.options.map((opt, i) => {
                                const isCorrect = opt === question.correctAnswer;
                                const isSelected = userAnswer?.selectedOption === opt;
                                return (
                                  <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 ${
                                    isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-100' :
                                    isSelected ? 'bg-rose-100 dark:bg-rose-900/40 border-rose-500 text-rose-900 dark:text-rose-100' :
                                    'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600'
                                  }`}>
                                    {isCorrect && <CheckCircleIcon className="w-5 h-5 text-emerald-600" />}
                                    {isSelected && !isCorrect && <XCircleIcon className="w-5 h-5 text-rose-600" />}
                                    <span className="flex-1">{opt}</span>
                                  </div>
                                );
                              })}
                            </div>
                            {question.explanation && (
                              <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 rounded-lg text-sm">
                                <strong>Explanation:</strong> {question.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : currentQuestion ? (
                 <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.code && (
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg mb-6 overflow-x-auto font-mono text-sm leading-relaxed">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={`p-4 rounded-xl text-left border-2 transition-all ${
                          selectedOption === option
                            ? option === currentQuestion.correctAnswer
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                              : "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-900 dark:text-rose-200"
                            : "bg-gray-50 dark:bg-slate-700/50 border-transparent hover:border-indigo-400"
                        }`}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isActionProcessing || selectedOption !== null}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedOption === option && (
                            <span>
                              {option === currentQuestion.correctAnswer ? (
                                <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                              ) : (
                                <XCircleIcon className="w-6 h-6 text-rose-500" />
                              )}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8 gap-4">
                    <motion.button
                      className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold"
                      onClick={handleSkip}
                      disabled={isActionProcessing || selectedOption !== null}
                    >
                      Skip
                    </motion.button>
                    {selectedOption && currentQuestionIndex + 1 >= questions.length && (
                         <motion.button
                         className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold"
                         onClick={() => setIsQuizFinished(true)}
                       >
                         Finish Quiz
                       </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
