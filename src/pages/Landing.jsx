import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';
import '../styles/HeroPremium.css';

export default function Landing() {
  const navigate = useNavigate();

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
              AI Builder
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
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Premium Hero Section */}
        <section className="hero-premium-container pt-32 pb-40 md:pt-48 md:pb-60 min-h-[90vh] flex items-center relative">
          {/* Backdrop Layers */}
          <div className="hero-mesh-background" />
          <div className="network-overlay" />
          
          {/* Animated Glass Hexagons */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
            <div className="glass-hex w-32 h-32 left-[10%] top-[20%] opacity-40" style={{ animationDelay: '0s' }} />
            <div className="glass-hex w-24 h-24 left-[5%] top-[50%] opacity-30" style={{ animationDelay: '2s' }} />
            <div className="glass-hex w-40 h-40 left-[15%] bottom-[15%] opacity-20" style={{ animationDelay: '4s' }} />
            
            <div className="absolute right-[12%] top-[35%] z-10">
              <div className="text-[12rem] font-black text-white/5 select-none leading-none rotate-12">AI</div>
            </div>
            
            <div className="glass-hex w-20 h-20 right-[25%] top-[15%] opacity-25" style={{ animationDelay: '1s' }} />
            <div className="glass-hex w-28 h-28 right-[10%] bottom-[20%] opacity-35" style={{ animationDelay: '3s' }} />
          </div>

          {/* Central Content Box */}
          <motion.div 
            className="relative z-10 max-w-5xl mx-auto px-6 pt-12 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Glass Panel */}
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
               {/* Inner Glow/Light Streaks */}
               <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
               <div className="absolute bottom-0 right-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
               
               <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black mb-6 glow-text tracking-tight uppercase"
              >
                AI Builder
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-3xl mx-auto"
              >
                Empower Your Innovation with AI-Powered Intelligence.
              </motion.p>
              
              <motion.div 
                variants={itemVariants} 
                className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
              >
                <button 
                  onClick={() => navigate('/features')}
                  className="group text-slate-400 hover:text-white font-medium flex items-center space-x-2 transition-colors"
                >
                  <span>Explore Features</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => navigate('/signup')}
                  className="premium-button-glow px-10 py-5 rounded-full text-lg font-bold text-white shadow-2xl active:scale-95 transition-all"
                >
                  Start Your Free Trial
                </button>

                <button 
                  onClick={() => navigate('/demo')}
                  className="text-slate-400 hover:text-white font-medium flex items-center space-x-2 transition-colors"
                >
                  <span>Book a Demo</span>
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Interactive cursor follow glow (CSS only simplified) */}
          <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(99,102,241,0.4)_0%,transparent_50%)]" />
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
                  className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
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
               {['Startup', 'SaaS', 'Portfolio'].map((t, idx) => (
                 <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-colors">
                   <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center">
                     <Layout className="w-12 h-12 text-slate-800 group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div className="p-4 bg-slate-800/80 absolute bottom-0 w-full backdrop-blur-md border-t border-white/5 font-semibold text-slate-200">
                     {t} Style
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
              <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/10 text-left hover:border-white/20 transition-all">
                <h3 className="text-2xl font-bold mb-2">Hobby</h3>
                <p className="text-slate-400 text-sm mb-6">Perfect for trying out the AI builder.</p>
                <div className="text-4xl font-bold mb-8">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-indigo-400" /><span>3 AI Generations</span></li>
                  <li className="flex items-center space-x-3"><Layout className="w-5 h-5 text-indigo-400" /><span>Basic Templates</span></li>
                  <li className="flex items-center space-x-3"><Zap className="w-5 h-5 text-indigo-400" /><span>HTML Export</span></li>
                </ul>
                <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors">Get Started</button>
              </div>
              
              {/* Pro Tier */}
              <div className="p-8 rounded-[2rem] bg-indigo-600 border border-indigo-400/30 text-left relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all">
                <div className="absolute top-0 right-0 p-3 bg-white/20 rounded-bl-2xl text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">Most Popular</div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-indigo-200 text-sm mb-6">For professional creators and agencies.</p>
                <div className="text-4xl font-bold text-white mb-8">$29<span className="text-lg text-indigo-200 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-sm text-white">
                  <li className="flex items-center space-x-3"><Sparkles className="w-5 h-5 text-indigo-300" /><span>Unlimited AI Generations</span></li>
                  <li className="flex items-center space-x-3"><Globe className="w-5 h-5 text-indigo-300" /><span>AI Redesign & URL Scraping</span></li>
                  <li className="flex items-center space-x-3"><Layers className="w-5 h-5 text-indigo-300" /><span>Premium Component System</span></li>
                </ul>
                <button onClick={() => navigate('/signup')} className="w-full py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-slate-50 transition-colors shadow-xl shadow-indigo-900/20 group-hover:scale-[1.02]">Upgrade to Pro</button>
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
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center bg-slate-950">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-slate-300">AI Builder</span>
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
          © {new Date().getFullYear()} AI Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
