import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           example: Juan
 *         last_name:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: miPassword123
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         payload:
 *           type: string
 *           description: ID del usuario creado
 *           example: 64a7f2c3e4b0a12345678901
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: juan.perez@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: miPassword123
 *
 *     UserPayload:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64a7f2c3e4b0a12345678901
 *         first_name:
 *           type: string
 *           example: Juan
 *         last_name:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           example: juan.perez@gmail.com
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         error:
 *           type: string
 *           example: Incomplete values
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposFaltantes:
 *                 summary: Faltan campos obligatorios
 *                 value:
 *                   status: error
 *                   error: Incomplete values
 *               usuarioExistente:
 *                 summary: El email ya está registrado
 *                 value:
 *                   status: error
 *                   error: User already exists
 */
router.post('/register', sessionsController.register);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión y devuelve una cookie con JWT
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso. Se setea la cookie coderCookie con el token JWT
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: coderCookie=eyJhbGci...; Max-Age=3600000; Path=/
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
 *                   example: Logged in
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposFaltantes:
 *                 summary: Faltan campos
 *                 value:
 *                   status: error
 *                   error: Incomplete values
 *               passwordIncorrecto:
 *                 summary: Contraseña incorrecta
 *                 value:
 *                   status: error
 *                   error: Incorrect password
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: User doesn't exist
 */
router.post('/login', sessionsController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtiene el usuario actual desde la cookie JWT protegida
 *     tags: [Sessions]
 *     parameters:
 *       - in: cookie
 *         name: coderCookie
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT seteado al hacer login
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/UserPayload'
 *       401:
 *         description: Cookie ausente o token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: error
 *               error: Unauthorized
 */
router.get('/current', sessionsController.current);

/**
 * @swagger
 * /api/sessions/unprotectedLogin:
 *   get:
 *     summary: Login sin DTO (expone todos los datos del usuario en el token)
 *     description: >
 *       Igual que /login pero sin aplicar UserDTO. 
 *       El token contiene el objeto usuario completo incluyendo el hash de la contraseña.
 *       Usar solo para pruebas o desarrollo.
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: juan.perez@gmail.com
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         example: miPassword123
 *     responses:
 *       200:
 *         description: Login no protegido exitoso. Se setea la cookie unprotectedCookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: unprotectedCookie=eyJhbGci...; Max-Age=3600000; Path=/
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
 *                   example: Unprotected Logged in
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/unprotectedLogin', sessionsController.unprotectedLogin);

/**
 * @swagger
 * /api/sessions/unprotectedCurrent:
 *   get:
 *     summary: Obtiene el usuario actual desde la cookie JWT no protegida
 *     description: Lee la cookie unprotectedCookie y devuelve el payload completo del token sin filtrar.
 *     tags: [Sessions]
 *     parameters:
 *       - in: cookie
 *         name: unprotectedCookie
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT seteado al hacer unprotectedLogin
 *     responses:
 *       200:
 *         description: Payload del usuario sin filtrar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/UserPayload'
 *       401:
 *         description: Cookie ausente o token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

export default router;