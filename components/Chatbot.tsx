'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: input }) });
    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 h-[500px] flex flex-col">
      <h3 className="font-bold mb-3">AI Mentor Chat</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-indigo-500/20 text-right' : 'bg-white/10'}`}>{m.content}</div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-black/50 rounded px-3 py-2" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask career advice..." />
        <button onClick={send} className="bg-indigo-600 px-4 rounded" disabled={loading}>Send</button>
      </div>
    </div>
  );
}