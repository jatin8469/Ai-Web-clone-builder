import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar - Desktop Only for now */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10"></div>
        
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
