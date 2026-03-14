import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Sparkles, 
  Settings, 
  LogOut, 
  FolderIcon, 
  Globe, 
  ChevronRight,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Overview", path: "/dashboard" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Builder", path: "/builder" },
    { icon: <FolderIcon className="w-5 h-5" />, label: "My Projects", path: "/dashboard/projects" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/dashboard/settings" },
  ];

  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    async function fetchCount() {
      try {
        const q = query(
          collection(db, 'projects'),
          where('userID', '==', currentUser.uid)
        );
        const snap = await getDocs(q);
        setProjectCount(snap.docs.length);
      } catch (err) {
        console.error("Failed to fetch project count:", err);
      }
    }

    fetchCount();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      initial={false}
      animate={{ 
        x: isDesktop ? 0 : (isOpen ? 0 : -256),
      }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      className={`w-64 h-full bg-slate-950 border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 
        ${!isDesktop && !isOpen ? '-translate-x-full' : 'translate-x-0'} 
        transition-transform duration-300 ease-in-out`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AI Website Builder
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`transition-colors ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 shrink-0">
        <div className="bg-slate-900/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.displayName || currentUser?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500 truncate">
                Free Plan
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((projectCount / 10) * 100, 100)}%` }}
              className="bg-indigo-600 h-1.5 rounded-full"
            ></motion.div>
          </div>
          <p className="text-[10px] text-slate-500 flex justify-between">
            <span>Usage</span>
            <span>{projectCount} / 10 sites</span>
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </motion.div>
  );
}
