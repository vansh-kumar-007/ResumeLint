export interface ContactInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  has_linkedin_mention: boolean;
  has_github_mention: boolean;
}

export interface BulletAnalysis {
  text: string;
  score: number;
  word_count: number;
  has_action_verb: boolean;
  has_metric: boolean;
  issues: string[];
}

export interface SubScore {
  score: number;
  issues?: string[];
}

export interface SectionScores {
  contact: SubScore;
  sections_present: SubScore;
  length: SubScore;
  bullet_quality: { score: number; bullets_analyzed: number };
  skills_presence: { score: number };
}

export interface AnalysisResult {
  resume_id: string;
  overall_score: number;
  cap_reasons: string[];
  section_scores: SectionScores;
  bullet_analyses: BulletAnalysis[];
  contact_info: ContactInfo;
  sections: Record<string, string>;
  word_count: number;
}