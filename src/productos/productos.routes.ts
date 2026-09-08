import { Router } from 'express';
import { ProductosRepository } from './productos.repository';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';

const router = Router();

// Inyección de dependencias
const repository = new ProductosRepository();
const service = new ProductosService(repository);
const controller = new ProductosController(service);

// Definición de rutas
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export { router as productosRouter };