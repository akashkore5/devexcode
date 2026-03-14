'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Support",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message transmitted successfully!");
    
    setTimeout(() => setIsSuccess(false), 5000);
    setFormData({ name: "", email: "", subject: "Support", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 inline-block">Contact System</span>
              <h1 className="text-5xl sm:text-7xl font-black gradient-text mb-8 leading-tight">
                Let's Build the Future Together.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                Have a proposal, a bug report, or just want to discuss high-level architecture? Our team is standing by.
              </p>
            </div>

            <div className="space-y-8">
               {[
                 { icon: EnvelopeIcon, label: "Direct Inquiries", value: "support@devexcode.com", sub: "Response time: < 24h" },
                 { icon: ChatBubbleBottomCenterTextIcon, label: "Community Forum", value: "community.devexcode.com", sub: "Instant peer support" },
                 { icon: MapPinIcon, label: "Global Presence", value: "Remote / Decentralized", sub: "Serving 15k+ developers" },
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                     <p className="text-lg font-black">{item.value}</p>
                     <p className="text-sm text-muted-foreground font-medium">{item.sub}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="pt-8 border-t border-border flex gap-6">
               <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex-grow">
                 <h4 className="font-black mb-2 flex items-center gap-2">
                   <SparklesIcon className="w-4 h-4 text-primary" />
                   Priority Support
                 </h4>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Are you a FAANG candidate with an upcoming interview? Mention your deadline for priority response.
                 </p>
               </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass dark:glass-dark p-8 sm:p-12 rounded-[50px] border border-white/10 shadow-3xl relative">
              
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-xl z-20 rounded-[50px] flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6">
                      <CheckCircleIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Message Transmitted!</h3>
                    <p className="text-muted-foreground font-medium mb-8">
                      Your inquiry has been logged in our secure processing queue. We'll reach out shortly.
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-2xl px-8 font-black">Send Another</Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Display Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Satoshi Nakamoto"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Communication Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Transmission Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-black appearance-none"
                  >
                    <option>Support</option>
                    <option>Partnership</option>
                    <option>Feedback</option>
                    <option>Security/Bug Report</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Detailed Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Provide as much context as possible..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                  />
                </div>

                <Button 
                   disabled={isSubmitting}
                   className="w-full py-8 rounded-[25px] font-black text-xl group relative overflow-hidden transition-all shadow-2xl shadow-primary/30"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
