import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Github, Linkedin, Instagram } from "../components/SocialIcons";
import emailjs from "@emailjs/browser";
import { MagneticButton } from "../components/MagneticButton";

export const Contact = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // EmailJS credentials placeholders
  // Users can create a .env file and write VITE_EMAILJS_SERVICE_ID, etc.
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // If the user hasn't configured EmailJS keys, trigger a mock success response so the UI stays fully testable
    if (SERVICE_ID === "YOUR_SERVICE_ID" || TEMPLATE_ID === "YOUR_TEMPLATE_ID" || PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      console.warn(
        "EmailJS: Service, Template, or Public Key is not configured. Simulating mock success response."
      );
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        formRef.current?.reset();
      }, 1500);
      return;
    }

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(
        (result) => {
          setLoading(false);
          setSuccess(true);
          formRef.current?.reset();
        },
        (error) => {
          console.error("EmailJS Error:", error.text);
          setLoading(false);
          setError(true);
        }
      );
  };

  return (
    <section id="contact" className="relative py-24 border-t border-zinc-900 bg-matte-black/25">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            09 / Communication
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Contact Me
          </h2>
        </div>

        {/* Form and info details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Glass Details Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 text-left">
            <div className="space-y-6">
              <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                Let's construct <br />something premium.
              </h3>
              <p className="text-zinc-400 font-sans text-sm md:text-base font-light leading-relaxed">
                If you are looking for a dedicated full-stack developer to construct a SaaS system, a responsive business application, or collaborate on a project, drop a message.
              </p>
            </div>

            {/* Communication Details list */}
            <div className="space-y-4 pt-4 border-t border-zinc-900/60">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-electric-blue flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Email</h4>
                  <a href="mailto:dipeshjangir12@gmail.com" className="text-sm md:text-md text-white hover:text-electric-blue transition-colors font-sans font-light">
                    dipeshjangir12@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-electric-blue flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Phone</h4>
                  <a href="tel:+917742111581" className="text-sm md:text-md text-white hover:text-electric-blue transition-colors font-sans font-light">
                    +91 7742111581
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-electric-blue flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Based In</h4>
                  <span className="text-sm md:text-md text-white font-sans font-light">
                    Phagwara, Jalandhar, Punjab, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social Panel */}
            <div className="flex items-center gap-3 pt-6 border-t border-zinc-900/60">
              <a href="https://github.com/dipeshjaengir" target="_blank" rel="noopener noreferrer">
                <MagneticButton range={15}>
                  <div className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                    <Github className="w-4.5 h-4.5" />
                  </div>
                </MagneticButton>
              </a>
              <a href="https://www.linkedin.com/in/dipesh-jangir-o7336" target="_blank" rel="noopener noreferrer">
                <MagneticButton range={15}>
                  <div className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                    <Linkedin className="w-4.5 h-4.5" />
                  </div>
                </MagneticButton>
              </a>
              <a href="https://instagram.com/_dipesh2.0" target="_blank" rel="noopener noreferrer">
                <MagneticButton range={15}>
                  <div className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                    <Instagram className="w-4.5 h-4.5" />
                  </div>
                </MagneticButton>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.form
                    key="contact-form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Row 1: Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                          Name
                        </label>
                        <input
                          type="text"
                          name="user_name"
                          required
                          placeholder="Your Name"
                          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 px-4 text-white text-sm font-sans font-light placeholder-zinc-600 focus:outline-none focus:border-electric-blue/50 focus:bg-zinc-900 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="user_email"
                          required
                          placeholder="name@company.com"
                          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 px-4 text-white text-sm font-sans font-light placeholder-zinc-600 focus:outline-none focus:border-electric-blue/50 focus:bg-zinc-900 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 2: Subject */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="Project Collaboration, Hiring opportunity, etc."
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 px-4 text-white text-sm font-sans font-light placeholder-zinc-600 focus:outline-none focus:border-electric-blue/50 focus:bg-zinc-900 transition-all"
                      />
                    </div>

                    {/* Row 3: Message */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="5"
                        placeholder="Tell me about your ideas, deliverables, timeline, or requirements..."
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl py-3 px-4 text-white text-sm font-sans font-light placeholder-zinc-600 focus:outline-none focus:border-electric-blue/50 focus:bg-zinc-900 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <MagneticButton range={20} className="w-full md:w-auto">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center justify-center gap-2 py-3.5 px-7 bg-electric-blue hover:bg-blue-600 disabled:bg-blue-800 text-white font-medium rounded-xl text-xs md:text-sm shadow-lg shadow-electric-blue/10 hover:shadow-electric-blue/20 transition-all w-full md:w-auto cursor-pointer"
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending message...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Message</span>
                            </>
                          )}
                        </button>
                      </MagneticButton>
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs font-mono">
                        Error delivering message. Please email directly.
                      </p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-screen"
                    className="flex flex-col items-center justify-center text-center py-12 space-y-4 select-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full animate-bounce">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-zinc-400 font-sans text-xs md:text-sm font-light max-w-sm">
                      Thank you for reaching out, Dipesh has received your message and will respond shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-xs text-electric-blue hover:text-blue-400 font-mono tracking-widest uppercase font-semibold underline cursor-pointer pt-4"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
