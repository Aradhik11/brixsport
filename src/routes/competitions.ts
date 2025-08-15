// src/routes/competitions.ts
import { Router } from 'express';
import { CompetitionController } from '../controllers/competitionController';

const router = Router();
const competitionController = new CompetitionController();

/**
 * @swagger
 * /competitions:
 *   get:
 *     summary: Get all competitions
 *     tags: [Competitions]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [football, basketball, track]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, upcoming]
 *     responses:
 *       200:
 *         description: List of competitions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Competition'
 */
router.get('/', competitionController.getAllCompetitions);

/**
 * @swagger
 * /competitions/{id}:
 *   get:
 *     summary: Get competition by ID
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Competition details with matches
 *       404:
 *         description: Competition not found
 */
router.get('/:id', competitionController.getCompetitionById);

/**
 * @swagger
 * /competitions:
 *   post:
 *     summary: Create new competition
 *     tags: [Competitions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [football, basketball, track]
 *               category:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Competition created successfully
 */
router.post('/', competitionController.createCompetition);

export default router;