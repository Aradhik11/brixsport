// src/routes/track.ts
import { Router } from 'express';
import { TrackController } from '../controllers/trackControllers';

const router = Router();
const trackController = new TrackController();

/**
 * @swagger
 * /track/fixtures:
 *   get:
 *     summary: Get track events fixtures
 *     tags: [Track Events]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to get fixtures for (defaults to today)
 *       - in: query
 *         name: competition_id
 *         schema:
 *           type: integer
 *         description: Filter by competition ID
 *     responses:
 *       200:
 *         description: Track events fixtures grouped by time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     events:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/TrackEvent'
 *                     total:
 *                       type: integer
 */
router.get('/fixtures', trackController.getTrackFixtures);

/**
 * @swagger
 * /track/events:
 *   post:
 *     summary: Create new track event
 *     tags: [Track Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - competition_id
 *               - event_name
 *               - event_type
 *               - gender
 *               - scheduled_time
 *             properties:
 *               competition_id:
 *                 type: integer
 *               event_name:
 *                 type: string
 *               event_type:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, mixed]
 *               scheduled_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Track event created successfully
 */
router.post('/events', trackController.createTrackEvent);

/**
 * @swagger
 * /track/events/{id}/status:
 *   patch:
 *     summary: Update track event status
 *     tags: [Track Events]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed]
 *     responses:
 *       200:
 *         description: Track event status updated
 *       404:
 *         description: Track event not found
 */
router.patch('/events/:id/status', trackController.updateTrackEventStatus);

export default router;
