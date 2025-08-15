// src/controllers/favoritesController.ts
import { Request, Response } from 'express';
import pool from '../config/database';

export class FavoritesController {
  /**
   * Get user favorites (teams, players, competitions)
   */
  async getUserFavorites(req: Request, res: Response) {
    try {
      const userId = 1; // Mock user ID - implement proper auth

      // Get favorite teams
      const teamsQuery = `
        SELECT t.* FROM teams t
        JOIN user_favorites uf ON t.id = uf.favorite_id
        WHERE uf.user_id = $1 AND uf.favorite_type = 'team'
        ORDER BY t.name
      `;

      // Get favorite players
      const playersQuery = `
        SELECT p.*, t.name as team_name FROM players p
        JOIN teams t ON p.team_id = t.id
        JOIN user_favorites uf ON p.id = uf.favorite_id
        WHERE uf.user_id = $1 AND uf.favorite_type = 'player'
        ORDER BY p.name
      `;

      // Get favorite competitions
      const competitionsQuery = `
        SELECT c.* FROM competitions c
        JOIN user_favorites uf ON c.id = uf.favorite_id
        WHERE uf.user_id = $1 AND uf.favorite_type = 'competition'
        ORDER BY c.name
      `;

      const [teams, players, competitions] = await Promise.all([
        pool.query(teamsQuery, [userId]),
        pool.query(playersQuery, [userId]),
        pool.query(competitionsQuery, [userId])
      ]);

      res.json({
        success: true,
        data: {
          teams: teams.rows,
          players: players.rows,
          competitions: competitions.rows
        }
      });

    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Add item to favorites
   */
  async addToFavorites(req: Request, res: Response) {
    try {
      const { favorite_type, favorite_id } = req.body;
      const userId = 1; // Mock user ID

      const query = `
        INSERT INTO user_favorites (user_id, favorite_type, favorite_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, favorite_type, favorite_id) DO NOTHING
        RETURNING *
      `;

      const result = await pool.query(query, [userId, favorite_type, favorite_id]);

      res.json({
        success: true,
        data: result.rows[0] || null,
        message: result.rows[0] ? 'Added to favorites' : 'Already in favorites'
      });

    } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(req: Request, res: Response) {
    try {
      const { favorite_type, favorite_id } = req.body;
      const userId = 1; // Mock user ID

      const query = `
        DELETE FROM user_favorites 
        WHERE user_id = $1 AND favorite_type = $2 AND favorite_id = $3
        RETURNING *
      `;

      const result = await pool.query(query, [userId, favorite_type, favorite_id]);

      res.json({
        success: true,
        message: result.rows.length > 0 ? 'Removed from favorites' : 'Not found in favorites'
      });

    } catch (error) {
      console.error('Error removing from favorites:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}