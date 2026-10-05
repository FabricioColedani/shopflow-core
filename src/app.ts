import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { AuthController } from './auth/auth.controller';
import { requireAuth, checkPedidoOwnership } from './middlewares/authMiddleware';
import { loginLimiter, corsOptions } from './middlewares/hardening';
import { pedidosRouter } from './pedidos/pedidos.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares base
app.use(express.json());
app.use(corsOptions);

// Cargar y configurar Swagger UI
const swaggerPath = path.join(__dirname, '../swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// --- Rutas Públicas (Auth) ---
app.post('/api/auth/registro', AuthController.register);
app.post('/api/auth/login', loginLimiter, AuthController.login);
app.post('/api/auth/refresh', AuthController.refresh);

// --- Rutas Protegidas ---
app.use('/api/pedidos', requireAuth, pedidosRouter);

// Ruta con verificación IDOR
app.get('/api/pedidos/:id', requireAuth, checkPedidoOwnership, (req, res) => {
  res.json({ mensaje: 'Detalles del pedido obtenidos de forma segura' });
});

// Middleware global de errores
app.use(errorHandler);

export default app;