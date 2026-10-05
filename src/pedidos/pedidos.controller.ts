import { Request, Response, NextFunction } from 'express';
import { PedidosService } from './pedidos.service';

export class PedidosController {
  constructor(private service: PedidosService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usuarioId, productosComprados } = req.body;
      
      // Llamar a procesarPedido en lugar de crearPedido
      const pedidoRealizado = await this.service.procesarPedido({ usuarioId, productosComprados });
      
      return res.status(201).json(pedidoRealizado);
    } catch (error) {
      next(error);
    }
  };
}