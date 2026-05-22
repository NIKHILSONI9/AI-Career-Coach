import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use the more capable model for deep analysis
const getModel = () => genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// ----------------------------------------------------------------------
// 1. Generate a detailed career report with actionable insights
// ----------------------------------------------------------------------
export async function generateCareerReport(userData: any) {
  try {
    const model = getModel();
    const prompt = `You are a senior career coach with 20 years of experience in tech hiring and career development.
Your task is to analyse the following student profile and provide **actionable, data‑driven career advice**.

Return **valid JSON only** (no markdown, no extra text) with these keys:
{
  "recommendedFields": [
    {
      "title": "string",
      "matchScore": number (0-100),
      "salary": "string (e.g., ₹8L-20L)",
      "demand": "string (Low/Medium/High/Very High)",
      "pros": ["string"],
      "cons": ["string"],
      "growthOutlook": "string (e.g., 15% YoY)"
    }
  ],
  "skillsGapAnalysis": [
    {
      "skill": "string",
      "importance": number (0-100),
      "missing": boolean,
      "suggestion": "string (actionable learning advice)",
      "resourcesToLearn": ["string (URL or course name)"]
    }
  ],
  "roadmap": [
    {
      "phase": "string (e.g., Month 1)",
      "duration": "string (e.g., 4 weeks)",
      "tasks": ["string"],
      "milestones": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "provider": "string",
      "estimatedTime": "string",
      "cost": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": "string",
      "difficulty": "Easy/Medium/Hard"
    }
  ],
  "marketDemand": "string (2-3 sentences)",
  "resumeSuggestions": ["string (specific improvements)"],
  "interviewPrepTips": ["string (topics to study)"]
}

Profile:
- Skills: ${userData.skills?.join(', ') || 'Not provided'}
- Interests: ${userData.interests?.join(', ') || 'Not provided'}
- Experience: ${userData.experience}
- Education: ${userData.education || 'Not provided'}
- Resume text excerpt (first 3000 chars): ${userData.resumeText?.slice(0, 3000) || 'No resume uploaded'}
- Career interests: ${userData.careerInterests?.join(', ') || 'All'}

Be brutally honest but encouraging. Use current market data (2025). Recommend specific online courses (Coursera, Udemy, freeCodeCamp) where relevant. If the user lacks a critical skill, explain why it's important and how to learn it quickly.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(clean);
  } catch (err) {
    console.error('Career report error:', err);
    // Fallback with objects (not strings) for certifications and projects
    return {
      recommendedFields: [{
        title: "Software Developer",
        matchScore: 70,
        salary: "₹8L-20L",
        demand: "High",
        pros: ["Good growth opportunities", "Remote work possible"],
        cons: ["Competitive market", "Continuous learning required"],
        growthOutlook: "10% YoY"
      }],
      skillsGapAnalysis: [{
        skill: "JavaScript",
        importance: 90,
        missing: true,
        suggestion: "Start with freeCodeCamp's JavaScript course",
        resourcesToLearn: ["https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"]
      }],
      roadmap: [{
        phase: "Month 1",
        duration: "4 weeks",
        tasks: ["Learn HTML/CSS", "Build a personal website", "Learn Git basics"],
        milestones: ["Deploy first static site on Vercel"]
      }],
      certifications: [{
        name: "FreeCodeCamp Frontend",
        provider: "freeCodeCamp",
        estimatedTime: "300 hours",
        cost: "Free"
      }],
      projects: [{
        name: "Portfolio Website",
        description: "Showcase your work and skills",
        techStack: "HTML/CSS/JS",
        difficulty: "Easy"
      }],
      marketDemand: "Software development remains in high demand globally, especially for full‑stack roles.",
      resumeSuggestions: ["Add quantifiable achievements (e.g., 'improved performance by 30%')", "Include a link to your GitHub"],
      interviewPrepTips: ["Practice LeetCode easy problems", "Review basic data structures"]
    };
  }
}

// ----------------------------------------------------------------------
// 2. Generate a professional cover letter using resume text and job description
// ----------------------------------------------------------------------
export async function generateCoverLetterWithResumeAndJD(
  resumeText: string,
  jobDescription: string,
  company: string,
  role: string,
  userName: string
) {
  try {
    const model = getModel();
    const prompt = `You are an AI career assistant. Write a professional, ATS‑optimised cover letter for the position of "${role}" at "${company}".

The candidate's resume (extracted text) is:
${resumeText.slice(0, 2000)}

The job description is:
${jobDescription.slice(0, 1500)}

The candidate's name is ${userName}.

Rules:
- Keep the letter concise (250‑350 words).
- Match keywords from the job description.
- Highlight the candidate’s relevant skills and achievements.
- Use a standard business letter format.
- Do NOT include any placeholder brackets like [Your Name] – fill them with real data.
- Return only the letter text, no extra commentary.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Cover letter error:', err);
    return `Dear Hiring Manager at ${company},

I am writing to apply for the ${role} position. Based on my background, I am confident I can contribute to your team.

I would welcome the opportunity to discuss my qualifications further.

Sincerely,
${userName}`;
  }
}

// ----------------------------------------------------------------------
// 3. Enhanced chatbot that acts like a real mentor
// ----------------------------------------------------------------------
export async function chatWithAI(message: string, context: string) {
  try {
    const model = getModel();
    const systemPrompt = `You are an empathetic, experienced career coach. 
${context}

Your job: answer the student's career questions with specific, actionable advice. 
Be concise (2-3 paragraphs max). Use examples. 
If they ask about a skill, explain why it's valuable and how to learn it.
If they ask about salary or job market, use realistic Indian/US figures (based on current trends).
Always end with a follow‑up question to keep the conversation going.`;

    const chat = model.startChat({
      history: [{ role: 'user', parts: [{ text: systemPrompt }] }],
    });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    console.error('Chat error:', err);
    return "I'm having trouble connecting. Please try again later.";
  }
}

// ----------------------------------------------------------------------
// 4. Analyse resume and return ATS score, strengths, weaknesses, etc.
// ----------------------------------------------------------------------
export async function analyseResume(resumeText: string) {
  try {
    const model = getModel();
    const prompt = `You are an expert resume reviewer. Analyse the following resume and return **valid JSON only** with:
{
  "atsScore": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingKeywords": ["string"],
  "suggestedEdits": ["string"],
  "formattingAdvice": "string"
}

Resume text:
${resumeText.slice(0, 4000)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(clean);
  } catch (err) {
    console.error('Resume analysis error:', err);
    return {
      atsScore: 70,
      strengths: ["Good content overall"],
      weaknesses: ["Needs more keywords", "Lacks quantifiable results"],
      missingKeywords: ["React", "Node.js", "TypeScript"],
      suggestedEdits: ["Add numbers (e.g., 'improved speed by 30%')", "Use action verbs"],
      formattingAdvice: "Use consistent bullet points and clear section headings",
    };
  }
}