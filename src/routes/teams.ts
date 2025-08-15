// src/routes/teams.ts
import { Router } from 'express';
import pool from '../config/database';

const router = Router();

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search teams by name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get('/', async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM teams';
    const queryParams: any[] = [];
    
    if (search) {
      query += ' WHERE name ILIKE $1';
      queryParams.push(`%${search}%`);
    }
    
    query += ` ORDER BY name ASC LIMIT ${queryParams.length + 1}`;
    queryParams.push(limit);
    
    const result = await pool.query(query, queryParams);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get team by ID with players
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team details with players
 *       404:
 *         description: Team not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get team details
    const teamQuery = 'SELECT * FROM teams WHERE id = $1';
    const teamResult = await pool.query(teamQuery, [id]);
    
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    
    // Get team players
    const playersQuery = 'SELECT * FROM players WHERE team_id = $1 ORDER BY jersey_number';
    const playersResult = await pool.query(playersQuery, [id]);
    
    res.json({
      success: true,
      data: {
        team: teamResult.rows[0],
        players: playersResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       201:
 *         description: Team created successfully
 */
router.post('/', async (req, res) => {
  try {
    const { name, logo_url, founded_year, stadium, city, country, color_primary, color_secondary } = req.body;
    
    const query = `
      INSERT INTO teams (name, logo_url, founded_year, stadium, city, country, color_primary, color_secondary)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      name, logo_url, founded_year, stadium, city, country, color_primary, color_secondary
    ]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;