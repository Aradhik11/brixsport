// src/routes/live.ts
import { Router } from 'express';
import { LiveController } from '../controllers/liveController';
import { SocketService } from '../services/socketServices';

const createLiveRoutes = (socketService: SocketService) => {
  const router = Router();
  const liveController = new LiveController(socketService);

  /**
   * @swagger
   * /live/matches:
   *   get:
   *     summary: Get all live matches
   *     tags: [Live Updates]
   *     responses:
   *       200:
   *         description: Live matches grouped by sport
   */
  router.get('/matches', liveController.getLiveMatches);

  /**
   * @swagger
   * /live/matches/{id}/score:
   *   patch:
   *     summary: Update live match score
   *     tags: [Live Updates]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               home_score:
   *                 type: integer
   *               away_score:
   *                 type: integer
   *               current_minute:
   *                 type: integer
   *               period:
   *                 type: string
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Score updated successfully
   *       404:
   *         description: Match not found
   */
  router.patch('/matches/:id/score', liveController.updateLiveScore);

  /**
   * @swagger
   * /live/events:
   *   post:
   *     summary: Add match event
   *     tags: [Live Updates]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - match_id
   *               - event_type
   *               - minute
   *             properties:
   *               match_id:
   *                 type: integer
   *               player_id:
   *                 type: integer
   *               event_type:
   *                 type: string
   *                 enum: [goal, yellow_card, red_card, substitution]
   *               minute:
   *                 type: integer
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Event added successfully
   */
  router.post('/events', liveController.addMatchEvent);

  return router;
};

export default createLiveRoutes;