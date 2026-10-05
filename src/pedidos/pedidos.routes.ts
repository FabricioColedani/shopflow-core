// src/pedidos/pedidos.routes.ts
import { Router } from 'express';
import { PedidosRepository } from './pedidos.repository';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

const router = Router();

// Instanciación manual con inyección de dependencias
const repository = new PedidosRepository();
const service = new PedidosService(repository);
const controller = new PedidosController(service);

router.post('/', controller.crear);

export { router as pedidosRouter };