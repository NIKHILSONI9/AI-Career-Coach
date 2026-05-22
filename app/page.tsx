'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, FileText, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Career Coach
        </span>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
          <Link href="/signup" className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Get Started</Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1 text-sm text-indigo-400 mb-6">
            <Sparkles className="w-3 h-3" /> Powered by Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your <span className="text-indigo-400">AI-Powered</span><br />Career Compass
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Upload your resume, tell us about your skills, and let AI recommend the perfect career path with a personalised roadmap.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl mt-8 transition">
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: <Brain className="w-6 h-6" />, title: 'AI Career Analysis', desc: 'Deep insights into which career fits you best based on your profile.' },
            { icon: <FileText className="w-6 h-6" />, title: 'Smart Resume Scanner', desc: 'Upload your resume – AI extracts skills, finds gaps, and suggests improvements.' },
            { icon: <MessageSquare className="w-6 h-6" />, title: 'Chatbot Mentor', desc: 'Ask anything about your career, salary, roadmap – 24/7 AI assistant.' }
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">{f.icon}</div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-400 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}