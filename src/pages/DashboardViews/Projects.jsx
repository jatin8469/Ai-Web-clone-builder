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
  Edit3,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
  };

  async function confirmDelete() {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete));
      setProjects(projects.filter(p => p.id !== projectToDelete));
      setProjectToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
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
                  <button onClick={() => handleDeleteClick(project.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
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
                      if (project.siteData && project.siteData.pages) {
                        const pageHtml = project.siteData.pages[0].sections?.map(s => s.html).join('\\n') || '';
                        const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${project.siteData.seo?.title || 'Preview'}</title><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>body { font-family: 'Inter', sans-serif; }</style></head><body class="antialiased text-slate-900 bg-white">${pageHtml}</body></html>`;
                        const blob = new Blob([fullHtml], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      } else {
                        const blob = new Blob([project.generatedCode || 'No content generated.'], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      }
                    }}
                    title="Live HTML Preview"
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

      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400 mb-4 mt-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Project</h3>
            <p className="text-slate-400 text-center mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex w-full space-x-3">
              <button 
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
