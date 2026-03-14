import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Zap, 
  Layout, 
  Shield, 
  ArrowRight, 
  Github, 
  Twitter, 
  Monitor, 
  Smartphone,
  Layers,
  Sparkles,
  X,
  Download
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const VideoModal = () => (
    <AnimatePresence>
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-10"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-slate-900/80 to-transparent flex items-center justify-between px-6 z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-200">AI Website Builder Platform Demo</span>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href="/demo-walkthrough.webp" 
                  download="AI-Builder-Demo.webp"
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Content */}
            <div className="w-full h-full pt-16">
              <img 
                src="/demo-walkthrough.webp" 
                alt="AI Website Builder Demo Walkthrough" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Tap anywhere outside to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI Website Builder
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
          </div>

          <motion.div 
            className="max-w-5xl mx-auto px-6 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Generation AI Website Builder</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
            >
              The AI that builds <br />
              <span className="bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent">
                Exceptional Websites
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Transform any URL or business idea into a premium, responsive landing page in seconds. Powered by Gemeni 1.5 Pro and full Tailwind support.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="btn-gradient w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center space-x-2 group"
              >
                <span>Try it for free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowVideoModal(true)}
                className="glass-button w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-semibold flex items-center justify-center space-x-2 text-slate-300 hover:text-white"
              >
                <Monitor className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Abstract Preview Image */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-6xl mx-auto px-6 mt-20 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-4">
                <div className="inline-block p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-left font-mono text-sm text-indigo-400 animate-pulse">
                    &gt; AI is generating your design...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for clarity and speed.</h2>
              <p className="text-slate-400">Everything you need to ship high-quality landing pages in record time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Lightning Fast",
                  desc: "Generate full-featured landing pages in under 30 seconds with Gemini 1.5 Flash optimization."
                },
                {
                  icon: <Layout className="w-6 h-6" />,
                  title: "Responsive by Design",
                  desc: "Tailwind powered layouts that work perfectly on mobile, tablet, and high-res desktops."
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "Modern Stack",
                  desc: "Uses the same components as leading SaaS products: React, Glassmorphism, and Framer Motion."
                },
                {
                  icon: <Smartphone className="w-6 h-6" />,
                  title: "Visual Previews",
                  desc: "See your site in real-time inside our interactive sandbox before you hit export."
                },
                {
                  icon: <ArrowRight className="w-6 h-6" />,
                  title: "Clean Code",
                  desc: "No bloat. Just clean, optimized HTML and CSS that is easy to customize and deploy."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Enterprise Ready",
                  desc: "Secure Firebase authentication and dedicated project history for your entire workflow."
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="premium-card p-8 group"
                >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-indigo-500/25">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Preview Section */}
        <section id="templates" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Stunning Templates</h2>
            <p className="text-slate-400 mb-12">Start with a premium layout and let AI make it your own.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
               {[
                 { name: 'Startup', image: '/startup_template.png' },
                 { name: 'SaaS', image: '/saas_template.png' },
                 { name: 'Portfolio', image: '/portfolio_template.png' }
               ].map((t, idx) => (
                 <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20">
                   <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden flex items-center justify-center">
                     <img src={t.image} alt={`${t.name} Template`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                   </div>
                   <div className="p-4 bg-slate-900/90 absolute bottom-0 w-full backdrop-blur-md border-t border-white/10 font-semibold text-slate-200 flex items-center justify-between transition-colors group-hover:bg-slate-800/90 group-hover:text-white">
                     <span>{t.name} Style</span>
                     <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="w-4 h-4 text-indigo-400 -rotate-45 group-hover:rotate-0 transition-transform" />
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-slate-400 mb-16">Start for free, upgrade when you need more power.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Tier */}
              <div className="premium-glass-card p-8 text-left">
                <h3 className="text-2xl font-bold mb-2">Hobby</h3>
                <p className="text-slate-400 text-sm mb-6">Perfect for trying out the AI website builder.</p>
                <div className="text-4xl font-bold mb-8">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-indigo-400" /><span>3 AI Generations</span></li>
                  <li className="flex items-center space-x-3"><Layout className="w-5 h-5 text-indigo-400" /><span>Basic Templates</span></li>
                  <li className="flex items-center space-x-3"><Zap className="w-5 h-5 text-indigo-400" /><span>HTML Export</span></li>
                </ul>
                <button onClick={() => navigate('/signup')} className="glass-button w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center">Get Started</button>
              </div>
              
              {/* Pro Tier */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-b from-indigo-600 to-indigo-900 border border-indigo-400/50 text-left relative overflow-hidden group shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-3 bg-white/20 rounded-bl-2xl text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">Most Popular</div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-indigo-200 text-sm mb-6">For professional creators and agencies.</p>
                <div className="text-4xl font-bold text-white mb-8">$29<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-sm text-white">
                  <li className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-indigo-300" /><span>Unlimited AI Generations</span></li>
                  <li className="flex items-center space-x-3"><Globe className="w-5 h-5 text-indigo-300" /><span>AI Redesign & URL Scraping</span></li>
                  <li className="flex items-center space-x-3"><Layers className="w-5 h-5 text-indigo-300" /><span>Premium Component System</span></li>
                </ul>
                <button onClick={() => navigate('/signup')} className="btn-gradient w-full py-3 rounded-xl font-bold before:bg-white before:text-indigo-600 shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/50 text-white">Upgrade to Pro</button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative">Ready to skip <br /> the coding?</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative opacity-90">
                Join 5,000+ creators building beautiful websites with AI. No credit card required to start.
              </p>
              
              <button 
                onClick={() => navigate('/signup')}
                className="bg-white text-indigo-600 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-50 transition-all shadow-2xl relative active:scale-95"
              >
                Build My Site Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <VideoModal />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-slate-300">AI Website Builder</span>
          </div>
          
          <div className="flex space-x-8 text-sm text-slate-500 mb-6 md:mb-0">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Security</a>
          </div>

          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-slate-600">
          © {new Date().getFullYear()} AI Website Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
