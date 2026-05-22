'use client';
import { LayoutDashboard, FileText, Mail, Mic, User, LogOut, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const items = [
    { id: 'insights', label: 'Industry Insights', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume Builder', icon: <FileText className="w-4 h-4" /> },
    { id: 'cover', label: 'Cover Letter', icon: <Mail className="w-4 h-4" /> },
    { id: 'interview', label: 'Interview Prep', icon: <Mic className="w-4 h-4" /> },
    { id: 'mentor', label: 'AI Mentor', icon: <Sparkles className="w-4 h-4" /> },   // ← NEW
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-md border-r border-white/10 p-4">
      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8 pl-2">
        AI Career Coach
      </div>
      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition mt-8"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </nav>
    </aside>
  );
}