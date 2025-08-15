// src/controllers/trackController.ts
import { Request, Response } from 'express';
import pool from '../config/database';

export class TrackController {
  /**
   * Get track events fixtures
   */
  async getTrackFixtures(req: Request, res: Response) {
    try {
      const { date, competition_id } = req.query;
      
      let whereConditions = ['c.type = \'track\''];
      let queryParams: any[] = [];
      let paramIndex = 1;

      if (date) {
        whereConditions.push(`DATE(te.scheduled_time) = $${paramIndex}`);
        queryParams.push(date);
        paramIndex++;
      } else {
        // Default to today's events
        whereConditions.push(`DATE(te.scheduled_time) = CURRENT_DATE`);
      }

      if (competition_id) {
        whereConditions.push(`te.competition_id = $${paramIndex}`);
        queryParams.push(competition_id);
        paramIndex++;
      }

      const whereClause = whereConditions.join(' AND ');

      const query = `
        SELECT te.*, c.name as competition_name
        FROM track_events te
        JOIN competitions c ON te.competition_id = c.id
        WHERE ${whereClause}
        ORDER BY te.scheduled_time ASC
      `;

      const result = await pool.query(query, queryParams);

      // Group by time for display
      const groupedEvents = result.rows.reduce((acc, event) => {
        const time = new Date(event.scheduled_time).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push(event);
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          date: date || new Date().toISOString().split('T')[0],
          events: groupedEvents,
          total: result.rows.length
        }
      });

    } catch (error) {
      console.error('Error fetching track fixtures:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Create track event
   */
  async createTrackEvent(req: Request, res: Response) {
    try {
      const { competition_id, event_name, event_type, gender, scheduled_time } = req.body;

      const query = `
        INSERT INTO track_events (competition_id, event_name, event_type, gender, scheduled_time)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await pool.query(query, [
        competition_id, event_name, event_type, gender, scheduled_time
      ]);

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error creating track event:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Update track event status
   */
  async updateTrackEventStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const query = `
        UPDATE track_events 
        SET status = $1 
        WHERE id = $2 
        RETURNING *
      `;

      const result = await pool.query(query, [status, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Track event not found' });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error updating track event:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}