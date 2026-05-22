'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Mail, Mic, User, LogOut, Sparkles } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import InsightsTab from '@/components/dashboard/InsightsTab';
import ResumeTab from '@/components/dashboard/ResumeTab';
import CoverLetterTab from '@/components/dashboard/CoverLetterTab';
import InterviewTab from '@/components/dashboard/InterviewTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import MentorPanel from '@/components/dashboard/MentorPanel';   

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('insights');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push('/login');
        else setUser(data.user);
      });
  }, []);

  if (!user) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  const renderTab = () => {
    switch(activeTab) {
      case 'insights': return <InsightsTab user={user} />;
      case 'resume': return <ResumeTab user={user} />;
      case 'cover': return <CoverLetterTab />;
      case 'interview': return <InterviewTab />;
      case 'profile': return <ProfileTab user={user} />;
      case 'mentor': return <MentorPanel user={user} />;   // 
      default: return <InsightsTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
}