'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DocumentTextIcon, 
  GlobeAltIcon, 
  UserCircleIcon, 
  ClipboardDocumentCheckIcon, 
  LightBulbIcon, 
  AcademicCapIcon, 
  CodeBracketIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const services = [
  {
    title: "Professional Resume Creation",
    slug: "resume-creation",
    description: "Craft ATS-optimized resumes tailored for tech roles to stand out in job applications.",
    details: "Our experts create a professional, ATS-friendly resume highlighting your technical skills and experience. Includes custom formatting and keyword optimization.",
    timePeriod: "3-5 business days",
    icon: DocumentTextIcon,
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Resume for Abroad Jobs",
    slug: "resume-abroad",
    description: "Design resumes optimized for international tech markets and global hiring standards.",
    details: "Tailored resumes for global job markets, adhering to international standards with region-specific formatting and cultural nuances.",
    timePeriod: "4-7 business days",
    icon: GlobeAltIcon,
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "LinkedIn Profile Optimization",
    slug: "linkedin-optimization",
    description: "Enhance your LinkedIn profile to attract recruiters and showcase your skills.",
    details: "Optimize your LinkedIn profile with a professional headline, summary, and keyword-rich content to boost visibility and recruiter engagement.",
    timePeriod: "2-4 business days",
    icon: UserCircleIcon,
    color: "from-indigo-500 to-blue-600"
  },
  {
    title: "Resume Review & Enhancement",
    slug: "resume-review",
    description: "Get expert feedback and improvements to make your resume shine.",
    details: "Detailed review with actionable feedback to improve structure, content, and impact, plus enhancements to align with industry standards.",
    timePeriod: "2-3 business days",
    icon: ClipboardDocumentCheckIcon,
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Career Guidance",
    slug: "career-guidance",
    description: "Personalized advice on career planning, job search, and professional growth.",
    details: "One-on-one sessions to develop a career roadmap, job search strategies, and tips for long-term professional success in tech.",
    timePeriod: "1-2 sessions (1 hour each)",
    icon: LightBulbIcon,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "One-on-One Classes",
    slug: "one-on-one",
    description: "Customized coaching on coding, system design, and technical topics for all levels.",
    details: "Personalized coaching sessions covering coding, system design, or specific technical topics, tailored to your skill level and goals.",
    timePeriod: "Customizable (1-10 sessions)",
    icon: AcademicCapIcon,
    color: "from-rose-500 to-red-600"
  },
  {
    title: "Interview Preparation",
    slug: "interview-prep",
    description: "Comprehensive prep with mock interviews and tailored strategies for tech roles.",
    details: "Mock interviews, feedback, and strategies to excel in coding, system design, and behavioral interviews for top tech companies.",
    timePeriod: "2-5 sessions (1 hour each)",
    icon: CodeBracketIcon,
    color: "from-cyan-500 to-blue-600"
  },
];

export default function ServicesClient() {
  const { data: session } = useSession();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to request a service");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Enquiry sent successfully! Our team will contact you soon.");
    setIsSubmitting(false);
    setSelectedService(null);
    setFormData({ message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Strategic Career Acceleration
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black gradient-text mb-8 tracking-tighter"
          >
            Elevate Your Career.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium leading-relaxed"
          >
            Bespoke engineering career services designed to help you land high-impact roles at top-tier tech companies. From ATS-optimized resumes to staff-level system design coaching.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="premium-card group p-10 rounded-[40px] border border-border/50 hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              
              <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${service.color} p-[1px] mb-8`}>
                <div className="w-full h-full bg-card rounded-[21px] flex items-center justify-center text-primary group-hover:bg-transparent group-hover:text-white transition-all duration-500">
                  <service.icon className="w-8 h-8" />
                </div>
              </div>

              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{service.timePeriod}</span>
                <Button 
                  onClick={() => setSelectedService(service)}
                  variant="ghost" 
                  className="rounded-2xl font-black gap-2 hover:bg-primary hover:text-white transition-all"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Career Trust Section */}
        <div className="premium-card p-12 sm:p-20 rounded-[56px] border border-primary/20 bg-primary/[0.02] text-center relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
           <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black mb-8 tracking-tighter">Ready to take the next leap?</h2>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto mb-12">
                Join 500+ engineers who transformed their career trajectories with DevExCode. 
                Our experts come from FAANG, high-growth startups, and specialized tech consulting.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                 {/* Reusing existing badge or just text for speed */}
                 <span className="text-2xl font-black tracking-widest uppercase">Meta</span>
                 <span className="text-2xl font-black tracking-widest uppercase">Amazon</span>
                 <span className="text-2xl font-black tracking-widest uppercase">Google</span>
                 <span className="text-2xl font-black tracking-widest uppercase">Netflix</span>
                 <span className="text-2xl font-black tracking-widest uppercase">Airbnb</span>
              </div>
           </div>
        </div>

      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-modern rounded-[48px] border border-white/10 shadow-3xl p-8 sm:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-8 right-8 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center text-white shadow-xl`}>
                  <selectedService.icon className="w-10 h-10" />
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{selectedService.timePeriod}</span>
                   <h2 className="text-3xl font-black tracking-tight">{selectedService.title}</h2>
                </div>
              </div>

              <div className="space-y-8 mb-12">
                 <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/20">
                    <p className="text-lg font-bold leading-relaxed">
                      {selectedService.details}
                    </p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Message for our experts</label>
                      <textarea 
                        required
                        placeholder="Tell us about your background and goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full min-h-[150px] p-6 rounded-[32px] bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium transition-all"
                      />
                    </div>
                    <Button 
                      disabled={isSubmitting}
                      className="w-full rounded-[24px] py-10 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all"
                    >
                      {isSubmitting ? 'Inquiring...' : 'Send Career Inquiry'}
                    </Button>
                 </form>
              </div>

              <div className="flex items-center justify-center gap-3 text-muted-foreground text-xs font-black uppercase tracking-widest">
                 <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                 Secure Career Consultation Request
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
