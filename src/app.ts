import express, { Application } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { productosRouter } from './productos/productos.routes';
import { categoriasRouter } from './categorias/categorias.routes';
import { pedidosRouter } from './pedidos/pedidos.routes';
import { notFoundHandler } from './middlewares/not-found';
import { errorHandler } from './middlewares/error-handler';
import { swaggerSpec } from './swagger/swagger';

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/productos', productosRouter);
app.use('/api/v1/categorias', categoriasRouter);
app.use('/api', pedidosRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;