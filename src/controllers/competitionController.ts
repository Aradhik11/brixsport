import { Request, Response } from 'express';
import pool from '../config/database';

export class CompetitionController {
  /**
   * Get all competitions
   */
  async getAllCompetitions(req: Request, res: Response) {
    try {
      const { type, status } = req.query;
      
      let whereConditions: string[] = []; // ✅ Explicitly type as string[]
      let queryParams: any[] = [];
      let paramIndex = 1;

      if (type) {
        whereConditions.push(`type = $${paramIndex}`); // ✅ This is already correct
        queryParams.push(type);
        paramIndex++;
      }

      if (status) {
        whereConditions.push(`status = $${paramIndex}`); // ✅ This is already correct
        queryParams.push(status);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      const query = `
        SELECT c.*, 
               COUNT(m.id) as total_matches,
               COUNT(CASE WHEN m.status = 'live' THEN 1 END) as live_matches
        FROM competitions c
        LEFT JOIN matches m ON c.id = m.competition_id
        ${whereClause}
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `;

      const result = await pool.query(query, queryParams);

      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Error fetching competitions:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get competition by ID with matches
   */
  async getCompetitionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get competition details
      const competitionQuery = `SELECT * FROM competitions WHERE id = $1`;
      const competitionResult = await pool.query(competitionQuery, [id]);

      if (competitionResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Competition not found' });
      }

      // Get matches for this competition
      const matchesQuery = `
        SELECT m.*, 
               ht.name as home_team_name, ht.logo_url as home_team_logo,
               at.name as away_team_name, at.logo_url as away_team_logo
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        WHERE m.competition_id = $1
        ORDER BY m.match_date ASC
      `;
      const matchesResult = await pool.query(matchesQuery, [id]);

      res.json({
        success: true,
        data: {
          competition: competitionResult.rows[0],
          matches: matchesResult.rows
        }
      });

    } catch (error) {
      console.error('Error fetching competition:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Create new competition
   */
  async createCompetition(req: Request, res: Response) {
    try {
      const { name, type, category, start_date, end_date } = req.body;

      const query = `
        INSERT INTO competitions (name, type, category, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await pool.query(query, [name, type, category, start_date, end_date]);

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error creating competition:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}