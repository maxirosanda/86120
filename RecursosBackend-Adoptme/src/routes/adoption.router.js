import { Router } from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a7f2c3e4b0a12345678903
 *         owner:
 *           type: string
 *           description: ID del usuario que adoptó la mascota
 *           example: 64a7f2c3e4b0a12345678901
 *         pet:
 *           type: string
 *           description: ID de la mascota adoptada
 *           example: 64a7f2c3e4b0a12345678902
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 */
router.get('/', adoptionsController.getAllAdoptions);

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtiene una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción (MongoDB ObjectId)
 *         example: 64a7f2c3e4b0a12345678903
 *     responses:
 *       200:
 *         description: Adopción encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Adoption not found
 */
router.get('/:aid', adoptionsController.getAdoption);

/**
 * @swagger
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Crea una adopción asignando una mascota a un usuario
 *     description: >
 *       Vincula una mascota disponible a un usuario. Verifica que el usuario exista,
 *       que la mascota exista y que no haya sido adoptada previamente.
 *       Actualiza el array de mascotas del usuario, marca la mascota como adoptada
 *       y registra la adopción en la base de datos.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que adopta (MongoDB ObjectId)
 *         example: 64a7f2c3e4b0a12345678901
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a adoptar (MongoDB ObjectId)
 *         example: 64a7f2c3e4b0a12345678902
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Pet adopted
 *       400:
 *         description: La mascota ya fue adoptada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Pet is already adopted
 *       404:
 *         description: Usuario o mascota no encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               usuarioNoEncontrado:
 *                 summary: Usuario no existe
 *                 value:
 *                   status: error
 *                   error: user Not found
 *               mascotaNoEncontrada:
 *                 summary: Mascota no existe
 *                 value:
 *                   status: error
 *                   error: Pet not found
 */
router.post('/:uid/:pid', adoptionsController.createAdoption);

export default router;