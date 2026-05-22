'use client';
import { useState } from 'react';

export default function InterviewTab() {
  // No user prop needed – uses local quiz state
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1 },
    { q: "Which HTTP method should be used for data retrieval?", opts: ["POST", "PUT", "GET", "DELETE"], ans: 2 },
    { q: "In React, which hook is used to perform side effects?", opts: ["useState", "useRef", "useEffect", "useMemo"], ans: 2 },
    { q: "What does ACID stand for in database transactions?", opts: ["Atomic, Consistent, Isolated, Durable", "Advanced, Compiled, Indexed, Distributed", "Atomic, Compiled, Integrated, Durable", "Asynchronous, Consistent, Indexed, Durable"], ans: 0 },
    { q: "Which data structure uses LIFO?", opts: ["Queue", "Linked List", "Stack", "Tree"], ans: 2 },
  ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    if (idx === questions[current].ans) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <div className="text-6xl font-bold text-indigo-400 mb-4">{percent}%</div>
        <p className="text-gray-300 mb-6">You scored {score} out of {questions.length}</p>
        <button onClick={restart} className="bg-indigo-600 px-6 py-2 rounded-lg">Retake Quiz</button>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Interview Preparation</h1>
        <p className="text-gray-400">Practice with technical questions</p>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">Question {current + 1} / {questions.length}</span>
          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-6">{q.q}</h3>
        <div className="space-y-3">
          {q.opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full text-left p-3 rounded-lg border transition ${
                answered && idx === q.ans ? 'border-green-500 bg-green-500/20' :
                answered && idx !== q.ans ? 'border-red-500/50 bg-red-500/10' :
                'border-white/20 hover:border-indigo-500'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <button onClick={nextQuestion} className="mt-6 bg-indigo-600 px-6 py-2 rounded-lg">
            {current + 1 === questions.length ? 'Finish' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}