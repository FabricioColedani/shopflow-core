import { NextFunction, Request, Response } from 'express';
import { PedidosService } from './pedidos.service';

export class PedidosController {
  constructor(private readonly service: PedidosService) {}

  procesarPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedido = await this.service.procesarPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  };
}
