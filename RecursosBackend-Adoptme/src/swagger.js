import  swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Adoptme',
      version: '1.0.0',
      description: 'Documentación de mi API con Swagger',
    },
    servers: [
      { url: 'http://localhost:8080' }
    ],
  },
  apis: ['./src/routes/*.js'], // archivos donde están los comentarios JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);

