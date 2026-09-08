import { Router } from 'express';
import { CategoriasRepository } from './categorias.repository';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';

const router = Router();

// Inyección de dependencias
const repository = new CategoriasRepository();
const service = new CategoriasService(repository);
const controller = new CategoriasController(service);

// Definición de rutas
router.get('/', controller.obtenerTodas);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

export { router as categoriasRouter };