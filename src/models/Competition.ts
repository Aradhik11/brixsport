// src/models/Competition.ts
export interface Competition {
  id?: number;
  name: string;
  type: 'football' | 'basketball' | 'track';
  category?: string;
  status: 'active' | 'completed' | 'upcoming';
  start_date?: Date;
  end_date?: Date;
  created_at?: Date;
}