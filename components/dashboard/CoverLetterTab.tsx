'use client';
import { useState, useEffect } from 'react';

export default function CoverLetterTab() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');

  // Fetch user's resume text on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.resumeText) setResumeText(data.user.resumeText);
      });
  }, []);

  const generate = async () => {
    if (!company || !role) return alert('Please enter company and role');
    setLoading(true);
    try {
      const res = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, jobDescription }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error: ${res.status} - ${errorText}`);
        return;
      }
      const data = await res.json();
      setLetter(data.letter);
    } catch (err) {
      console.error(err);
      alert('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">AI Cover Letter Generator</h1>
        <p className="text-gray-400">Paste the job description and let AI write a personalised cover letter</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <input
          className="w-full p-3 bg-black/50 rounded border border-white/20"
          placeholder="Company Name (e.g. Google India)"
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
        <input
          className="w-full p-3 bg-black/50 rounded border border-white/20"
          placeholder="Job Title (e.g. Software Engineer)"
          value={role}
          onChange={e => setRole(e.target.value)}
        />
        <textarea
          className="w-full p-3 bg-black/50 rounded border border-white/20"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={6}
        />
        <button
          onClick={generate}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : '✨ Generate ATS Cover Letter'}
        </button>
        {letter && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Your Cover Letter:</h3>
            <div className="p-4 bg-black/50 rounded-lg whitespace-pre-wrap text-gray-200 text-sm">
              {letter}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(letter)}
              className="mt-3 text-indigo-400 text-sm hover:underline"
            >
              Copy to clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}