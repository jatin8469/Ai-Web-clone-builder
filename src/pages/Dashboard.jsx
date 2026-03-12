import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { LogOut, Plus, Globe, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateWebsiteHtml } from '../ai/generateWebsite';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  async function fetchProjects() {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userID', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setProjects(docs);
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Fallback ordered locally if index is missing initially
      try {
        const fallbackQ = query(collection(db, 'projects'), where('userID', '==', currentUser.uid));
        const fbSnap = await getDocs(fallbackQ);
        const fbDocs = [];
        fbSnap.forEach((doc) => fbDocs.push({ id: doc.id, ...doc.data() }));
        fbDocs.sort((a,b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setProjects(fbDocs);
      } catch(e) {
        console.error("Fallback load failed", e);
      }
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!url) return;

    try {
      setLoading(true);
      setError('');
      
      // Generate real HTML using Gemini
      const generatedCode = await generateWebsiteHtml(url);
      
      const newProject = {
        userID: currentUser.uid,
        websiteUrl: url,
        generatedCode: generatedCode,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'projects'), newProject);
      setUrl('');
      fetchProjects();
    } catch (err) {
      setError('Failed to generate website: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <Globe className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">AI Website Builder</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">{currentUser.email}</span>
          <button onClick={handleLogout} className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded p-4 mb-8">{error}</div>}

        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 mb-12 border border-slate-700 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h2 className="text-2xl font-bold mb-2">Create New Project</h2>
          <p className="text-slate-400 mb-6">Paste a website URL to generate a stunning new design powered by AI.</p>
          
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 relative">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 disabled:hidden text-white font-medium py-4 px-8 rounded-xl transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Generate AI Website</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>My Projects</span>
          </h3>
          
          {projects.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50 border-dashed">
              <p className="text-slate-400">No projects generated yet. Start by entering a URL above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors shadow-lg group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-semibold text-lg truncate mb-1" title={project.websiteUrl}>
                    {project.websiteUrl.replace(/^https?:\/\//, '')}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </p>
                  
                  {/* Website Preview Iframe */}
                  <div className="bg-slate-900 rounded-lg overflow-hidden h-40 relative group/preview">
                    <iframe
                      title={`Preview for ${project.websiteUrl}`}
                      srcDoc={project.generatedCode}
                      className="w-full h-[800px] origin-top border-none pointer-events-none transform scale-[0.25] max-w-[400%]"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover/preview:bg-transparent transition-colors duration-300"></div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex space-x-2">
                    <button 
                      onClick={() => {
                        const blob = new Blob([project.generatedCode], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      }}
                      className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-sm py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Live HTML</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
