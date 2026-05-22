'use client';
import { useState } from 'react';
import CareerReportCard from '../CareerReportCard';

// Industry data (same as before)
const industryData: Record<string, any> = {
  'Software Development': {
    growth: '24%',
    salary: '₹18L',
    skills: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Next.js'],
    rec: ['Machine Learning', 'System Design', 'GraphQL', 'Kubernetes', 'Redis'],
  },
  'Data Science & AI': {
    growth: '31%',
    salary: '₹20L',
    skills: ['Python', 'TensorFlow', 'SQL', 'Pandas', 'Spark', 'PyTorch', 'R'],
    rec: ['LLM Fine‑tuning', 'MLOps', 'Data Engineering', 'Vector DBs', 'Langchain'],
  },
  'Cybersecurity': {
    growth: '28%',
    salary: '₹16L',
    skills: ['Networking', 'Linux', 'Ethical Hacking', 'SIEM', 'Python', 'Forensics', 'Cloud Sec'],
    rec: ['Zero Trust', 'AI Security', 'Bug Bounty', 'Compliance', 'Pentesting'],
  },
  'Cloud & DevOps': {
    growth: '26%',
    salary: '₹19L',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Azure'],
    rec: ['FinOps', 'GitOps', 'Observability', 'Service Mesh', 'eBPF'],
  },
  'Product Management': {
    growth: '18%',
    salary: '₹22L',
    skills: ['Roadmapping', 'Agile', 'Analytics', 'SQL', 'User Research', 'A/B Testing', 'Jira'],
    rec: ['AI Product', 'Growth Loops', 'PLG', 'OKRs', 'Jobs to be Done'],
  },
  'UI/UX Design': {
    growth: '20%',
    salary: '₹14L',
    skills: ['Figma', 'Prototyping', 'User Research', 'CSS', 'Design Systems', 'Accessibility', 'Motion'],
    rec: ['Design Tokens', 'AI UX', '3D/WebGL', 'VR/AR', 'Design Ops'],
  },
  'Finance & Banking': {
    growth: '14%',
    salary: '₹16L',
    skills: ['Excel', 'SQL', 'Python', 'Risk Mgmt', 'Bloomberg', 'CFA', 'Compliance'],
    rec: ['FinTech', 'Algo Trading', 'Blockchain', 'RegTech', 'DeFi'],
  },
  'Marketing': {
    growth: '16%',
    salary: '₹12L',
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content', 'Social Media', 'Email Mktg', 'HubSpot'],
    rec: ['AI Marketing', 'Video', 'Influencer', 'Performance Mktg', 'CDP'],
  },
};

// Bar heights in pixels (max 100px)
const barHeightsPx = [88, 76, 92, 70, 65, 80, 74];

interface InsightsTabProps {
  user: any;
}

export default function InsightsTab({ user }: InsightsTabProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const industry = user?.industry || 'Software Development';
  const data = industryData[industry] || industryData['Software Development'];

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/recommend', { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setReport(json.report);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Industry Insights</h1>
        <p className="text-gray-400">{industry} · Real‑time market analysis</p>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-xs">Market Outlook</div>
          <div className="text-2xl font-bold text-green-400">Positive</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-xs">Growth Rate</div>
          <div className="text-2xl font-bold text-indigo-400">{data.growth}</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-xs">Demand Level</div>
          <div className="text-2xl font-bold text-amber-400">High</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-gray-400 text-xs">Avg Salary</div>
          <div className="text-2xl font-bold text-blue-400">{data.salary}</div>
        </div>
      </div>

      {/* 🔥 FIXED BAR CHART – now using fixed pixel heights */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Top In‑Demand Skills</h3>
        <div className="flex items-end gap-4 h-40">
          {data.skills.slice(0, 7).map((skill: string, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${barHeightsPx[idx % barHeightsPx.length]}px`,
                  backgroundColor: '#6366f1', // indigo-500
                }}
              />
              <span className="text-xs text-gray-400 truncate max-w-[60px] text-center">
                {skill}
              </span>
              <span className="text-[10px] text-gray-500">
                {barHeightsPx[idx % barHeightsPx.length]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Skills */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recommended Skills to Learn</h3>
        <div className="space-y-3">
          {data.rec.map((skill: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-32 text-sm">{skill}</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                  style={{ width: `${90 - idx * 8}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{90 - idx * 8}% demand</span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 overflow-x-auto">
        <h3 className="font-semibold mb-4">Salary Ranges (India)</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr><th className="text-left py-2 text-gray-400 font-normal">Role</th><th className="text-left py-2 text-gray-400 font-normal">Range</th><th className="text-left py-2 text-gray-400 font-normal">Level</th></tr>
          </thead>
          <tbody>
            <tr><td className="py-2">Frontend Dev</td><td>₹8L–₹25L</td><td><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">High</span></td></tr>
            <tr><td className="py-2">Backend Dev</td><td>₹10L–₹30L</td><td><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">High</span></td></tr>
            <tr><td className="py-2">Full Stack</td><td>₹12L–₹35L</td><td><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">High</span></td></tr>
            <tr><td className="py-2">DevOps</td><td>₹14L–₹40L</td><td><span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">High</span></td></tr>
            <tr><td className="py-2">Data Eng.</td><td>₹12L–₹32L</td><td><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">Medium</span></td></tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={generateReport}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition disabled:opacity-50"
      >
        {loading ? 'Analysing...' : '✨ Generate AI Career Report'}
      </button>

      {report && <CareerReportCard report={report} />}
    </div>
  );
}