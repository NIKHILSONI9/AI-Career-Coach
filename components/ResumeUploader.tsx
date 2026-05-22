'use client';
import { useState } from 'react';

interface ResumeFeedback {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestedEdits: string[];
  formattingAdvice: string;
}

interface ResumeUploaderProps {
  onUpload?: () => void;
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setFeedback(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // 1. Upload the file
      const uploadRes = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error(err || 'Upload failed');
      }

      // 2. Fetch AI feedback
      const feedbackRes = await fetch('/api/resume/feedback');
      if (!feedbackRes.ok) {
        throw new Error('Failed to analyse resume');
      }

      const feedbackData = await feedbackRes.json();
      if (feedbackData.feedback) {
        setFeedback(feedbackData.feedback);
      }

      // 3. Notify parent if needed
      onUpload?.();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 disabled:opacity-50"
        />
        {uploading && <p className="text-gray-400 mt-3">Uploading and analysing...</p>}
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* AI Feedback Card */}
      {feedback && (
        <div className="bg-white/5 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-indigo-400">AI Resume Analysis</h3>
            <div className="text-2xl font-bold text-indigo-400">{feedback.atsScore}%</div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${feedback.atsScore}%` }}
            />
          </div>

          {feedback.strengths.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-400 mb-1">✅ Strengths</div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {feedback.weaknesses.length > 0 && (
            <div>
              <div className="text-sm font-medium text-amber-400 mb-1">⚠️ Areas to Improve</div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {feedback.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          {feedback.missingKeywords.length > 0 && (
            <div>
              <div className="text-sm font-medium text-amber-400 mb-1">📌 Missing Keywords</div>
              <div className="flex flex-wrap gap-2">
                {feedback.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {feedback.suggestedEdits.length > 0 && (
            <div>
              <div className="text-sm font-medium text-indigo-400 mb-1">✍️ Suggested Edits</div>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {feedback.suggestedEdits.map((edit, i) => <li key={i}>{edit}</li>)}
              </ul>
            </div>
          )}

          {feedback.formattingAdvice && (
            <div className="text-sm text-gray-400 border-t border-white/10 pt-3">
              {feedback.formattingAdvice}
            </div>
          )}
        </div>
      )}
    </div>
  );
}