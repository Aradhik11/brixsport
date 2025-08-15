// src/controllers/homeController.ts
import { Request, Response } from 'express';
import pool from '../config/database';
import { MatchWithTeams } from '../models/Match';

export class HomeController {
  /**
   * Get home screen data (live matches, upcoming matches by sport)
   */
  async getHomeData(req: Request, res: Response) {
    try {
      // Get live football matches
      const liveFootballQuery = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo,
               c.name as competition_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN competitions c ON m.competition_id = c.id
        WHERE m.status = 'live' AND c.type = 'football'
        ORDER BY m.match_date ASC
      `;

      // Get upcoming football matches
      const upcomingFootballQuery = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo,
               c.name as competition_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN competitions c ON m.competition_id = c.id
        WHERE m.status = 'scheduled' AND c.type = 'football'
        ORDER BY m.match_date ASC
        LIMIT 10
      `;

      // Get live basketball matches
      const liveBasketballQuery = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo,
               c.name as competition_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN competitions c ON m.competition_id = c.id
        WHERE m.status = 'live' AND c.type = 'basketball'
        ORDER BY m.match_date ASC
      `;

      // Get track events for today
      const trackEventsQuery = `
        SELECT te.*, c.name as competition_name
        FROM track_events te
        JOIN competitions c ON te.competition_id = c.id
        WHERE DATE(te.scheduled_time) = CURRENT_DATE
        ORDER BY te.scheduled_time ASC
      `;

      const [liveFootball, upcomingFootball, liveBasketball, trackEvents] = await Promise.all([
        pool.query(liveFootballQuery),
        pool.query(upcomingFootballQuery),
        pool.query(liveBasketballQuery),
        pool.query(trackEventsQuery)
      ]);

      res.json({
        success: true,
        data: {
          liveFootball: liveFootball.rows,
          upcomingFootball: upcomingFootball.rows,
          liveBasketball: liveBasketball.rows,
          trackEvents: trackEvents.rows
        }
      });

    } catch (error) {
      console.error('Error fetching home data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get matches by sport type
   */
  async getMatchesBySport(req: Request, res: Response) {
    try {
      const { sport } = req.params;
      const { status = 'all' } = req.query;

      let statusCondition = '';
      if (status !== 'all') {
        statusCondition = `AND m.status = '${status}'`;
      }

      const query = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo,
               c.name as competition_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN competitions c ON m.competition_id = c.id
        WHERE c.type = $1 ${statusCondition}
        ORDER BY m.match_date ASC
      `;

      const result = await pool.query(query, [sport]);

      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Error fetching matches by sport:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}