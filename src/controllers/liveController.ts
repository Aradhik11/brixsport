// src/controllers/liveController.ts
import { Request, Response } from 'express';
import pool from '../config/database';
import { SocketService } from '../services/socketServices';

export class LiveController {
  constructor(private socketService: SocketService) {}

  /**
   * Update live match score
   */
  async updateLiveScore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { home_score, away_score, current_minute, period, status } = req.body;

      const query = `
        UPDATE matches 
        SET home_score = $1, away_score = $2, current_minute = $3, period = $4, status = $5
        WHERE id = $6
        RETURNING *
      `;

      const result = await pool.query(query, [
        home_score, away_score, current_minute, period, status, id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      // Broadcast update to connected clients
      this.socketService.broadcastScoreUpdate(parseInt(id), {
        home_score,
        away_score,
        current_minute,
        period,
        status
      });

      res.json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error updating live score:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Add match event (goal, card, substitution)
   */
  async addMatchEvent(req: Request, res: Response) {
    try {
      const { match_id, player_id, event_type, minute, description } = req.body;

      const query = `
        INSERT INTO match_events (match_id, player_id, event_type, minute, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await pool.query(query, [
        match_id, player_id, event_type, minute, description
      ]);

      // Get player and team details for the event
      const eventDetailsQuery = `
        SELECT me.*, p.name as player_name, t.name as team_name
        FROM match_events me
        LEFT JOIN players p ON me.player_id = p.id
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE me.id = $1
      `;
      const eventDetails = await pool.query(eventDetailsQuery, [result.rows[0].id]);

      // Broadcast event to connected clients
      this.socketService.broadcastMatchEvent(match_id, eventDetails.rows[0]);

      res.status(201).json({
        success: true,
        data: eventDetails.rows[0]
      });

    } catch (error) {
      console.error('Error adding match event:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get live matches
   */
  async getLiveMatches(req: Request, res: Response) {
    try {
      const query = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo,
               c.name as competition_name, c.type as competition_type
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN competitions c ON m.competition_id = c.id
        WHERE m.status = 'live'
        ORDER BY c.type, m.match_date ASC
      `;

      const result = await pool.query(query);

      // Group by competition type
      const groupedMatches = result.rows.reduce((acc, match) => {
        const type = match.competition_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(match);
        return acc;
      }, {});

      res.json({
        success: true,
        data: groupedMatches
      });

    } catch (error) {
      console.error('Error fetching live matches:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}