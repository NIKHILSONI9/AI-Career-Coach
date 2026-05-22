'use client';
import { useState, useEffect } from 'react';
import ResumeUploader from '../ResumeUploader';

export default function ResumeTab({ user }: { user: any }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    summary: '',
    experience: [{ title: '', company: '', duration: '', bullets: [''] }],
    projects: [{ name: '', description: '', techStack: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    skills: '',
    certifications: [{ name: '', issuer: '', year: '' }],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/resume/get')
      .then(res => res.json())
      .then(data => {
        if (data.resume) setForm(prev => ({ ...prev, ...data.resume }));
      });
  }, []);

  const addExperience = () => setForm(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '', bullets: [''] }] }));
  const addProject = () => setForm(prev => ({ ...prev, projects: [...prev.projects, { name: '', description: '', techStack: '' }] }));
  const addEducation = () => setForm(prev => ({ ...prev, education: [...prev.education, { degree: '', institution: '', year: '' }] }));
  const addCertification = () => setForm(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', issuer: '', year: '' }] }));

  const saveResume = async () => {
    setSaving(true);
    await fetch('/api/resume/save', { method: 'POST', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } });
    setSaving(false);
    alert('Resume saved!');
  };

  // Enhanced A4‑style preview with professional margins, section divisions, and clean typography
  const previewHtml = `
    <div style="background: white; color: #1a1a2e; font-family: 'Inter', 'Segoe UI', 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px 48px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 4px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${form.name || 'Your Name'}</div>
        <div style="font-size: 13px; color: #4a5568; margin-top: 6px;">${form.email}${form.phone ? ` | ${form.phone}` : ''}${form.location ? ` | ${form.location}` : ''}</div>
      </div>

      ${form.summary ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">Professional Summary</div>
          <p style="font-size: 12px; line-height: 1.5; color: #2d3748;">${form.summary}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ` : ''}

      ${form.experience.some(e => e.title) ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 14px;">Work Experience</div>
          ${form.experience.map(exp => `
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 700; font-size: 13px;">${exp.title || 'Job Title'}${exp.company ? ` at ${exp.company}` : ''}</div>
              <div style="font-size: 11px; color: #718096; margin-bottom: 6px;">${exp.duration || 'Duration'}</div>
              <ul style="margin: 4px 0 0 20px; padding-left: 0;">
                ${exp.bullets.filter(b => b.trim()).map(b => `<li style="font-size: 11px; line-height: 1.4; margin-bottom: 4px;">${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ` : ''}

      ${form.projects.some(p => p.name) ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 14px;">Projects</div>
          ${form.projects.map(proj => `
            <div style="margin-bottom: 14px;">
              <div style="font-weight: 700; font-size: 13px;">${proj.name || 'Project Name'}${proj.techStack ? ` <span style="font-weight: normal; font-size: 11px; color: #4a5568;">(${proj.techStack})</span>` : ''}</div>
              <p style="font-size: 11px; line-height: 1.4; margin-top: 4px;">${proj.description}</p>
            </div>
          `).join('')}
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ` : ''}

      ${form.education.some(e => e.degree) ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 14px;">Education</div>
          ${form.education.map(edu => `
            <div style="margin-bottom: 10px;">
              <div style="font-weight: 700; font-size: 13px;">${edu.degree || 'Degree'}</div>
              <div style="font-size: 11px; color: #4a5568;">${edu.institution || 'Institution'}${edu.year ? ` • ${edu.year}` : ''}</div>
            </div>
          `).join('')}
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ` : ''}

      ${form.skills ? `
        <div style="margin-bottom: 20px;">
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px;">Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${form.skills.split(',').map(s => s.trim()).filter(s => s).map(skill => `<span style="background: #edf2f7; padding: 4px 10px; border-radius: 20px; font-size: 11px; color: #2d3748;">${skill}</span>`).join('')}
          </div>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      ` : ''}

      ${form.certifications.some(c => c.name) ? `
        <div>
          <div style="font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px;">Certifications</div>
          ${form.certifications.map(cert => `
            <div style="margin-bottom: 8px;">
              <div style="font-weight: 500; font-size: 12px;">${cert.name || 'Certification'}${cert.issuer ? ` – ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Professional Resume Builder</h1>
        <p className="text-gray-400">Upload a resume (PDF/DOCX) to auto‑fill fields, or edit manually. The preview shows an A4‑style document.</p>
      </div>

      <ResumeUploader onUpload={() => window.location.reload()} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold">Edit Your Information</h2>
          <input className="w-full p-2 bg-black/50 rounded" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="w-full p-2 bg-black/50 rounded" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="w-full p-2 bg-black/50 rounded" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="w-full p-2 bg-black/50 rounded" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          <textarea className="w-full p-2 bg-black/50 rounded" placeholder="Professional Summary (2-3 sentences)" rows={3} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />

          <div><strong>Work Experience</strong> <button onClick={addExperience} className="text-indigo-400 text-sm ml-2">+ Add</button></div>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="border border-white/20 p-2 rounded">
              <input placeholder="Job Title" className="w-full mb-1 p-1 bg-black/50" value={exp.title} onChange={e => { const newExp = [...form.experience]; newExp[idx].title = e.target.value; setForm({...form, experience: newExp}); }} />
              <input placeholder="Company" className="w-full mb-1 p-1 bg-black/50" value={exp.company} onChange={e => { const newExp = [...form.experience]; newExp[idx].company = e.target.value; setForm({...form, experience: newExp}); }} />
              <input placeholder="Duration (e.g., 2022–2024)" className="w-full mb-1 p-1 bg-black/50" value={exp.duration} onChange={e => { const newExp = [...form.experience]; newExp[idx].duration = e.target.value; setForm({...form, experience: newExp}); }} />
              <textarea placeholder="Bullet points (one per line)" rows={3} className="w-full p-1 bg-black/50" value={exp.bullets.join('\n')} onChange={e => { const newExp = [...form.experience]; newExp[idx].bullets = e.target.value.split('\n'); setForm({...form, experience: newExp}); }} />
            </div>
          ))}

          <div><strong>Projects</strong> <button onClick={addProject} className="text-indigo-400 text-sm ml-2">+ Add</button></div>
          {form.projects.map((proj, idx) => (
            <div key={idx} className="border border-white/20 p-2 rounded">
              <input placeholder="Project Name" className="w-full mb-1 p-1 bg-black/50" value={proj.name} onChange={e => { const newProj = [...form.projects]; newProj[idx].name = e.target.value; setForm({...form, projects: newProj}); }} />
              <input placeholder="Tech Stack (e.g., React, Node.js)" className="w-full mb-1 p-1 bg-black/50" value={proj.techStack} onChange={e => { const newProj = [...form.projects]; newProj[idx].techStack = e.target.value; setForm({...form, projects: newProj}); }} />
              <textarea placeholder="Description" rows={2} className="w-full p-1 bg-black/50" value={proj.description} onChange={e => { const newProj = [...form.projects]; newProj[idx].description = e.target.value; setForm({...form, projects: newProj}); }} />
            </div>
          ))}

          <div><strong>Education</strong> <button onClick={addEducation} className="text-indigo-400 text-sm ml-2">+ Add</button></div>
          {form.education.map((edu, idx) => (
            <div key={idx} className="border border-white/20 p-2 rounded">
              <input placeholder="Degree (e.g., B.Tech CSE)" className="w-full mb-1 p-1 bg-black/50" value={edu.degree} onChange={e => { const newEdu = [...form.education]; newEdu[idx].degree = e.target.value; setForm({...form, education: newEdu}); }} />
              <input placeholder="Institution" className="w-full mb-1 p-1 bg-black/50" value={edu.institution} onChange={e => { const newEdu = [...form.education]; newEdu[idx].institution = e.target.value; setForm({...form, education: newEdu}); }} />
              <input placeholder="Year of completion" className="w-full p-1 bg-black/50" value={edu.year} onChange={e => { const newEdu = [...form.education]; newEdu[idx].year = e.target.value; setForm({...form, education: newEdu}); }} />
            </div>
          ))}

          <div><strong>Skills (comma separated)</strong></div>
          <input className="w-full p-2 bg-black/50 rounded" placeholder="e.g., React, Python, SQL, Figma" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />

          <div><strong>Certifications</strong> <button onClick={addCertification} className="text-indigo-400 text-sm ml-2">+ Add</button></div>
          {form.certifications.map((cert, idx) => (
            <div key={idx} className="border border-white/20 p-2 rounded">
              <input placeholder="Certification Name" className="w-full mb-1 p-1 bg-black/50" value={cert.name} onChange={e => { const newCert = [...form.certifications]; newCert[idx].name = e.target.value; setForm({...form, certifications: newCert}); }} />
              <input placeholder="Issuer (e.g., Google, AWS)" className="w-full mb-1 p-1 bg-black/50" value={cert.issuer} onChange={e => { const newCert = [...form.certifications]; newCert[idx].issuer = e.target.value; setForm({...form, certifications: newCert}); }} />
              <input placeholder="Year earned" className="w-full p-1 bg-black/50" value={cert.year} onChange={e => { const newCert = [...form.certifications]; newCert[idx].year = e.target.value; setForm({...form, certifications: newCert}); }} />
            </div>
          ))}

          <button onClick={saveResume} disabled={saving} className="bg-indigo-600 px-6 py-2 rounded-lg w-full">{saving ? 'Saving...' : 'Save Resume'}</button>
        </div>

        {/* A4-like preview with scroll if needed */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-center items-start overflow-auto max-h-[700px]">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  );
}