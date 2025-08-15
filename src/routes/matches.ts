import { Router } from 'express';
import pool from '../config/database';

const router = Router();

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Get matches with filters
 *     tags: [Matches]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, live, completed]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: team_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: competition_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of matches
 */
router.get('/', async (req, res) => {
  try {
    const { status, date, team_id, competition_id } = req.query;
    
    let whereConditions: string[] = []; // ✅ Explicitly type as string[]
    let queryParams: any[] = [];
    let paramIndex = 1;
    
    if (status) {
      whereConditions.push(`m.status = $${paramIndex}`); // ✅ Fixed: Use $${paramIndex}
      queryParams.push(status);
      paramIndex++;
    }
    
    if (date) {
      whereConditions.push(`DATE(m.match_date) = $${paramIndex}`); // ✅ Fixed
      queryParams.push(date);
      paramIndex++;
    }
    
    if (team_id) {
      whereConditions.push(`(m.home_team_id = $${paramIndex} OR m.away_team_id = $${paramIndex + 1})`); // ✅ Fixed
      queryParams.push(team_id, team_id); // Push twice for both conditions
      paramIndex += 2; // Increment by 2 since we used 2 parameters
    }
    
    if (competition_id) {
      whereConditions.push(`m.competition_id = $${paramIndex}`); // ✅ Fixed
      queryParams.push(competition_id);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    const query = `
      SELECT m.*, 
             ht.name as home_team_name, ht.logo_url as home_team_logo,
             at.name as away_team_name, at.logo_url as away_team_logo,
             c.name as competition_name
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      JOIN competitions c ON m.competition_id = c.id
      ${whereClause}
      ORDER BY m.match_date ASC
    `;
    
    const result = await pool.query(query, queryParams);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Get match by ID with events
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Match details with events
 *       404:
 *         description: Match not found
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get match details
    const matchQuery = `
      SELECT m.*, 
             ht.name as home_team_name, ht.logo_url as home_team_logo,
             at.name as away_team_name, at.logo_url as away_team_logo,
             c.name as competition_name
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      JOIN competitions c ON m.competition_id = c.id
      WHERE m.id = $1
    `;
    const matchResult = await pool.query(matchQuery, [id]);
    
    if (matchResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    
    // Get match events
    const eventsQuery = `
      SELECT me.*, p.name as player_name, t.name as team_name
      FROM match_events me
      LEFT JOIN players p ON me.player_id = p.id
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE me.match_id = $1
      ORDER BY me.minute ASC
    `;
    const eventsResult = await pool.query(eventsQuery, [id]);
    
    res.json({
      success: true,
      data: {
        match: matchResult.rows[0],
        events: eventsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Create new match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - competition_id
 *               - home_team_id
 *               - away_team_id
 *               - match_date
 *             properties:
 *               competition_id:
 *                 type: integer
 *               home_team_id:
 *                 type: integer
 *               away_team_id:
 *                 type: integer
 *               match_date:
 *                 type: string
 *                 format: date-time
 *               venue:
 *                 type: string
 *     responses:
 *       201:
 *         description: Match created successfully
 */
router.post('/', async (req, res) => {
  try {
    const { competition_id, home_team_id, away_team_id, match_date, venue } = req.body;
    
    const query = `
      INSERT INTO matches (competition_id, home_team_id, away_team_id, match_date, venue)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      competition_id, home_team_id, away_team_id, match_date, venue
    ]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;