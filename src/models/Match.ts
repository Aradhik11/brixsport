export interface Match {
  id?: number;
  competition_id: number;
  home_team_id: number;
  away_team_id: number;
  match_date: Date;
  venue?: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed';
  home_score: number;
  away_score: number;
  current_minute: number;
  period?: string;
  created_at?: Date;
}

export interface MatchWithTeams extends Match {
  home_team_name: string;
  away_team_name: string;
  home_team_logo?: string;
  away_team_logo?: string;
  competition_name: string;
}