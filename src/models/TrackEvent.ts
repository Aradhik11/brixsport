// src/models/TrackEvent.ts
export interface TrackEvent {
  id?: number;
  competition_id: number;
  event_name: string;
  event_type: string;
  gender: 'male' | 'female' | 'mixed';
  scheduled_time: Date;
  status: 'scheduled' | 'ongoing' | 'completed';
  created_at?: Date;
}