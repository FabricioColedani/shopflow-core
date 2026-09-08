import { Request, Response, NextFunction } from 'express';
import { CategoriasService } from './categorias.service';

export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  obtenerTodas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre } = req.query;
      const categorias = await this.service.obtenerTodas(nombre as string | undefined);
      res.status(200).json(categorias);
    } catch (error) {
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const categoria = await this.service.buscarPorId(id);
      res.status(200).json(categoria);
    } catch (error) {
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nuevaCategoria = await this.service.crear(req.body);
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const categoriaActualizada = await this.service.actualizar(id, req.body);
      res.status(200).json(categoriaActualizada);
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