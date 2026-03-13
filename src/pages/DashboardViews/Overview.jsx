import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Zap, 
  History, 
  Layers, 
  Clock, 
  ArrowUpRight,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, lastTime: 'Never', usage: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [currentUser]);

  async function fetchStats() {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userID', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const docs = [];
      snap.forEach(doc => docs.push(doc.data()));

      if (docs.length > 0) {
        const last = docs[0].createdAt?.toDate() || new Date();
        setStats({
          total: docs.length,
          lastTime: last.toLocaleDateString(),
          usage: docs.length // Just for simulation
        });
        setRecentProjects(docs.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }

  const cards = [
    { title: "Total Sites", value: stats.total, icon: <Layers className="w-5 h-5" />, color: "text-blue-400" },
    { title: "Last Build", value: stats.lastTime, icon: <Clock className="w-5 h-5" />, color: "text-emerald-400" },
    { title: "Usage Counter", value: `${stats.usage}/50`, icon: <Zap className="w-5 h-5" />, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {currentUser?.email?.split('@')[0]}</h1>
          <p className="text-slate-400">Here's what's happening with your projects.</p>
        </div>
        <button 
          onClick={() => navigate('/builder')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.title}
            className="p-6 bg-slate-900 border border-white/5 rounded-3xl hover:border-white/10 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 bg-white/5 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
              <div className="text-xs font-semibold text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                +12%
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          </div>
          <button 
            onClick={() => navigate('/dashboard/projects')}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="p-6">
          {recentProjects.length === 0 ? (
            <div className="py-10 text-center text-slate-500 italic">
              No projects yet. Build your first one!
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate max-w-[200px]">{project.websiteUrl}</p>
                      <p className="text-xs text-slate-500">{project.createdAt?.toDate()?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/builder/${project.id}`)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
