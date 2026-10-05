import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app-error';
import { CrearPedidoDto } from './pedido.dto';
import { PedidosRepository } from './pedidos.repository';


export class PedidosService {
  constructor(private repository: any) {}

  async procesarPedido(dto: CrearPedidoDto) {
    this.validarPedido(dto);

    const prismaClient = this.repository.getClient();

    return prismaClient.$transaction(async (tx) => {
      const usuario = await tx.usuario.findUnique({
        where: { id: dto.usuarioId }
      });

      if (!usuario) {
        throw new AppError('Usuario no encontrado', 404);
      }

      const pedido = await tx.pedido.create({
        data: {
          usuarioId: dto.usuarioId,
          total: new Prisma.Decimal(0),
          estado: 'PENDIENTE'
        }
      });

      let total = 0;

      for (const item of dto.productosComprados) {
        const producto = await tx.producto.findUnique({
          where: { id: item.productoId }
        });

        if (!producto) {
          throw new AppError(`Producto con id ${item.productoId} no existe`, 400);
        }

        if (producto.stock < item.cantidad) {
          throw new AppError(`Stock insuficiente para ${producto.nombre}`, 422);
        }

        const precioUnitario = Number(producto.precio.toString());
        const subtotal = precioUnitario * item.cantidad;
        total += subtotal;

        await tx.producto.update({
          where: { id: producto.id },
          data: {
            stock: producto.stock - item.cantidad
          }
        });

        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precioUnitario: new Prisma.Decimal(precioUnitario.toFixed(2))
          }
        });
      }

      const pedidoActualizado = await tx.pedido.update({
        where: { id: pedido.id },
        data: {
          total: new Prisma.Decimal(total.toFixed(2)),
          estado: 'FINALIZADO'
        }
      });

      const detalles = await tx.detallePedido.findMany({
        where: { pedidoId: pedido.id },
        include: { producto: true }
      });

      return {
        id: pedidoActualizado.id,
        usuarioId: pedidoActualizado.usuarioId,
        total: Number(pedidoActualizado.total.toString()),
        estado: pedidoActualizado.estado,
        detalles: detalles.map((detalle) => ({
          id: detalle.id,
          pedidoId: detalle.pedidoId,
          productoId: detalle.productoId,
          cantidad: detalle.cantidad,
          precioUnitario: Number(detalle.precioUnitario.toString()),
          producto: detalle.producto
            ? {
                ...detalle.producto,
                precio: Number(detalle.producto.precio.toString())
              }
            : null
        }))
      };
    });
  }

  private validarPedido(dto: CrearPedidoDto): void {
    if (!dto || !dto.usuarioId || !Array.isArray(dto.productosComprados) || dto.productosComprados.length === 0) {
      throw new AppError('Faltan datos del pedido: usuarioId y productosComprados son requeridos', 400);
    }

    for (const item of dto.productosComprados) {
      if (!item || !Number.isInteger(item.productoId) || item.productoId <= 0 || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        throw new AppError('Cada producto debe incluir un productoId y una cantidad válidos', 400);
      }
    }
  }
}
