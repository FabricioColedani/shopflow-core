import { Router } from 'express';
import { PedidosRepository } from './pedidos.repository';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

const router = Router();

const repository = new PedidosRepository();
const service = new PedidosService(repository);
const controller = new PedidosController(service);

router.post('/pedidos', controller.procesarPedido);

export { router as pedidosRouter };
