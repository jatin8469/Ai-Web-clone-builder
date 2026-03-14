import { Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  
  // Basic route to title mapping
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard':
        return 'Overview';
      case '/dashboard/projects':
        return 'My Projects';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="h-16 px-4 md:px-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Placeholder */}
        <div className="hidden md:flex items-center bg-slate-900/50 border border-white/5 rounded-full px-4 py-1.5 focus-within:border-indigo-500/50 transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none w-48"
          />
        </div>

        {/* Action Buttons */}
        <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
        </button>
      </div>
    </nav>
  );
}
