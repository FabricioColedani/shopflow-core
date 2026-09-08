import { Request, Response, NextFunction } from 'express';
import { ProductosService } from './productos.service';

export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  obtenerTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre } = req.query;
      const productos = await this.service.obtenerTodos(nombre as string | undefined);
      res.status(200).json(productos);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const producto = await this.service.buscarPorId(id);
      res.status(200).json(producto);
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nuevoProducto = await this.service.crear(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const productoActualizado = await this.service.actualizar(id, req.body);
      res.status(200).json(productoActualizado);
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.service.eliminar(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}