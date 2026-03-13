import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Plus, 
  Clock, 
  Layout, 
  Monitor, 
  Smartphone, 
  Download, 
  Save, 
  Code, 
  Eye,
  RefreshCcw,
  CheckCircle,
  Briefcase,
  User,
  ShoppingBag,
  Utensils,
  Rocket
} from 'lucide-react';
import { generateWebsiteHtml } from '../../ai/generateWebsite';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Generator() {
  const [url, setUrl] = useState('');
  const [template, setTemplate] = useState('Startup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'
  const [device, setDevice] = useState('desktop');
  const [generationTime, setGenerationTime] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    let interval;
    if (loading) {
      setGenerationTime(0);
      interval = setInterval(() => {
        setGenerationTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const templates = [
    { id: 'Startup', icon: <Rocket className="w-5 h-5" />, label: 'Startup' },
    { id: 'SaaS', icon: <ShoppingBag className="w-5 h-5" />, label: 'SaaS' },
    { id: 'Portfolio', icon: <User className="w-5 h-5" />, label: 'Portfolio' },
    { id: 'Restaurant', icon: <Utensils className="w-5 h-5" />, label: 'Restaurant' },
    { id: 'Agency', icon: <Briefcase className="w-5 h-5" />, label: 'Agency' },
  ];

  async function handleGenerate(e) {
    e.preventDefault();
    if (!url) return;

    try {
      setLoading(true);
      setError('');
      setGeneratedHtml('');
      
      // Pass template to AI prompt (we'll need to update generateWebsiteHtml to accept template)
      const html = await generateWebsiteHtml(url, template);
      setGeneratedHtml(html);
      
      const newProject = {
        userID: currentUser.uid,
        websiteUrl: url,
        templateType: template,
        generatedCode: html,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'projects'), newProject);
    } catch (err) {
      setError('Generation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    zip.file("index.html", generatedHtml);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `website-${Date.now()}.zip`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">AI Builder</h1>
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewMode('preview')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${viewMode === 'code' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Code className="w-4 h-4" />
            <span>Edit HTML</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleGenerate} className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Website URL or Name</label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. Acme SaaS or stripe.com"
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-400 ml-1">Template Style</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={`flex items-center space-x-2 p-3 rounded-xl border transition-all text-sm ${template === t.id ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/10'}`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Website</span>
                </>
              )}
            </button>
          </form>

          {loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 text-center space-y-4"
            >
              <p className="text-indigo-400 font-bold animate-pulse">Architecting your masterpiece...</p>
              <div className="flex items-center justify-center space-x-2 text-2xl font-mono text-white">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>{Math.floor(generationTime / 60)}:{generationTime % 60 < 10 ? '0' : ''}{generationTime % 60}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 px-0.5 py-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, ease: "linear" }}
                  className="bg-indigo-500 h-0.5 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {generatedHtml && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3 text-emerald-400 mb-2">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold">Generation Success!</span>
              </div>
              <button 
                onClick={handleDownloadZip}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as ZIP</span>
              </button>
              <button className="w-full bg-white text-slate-950 py-3 rounded-xl flex items-center justify-center space-x-2 font-bold transition-opacity hover:opacity-90">
                <Save className="w-4 h-4" />
                <span>Save to Projects</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Right: Preview/Code Area */}
        <div className="lg:col-span-8 h-[700px] bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <div className="bg-slate-950/50 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="ml-4 text-xs font-mono text-slate-500 uppercase tracking-widest">{viewMode === 'preview' ? 'Live Browser Preview' : 'Source Code Editor'}</span>
            </div>
            
            <AnimatePresence>
              {viewMode === 'preview' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-white/5"
                >
                  <button 
                    onClick={() => setDevice('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDevice('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 bg-[#0f172a] overflow-hidden">
            {viewMode === 'preview' ? (
              <div className={`h-full mx-auto transition-all duration-500 ${device === 'mobile' ? 'max-w-[375px] py-8' : 'w-full'}`}>
                <div className={`h-full bg-white shadow-2xl transition-all duration-500 ${device === 'mobile' ? 'rounded-[3rem] border-[8px] border-slate-800' : ''}`}>
                  {generatedHtml ? (
                    <iframe 
                      srcDoc={generatedHtml} 
                      className="w-full h-full border-none"
                      title="Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600 p-12 text-center">
                      <Layout className="w-20 h-20 mb-6 opacity-20" />
                      <p className="text-xl font-medium mb-2">No design generated yet</p>
                      <p className="text-sm max-w-xs">Enter a URL or business name on the left to start building your professional landing page.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <textarea 
                value={generatedHtml}
                onChange={(e) => setGeneratedHtml(e.target.value)}
                className="w-full h-full bg-[#0f172a] text-indigo-300 font-mono text-sm p-8 focus:outline-none resize-none"
                placeholder="<!-- Generated HTML will appear here -->"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
