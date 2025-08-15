// src/routes/favorites.ts
import { Router } from 'express';
import { FavoritesController } from '../controllers/favoritesController';

const router = Router();
const favoritesController = new FavoritesController();

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: User's favorite teams, players, and competitions
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
 *                     teams:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Team'
 *                     players:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Player'
 *                     competitions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Competition'
 */
router.get('/', favoritesController.getUserFavorites);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add item to favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - favorite_type
 *               - favorite_id
 *             properties:
 *               favorite_type:
 *                 type: string
 *                 enum: [team, player, competition]
 *               favorite_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to favorites
 */
router.post('/', favoritesController.addToFavorites);

/**
 * @swagger
 * /favorites:
 *   delete:
 *     summary: Remove item from favorites
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - favorite_type
 *               - favorite_id
 *             properties:
 *               favorite_type:
 *                 type: string
 *                 enum: [team, player, competition]
 *               favorite_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item removed from favorites
 */
router.delete('/', favoritesController.removeFromFavorites);

export default router;