import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Sparkles, 
  Settings, 
  LogOut, 
  FolderIcon, 
  Globe, 
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: "Overview", path: "/dashboard" },
    { icon: <Sparkles className="w-5 h-5" />, label: "Builder", path: "/builder" },
    { icon: <FolderIcon className="w-5 h-5" />, label: "My Projects", path: "/dashboard/projects" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", path: "/dashboard/settings" },
  ];

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="w-64 h-full bg-slate-950 border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          AI Clone
        </span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
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

      <div className="p-4 border-t border-white/5">
        <div className="bg-slate-900/50 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {currentUser?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500 truncate">
                Professional Plan
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5">
            <div className="bg-indigo-600 h-1.5 rounded-full w-2/3"></div>
          </div>
          <p className="text-[10px] text-slate-500 flex justify-between">
            <span>Usage</span>
            <span>22 / 50 sites</span>
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
    </div>
  );
}
