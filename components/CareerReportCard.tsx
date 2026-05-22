export default function CareerReportCard({ report }: { report: any }) {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-bold">Your AI Career Report</h2>
      <div>
        <h3 className="text-indigo-400 font-semibold">🎯 Recommended Fields</h3>
        {report.recommendedFields?.map((f: any, i: number) => (
          <div key={i} className="mt-2 p-3 bg-black/30 rounded">🔹 {f.title} – Match {f.matchScore}% – {f.salary}</div>
        ))}
      </div>
      <div>
        <h3 className="text-indigo-400 font-semibold">📌 Skills Gap Analysis</h3>
        {report.skillsGapAnalysis?.filter((s: any) => s.missing).map((s: any, i: number) => (
          <div key={i} className="text-sm mt-1">• {s.skill}: {s.suggestion}</div>
        ))}
      </div>
      <div>
        <h3 className="text-indigo-400 font-semibold">🗺️ Learning Roadmap</h3>
        {report.roadmap?.map((p: any, i: number) => (
          <div key={i} className="text-sm mt-1">📘 {p.phase} ({p.duration}) – {p.tasks.join(', ')}</div>
        ))}
      </div>
    </div>
  );
}