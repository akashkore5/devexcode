import React from 'react';
import { UserIcon } from "@heroicons/react/24/solid";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "DevExCode’s Leetcode solutions are incredibly clear and helped me ace my interviews!",
      author: "Aditya Verma, Software Engineer",
    },
    {
      quote: "The system design tutorials are top-notch, making complex concepts easy to grasp.",
      author: "Shreya Malhotra, CS Student",
    },
    {
      quote: "Bahut acha platform hai, coding improve ho rahi hai with daily challenges!",
      author: "Rahul Yadav, Developer",
    },
    {
      quote: "The community forums are fantastic for learning from others and solving tough problems.",
      author: "Megha Singh, Tech Lead",
    },
    {
      quote: "Learning paths provided a structured way to level up my coding skills.",
      author: "Karan Patel, Software Developer",
    },
    {
      quote: "Tech Battles are so engaging, they keep me motivated to code every day!",
      author: "Nisha Sharma, Engineer",
    },
    {
      quote: "Dev Tips ne meri productivity badha di, especially debugging tips!",
      author: "Vivek Gupta, Software Engineer",
    },
    {
      quote: "The daily technical terms feature is a great way to learn something new every day.",
      author: "Siddhant Rao, CS Student",
    },
    {
      quote: "Leetcode explanations are so simple, even beginners can understand them easily.",
      author: "Pooja Desai, Developer",
    },
    {
      quote: "System design guides ne mujhe scalable systems design karna sikhaya, awesome content!",
      author: "Ankit Kumar, Software Engineer",
    },
    {
      quote: "The coding challenges and solutions helped me prepare for my FAANG interviews.",
      author: "Emily Chen, Software Developer",
    },
    {
      quote: "Interview prep resources are a game-changer, highly recommend DevExCode!",
      author: "Riya Jain, Engineer",
    },
  ];

  // Duplicate testimonials for seamless infinite scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
          Voices from Our Community
        </h2>
        <div className="space-y-8">
          {/* Top Row: Scrolls Left */}
          <div className="relative overflow-hidden py-4">
            <div className="flex animate-marquee-left relative">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={`top-testimonial-${index}`}
                  className="w-[300px] h-[250px] flex-shrink-0 mx-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center"
                  aria-label={`Testimonial from ${testimonial.author}`}
                >
                  <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold text-center">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
            {/* Gradient mask for fading edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-slate-900 pointer-events-none" />
          </div>
          {/* Bottom Row: Scrolls Right */}
          <div className="relative overflow-hidden py-4">
            <div className="flex animate-marquee-right relative">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={`bottom-testimonial-${index}`}
                  className="w-[300px] h-[250px] flex-shrink-0 mx-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center"
                  aria-label={`Testimonial from ${testimonial.author}`}
                >
                  <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold text-center">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
            {/* Gradient mask for fading edges */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-900 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-slate-900 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* Inline CSS for animations and fixes */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left 90s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee-right {
          animation: marquee-right 90s linear infinite;
          display: flex;
          width: max-content;
        }
        /* Pause animation on hover for accessibility */
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        /* Ensure shadows are not clipped */
        .relative.overflow-hidden {
          isolation: isolate;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;