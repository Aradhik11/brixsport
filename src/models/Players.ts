// src/models/Player.ts
export interface Player {
  id?: number;
  name: string;
  position?: string;
  jersey_number?: number;
  team_id: number;
  age?: number;
  height?: number;
  weight?: number;
  nationality?: string;
  photo_url?: string;
  created_at?: Date;
}