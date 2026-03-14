'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CodeBracketIcon, 
  RocketLaunchIcon, 
  PuzzlePieceIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

const mockTypes = [
  {
    title: "Coding Interview",
    description: "Practice solving algorithmic problems under time constraints with real-time feedback.",
    icon: CodeBracketIcon,
    color: "from-emerald-500 to-teal-600",
    link: "/leetcode/75"
  },
  {
    title: "System Design Interview",
    description: "Design scalable systems and discuss architecture with expert guidance from staff engineers.",
    icon: RocketLaunchIcon,
    color: "from-blue-500 to-indigo-600",
    link: "/system-design"
  },
  {
    title: "Behavioral Interview",
    description: "Prepare for soft-skill rounds with mock scenarios and feedback on your STAR method delivery.",
    icon: PuzzlePieceIcon,
    color: "from-purple-500 to-pink-600",
    link: "/interview/tips"
  }
];

export default function MockInterviewsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    interviewType: "coding",
    preferredDate: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to schedule a mock interview");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Mock interview request received! We'll reach out within 24 hours.");
    setIsSubmitting(false);
    setFormData({ interviewType: "coding", preferredDate: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/interview">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <CalendarIcon className="w-4 h-4" />
            Live Tactical Simulations
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black gradient-text mb-8 tracking-tighter"
          >
            Mock Interviews.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium leading-relaxed"
          >
            Practice in a high-fidelity environment. Get real feedback from engineers at top companies like Google, Meta, and Netflix.
          </motion.p>
        </div>

        {/* Mock Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {mockTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group p-10 rounded-[48px] border border-border/50 hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              
              <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${type.color} flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <type.icon className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black mb-4">{type.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-10">
                {type.description}
              </p>

              <Link href={type.link}>
                <Button variant="outline" className="w-full rounded-2xl font-black py-7 group-hover:bg-primary group-hover:text-white transition-all">
                  View Syllabus
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Schedule Form */}
        <div className="max-w-4xl mx-auto">
           <div className="glass-modern p-10 sm:p-20 rounded-[56px] border border-white/10 shadow-3xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="text-center mb-12">
                   <h2 className="text-4xl font-black mb-4 tracking-tighter">Schedule Your Session</h2>
                   <p className="text-muted-foreground font-medium">Select your track and preferred timeline. We'll match you with the best available mentor.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Interview Type</label>
                         <select 
                           value={formData.interviewType}
                           onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                           className="w-full p-6 rounded-[24px] bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none font-black transition-all appearance-none"
                         >
                           <option value="coding">Coding Interview</option>
                           <option value="system-design">System Design</option>
                           <option value="behavioral">Behavioral / Leadership</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Preferred Date</label>
                         <input 
                           type="date"
                           required
                           value={formData.preferredDate}
                           onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                           className="w-full p-6 rounded-[24px] bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none font-black transition-all"
                         />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-3 block">Current Target Companies</label>
                         <textarea 
                           placeholder="e.g. Google, Meta, Stripe..."
                           value={formData.message}
                           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                           className="w-full min-h-[168px] p-6 rounded-[32px] bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none font-medium transition-all"
                         />
                       </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                       <Button 
                         disabled={isSubmitting}
                         className="w-full rounded-[24px] py-10 text-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                       >
                         {isSubmitting ? 'Processing Request...' : (
                           <>
                             <PaperAirplaneIcon className="w-6 h-6" />
                             Initialize Tactical Session
                           </>
                         )}
                       </Button>
                    </div>
                 </form>

                 <div className="mt-12 flex items-center justify-center gap-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    Staffed by FAANG Engineers
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
