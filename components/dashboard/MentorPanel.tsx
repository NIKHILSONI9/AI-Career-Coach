'use client';
import { useState, useEffect } from 'react';

export default function MentorPanel({ user }: { user: any }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMentorAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentor/advice');
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorAdvice();
  }, []);

  if (loading) return <div className="bg-white/5 p-6 rounded-2xl text-center">Generating personalised advice...</div>;
  if (!analysis) return <div className="bg-white/5 p-6 rounded-2xl text-center">Click refresh to get AI mentor advice.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">AI Mentor Panel</h1>
        <p className="text-gray-400">Personalised guidance based on your skills and goals</p>
      </div>

      {/* Missing Skills */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">📊 Skills Gap Analysis</h2>
        <div className="space-y-2">
          {analysis.missingSkills?.map((skill: string, idx: number) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/10 py-2">
              <span>{skill}</span>
              <span className="text-amber-400 text-sm">High demand</span>
            </div>
          ))}
          {(!analysis.missingSkills || analysis.missingSkills.length === 0) && (
            <p className="text-green-400">Great! Your skills align well with market demand.</p>
          )}
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">🗺️ Weekly Learning Plan</h2>
        <div className="space-y-3">
          {analysis.learningPlan?.map((task: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Recommendations */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">🚀 Projects to Build</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {analysis.projects?.map((proj: string, idx: number) => (
            <li key={idx}>{proj}</li>
          ))}
        </ul>
      </div>

      <button onClick={fetchMentorAdvice} className="w-full bg-indigo-600 py-2 rounded-lg">
        Refresh Advice
      </button>
    </div>
  );
}