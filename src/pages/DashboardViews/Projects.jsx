import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Layers,
  Search,
  MoreVertical,
  Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  async function fetchProjects() {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userID', '==', currentUser.uid)
      );
      const snap = await getDocs(q);
      const docs = [];
      snap.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
      
      // Sort manually to avoid Firebase composite index requirement
      docs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setProjects(docs);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const getPreviewHtml = (project) => {
    if (project.siteData) {
      const pageHtml = project.siteData.pages?.[0]?.sections?.map(s => s.html).join('\n') || '';
      return `<html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-white">${pageHtml}</body></html>`;
    }
    return project.generatedCode || '';
  };

  async function handleDelete(projectId) {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-slate-400">Manage and view all your generated websites.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-slate-900 border border-white/5 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/50 rounded-[3rem] border border-white/5 border-dashed">
          <Layers className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-lg text-slate-400 mb-6">You haven't built any websites yet.</p>
          <button onClick={() => navigate('/builder')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all">Build Your First Site</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Preview Proxy */}
              <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                <iframe 
                  srcDoc={getPreviewHtml(project)} 
                  title={project.id}
                  className="w-full h-[800px] origin-top border-none pointer-events-none scale-[0.22] opacity-40 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className="text-[10px] font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-md uppercase tracking-tighter">
                    {project.templateType || 'Standard'}
                  </div>
                </div>
              </div>

              <div className="p-6 relative z-20">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-white truncate max-w-[180px]" title={project.websiteUrl}>
                    {project.websiteUrl}
                  </h3>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{project.createdAt?.toDate()?.toLocaleDateString() || 'Just now'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                  onClick={() => navigate(`/builder/${project.id}`)}
                  className="flex-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white py-2.5 rounded-xl transition-all text-sm font-bold flex items-center justify-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit in Builder</span>
                  </button>
                  <button 
                    onClick={() => {
                      const source = project.siteData ? '<div>New Builder Output (Export coming soon)</div>' : project.generatedCode;
                      const blob = new Blob([source], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    title="Live Preview HTML"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
