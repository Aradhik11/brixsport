// src/models/Team.ts
export interface Team {
  id?: number;
  name: string;
  logo_url?: string;
  founded_year?: number;
  stadium?: string;
  city?: string;
  country?: string;
  color_primary?: string;
  color_secondary?: string;
  created_at?: Date;
  updated_at?: Date;
}