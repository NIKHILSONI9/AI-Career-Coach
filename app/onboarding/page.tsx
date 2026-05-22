'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Industry data (same as in InsightsTab)
const industryData: Record<string, any> = {
  'Software Development': {
    skills: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Next.js', 'Git', 'MongoDB', 'GraphQL'],
  },
  'Data Science & AI': {
    skills: ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'PyTorch', 'R', 'Tableau', 'Hadoop'],
  },
  'Cybersecurity': {
    skills: ['Networking', 'Linux', 'Ethical Hacking', 'SIEM', 'Python', 'Forensics', 'Cloud Security', 'Cryptography', 'Incident Response'],
  },
  'Cloud & DevOps': {
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Azure', 'Jenkins', 'Ansible', 'Prometheus'],
  },
  'Product Management': {
    skills: ['Roadmapping', 'Agile', 'Analytics', 'SQL', 'User Research', 'A/B Testing', 'Jira', 'Product Strategy', 'OKRs'],
  },
  'UI/UX Design': {
    skills: ['Figma', 'Prototyping', 'User Research', 'CSS', 'Design Systems', 'Accessibility', 'Motion', 'Adobe XD', 'Wireframing'],
  },
  'Finance & Banking': {
    skills: ['Excel', 'SQL', 'Python', 'Risk Management', 'Bloomberg', 'CFA', 'Compliance', 'Financial Modeling', 'VBA'],
  },
  'Marketing': {
    skills: ['SEO', 'Google Ads', 'Analytics', 'Content', 'Social Media', 'Email Marketing', 'HubSpot', 'CRM', 'Copywriting'],
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('0');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch current user (already authenticated via middleware)
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push('/login');
        else setUser(data.user);
      });
  }, []);

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ind = e.target.value;
    setIndustry(ind);
    // Reset skills when industry changes
    setSelectedSkills([]);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const nextStep = () => {
    if (step === 1 && !industry) return alert('Please select your industry');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const finishOnboarding = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry, experience, skills: selectedSkills, bio }),
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950 p-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 w-full max-w-2xl">
        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? 'bg-indigo-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Industry & Experience */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome! Let's set up your profile 👋</h2>
            <p className="text-gray-400">Tell us about your industry so we can personalise your experience.</p>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Your Industry</label>
              <select
                className="w-full p-3 rounded-lg bg-black/50 border border-white/20"
                value={industry}
                onChange={handleIndustryChange}
              >
                <option value="">Select industry...</option>
                {Object.keys(industryData).map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Years of Experience</label>
              <select
                className="w-full p-3 rounded-lg bg-black/50 border border-white/20"
                value={experience}
                onChange={e => setExperience(e.target.value)}
              >
                <option value="0">Fresher (0 years)</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
              </select>
            </div>
            <button onClick={nextStep} className="w-full bg-indigo-600 py-3 rounded-lg font-semibold">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Select Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Select your skills</h2>
            <p className="text-gray-400">Pick the skills you already have. We'll recommend missing ones later.</p>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
              {(industry ? industryData[industry]?.skills : [])?.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${
                    selectedSkills.includes(skill)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">You can add more skills later in your profile.</p>
            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 border border-white/20 py-2 rounded-lg">
                ← Back
              </button>
              <button onClick={nextStep} className="flex-1 bg-indigo-600 py-2 rounded-lg">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Almost done! 🎉</h2>
            <p className="text-gray-400">Add a short bio to personalise your resume and cover letters.</p>
            <textarea
              className="w-full p-3 rounded-lg bg-black/50 border border-white/20 h-32"
              placeholder="e.g. Final year CS student, passionate about full‑stack development..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 border border-white/20 py-2 rounded-lg">
                ← Back
              </button>
              <button
                onClick={finishOnboarding}
                disabled={loading}
                className="flex-1 bg-indigo-600 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Launch Dashboard 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}