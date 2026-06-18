import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a7f2c3e4b0a12345678902
 *         name:
 *           type: string
 *           example: Firulais
 *         specie:
 *           type: string
 *           example: Perro
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 2020-05-15
 *         image:
 *           type: string
 *           example: /public/img/firulais.jpg
 *         adopted:
 *           type: boolean
 *           example: false
 *
 *     CreatePetRequest:
 *       type: object
 *       required:
 *         - name
 *         - specie
 *         - birthDate
 *       properties:
 *         name:
 *           type: string
 *           example: Firulais
 *         specie:
 *           type: string
 *           example: Perro
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 2020-05-15
 *
 *     UpdatePetRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Firulais
 *         specie:
 *           type: string
 *           example: Gato
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 2021-03-10
 *         adopted:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Pet'
 */
router.get('/', petsController.getAllPets);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crea una nueva mascota sin imagen
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePetRequest'
 *     responses:
 *       200:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Valores incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Incomplete values
 */
router.post('/', petsController.createPet);

/**
 * @swagger
 * /api/pets/withimage:
 *   post:
 *     summary: Crea una nueva mascota con imagen
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Firulais
 *               specie:
 *                 type: string
 *                 example: Perro
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2020-05-15
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen de la mascota
 *     responses:
 *       200:
 *         description: Mascota creada con imagen exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Valores incompletos o imagen faltante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Incomplete values
 */
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);

/**
 * @swagger
 * /api/pets/{pid}:
 *   put:
 *     summary: Actualiza una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota (MongoDB ObjectId)
 *         example: 64a7f2c3e4b0a12345678902
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePetRequest'
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
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
 *                   example: pet updated
 *       404:
 *         description: Mascota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Pet not found
 */
router.put('/:pid', petsController.updatePet);

/**
 * @swagger
 * /api/pets/{pid}:
 *   delete:
 *     summary: Elimina una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota (MongoDB ObjectId)
 *         example: 64a7f2c3e4b0a12345678902
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
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
 *                   example: pet deleted
 *       404:
 *         description: Mascota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Pet not found
 */
router.delete('/:pid', petsController.deletePet);

export default router;