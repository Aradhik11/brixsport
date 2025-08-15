// src/routes/home.ts
import { Router } from 'express';
import { HomeController } from '../controllers/homeControllers';

const router = Router();
const homeController = new HomeController();

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Get home screen data
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Home screen data including live and upcoming matches
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
 *                     liveFootball:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *                     upcomingFootball:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *                     liveBasketball:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *                     trackEvents:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TrackEvent'
 */
router.get('/home', homeController.getHomeData);

/**
 * @swagger
 * /home/matches/{sport}:
 *   get:
 *     summary: Get matches by sport type
 *     tags: [Home]
 *     parameters:
 *       - in: path
 *         name: sport
 *         required: true
 *         schema:
 *           type: string
 *           enum: [football, basketball, track]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, live, scheduled, completed]
 *     responses:
 *       200:
 *         description: Matches for the specified sport
 */
router.get('/matches/:sport', homeController.getMatchesBySport);

export default router;