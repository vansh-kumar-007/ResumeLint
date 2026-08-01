export interface BulletRewrite {
  original: string;
  suggested: string | null;
  error?: string | null;
}

export interface SuggestionsResult {
  ai_available: boolean;
  message: string | null;
  bullet_rewrites: BulletRewrite[];
  score_explanation: string | null;
}