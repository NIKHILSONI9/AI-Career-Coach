import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  name: String,
  provider: String,
  estimatedTime: String,
  cost: String,
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  techStack: String,
  difficulty: String,
});

const CareerReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  recommendedFields: [{
    title: String,
    matchScore: Number,
    salary: String,
    demand: String,
    pros: [String],
    cons: [String],
    growthOutlook: String,
  }],
  skillsGapAnalysis: [{
    skill: String,
    importance: Number,
    missing: Boolean,
    suggestion: String,
    resourcesToLearn: [String],
  }],
  roadmap: [{
    phase: String,
    duration: String,
    tasks: [String],
    milestones: [String],
  }],
  certifications: [CertificationSchema],
  projects: [ProjectSchema],
  marketDemand: String,
  resumeSuggestions: [String],
  interviewPrepTips: [String],
});

export default mongoose.models.CareerReport || mongoose.model('CareerReport', CareerReportSchema);