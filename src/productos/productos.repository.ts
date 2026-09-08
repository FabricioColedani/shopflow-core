import prisma from '../config/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { Producto } from './producto.entity';

export class ProductosRepository {
  constructor(private readonly prismaClient: PrismaClient = prisma) {}

  async obtenerTodos(filtroNombre?: string): Promise<Producto[]> {
    const productos = await this.prismaClient.producto.findMany({
      where: filtroNombre
        ? {
            nombre: {
              contains: filtroNombre,
              mode: 'insensitive'
            }
          }
        : undefined,
      orderBy: { id: 'asc' }
    });

    return productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio.toString()),
      stock: producto.stock ?? 0,
      categoriaId: producto.categoriaId ?? undefined
    }));
  }

  async buscarPorId(id: number): Promise<Producto | null> {
    const producto = await this.prismaClient.producto.findUnique({
      where: { id }
    });

    if (!producto) {
      return null;
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio.toString()),
      stock: producto.stock ?? 0,
      categoriaId: producto.categoriaId ?? undefined
    };
  }

  async guardar(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const creado = await this.prismaClient.producto.create({
      data: {
        nombre: producto.nombre,
        precio: new Prisma.Decimal(producto.precio.toFixed(2)),
        stock: producto.stock ?? 0,
        categoriaId: producto.categoriaId
      }
    });

    return {
      id: creado.id,
      nombre: creado.nombre,
      precio: Number(creado.precio.toString()),
      stock: creado.stock,
      categoriaId: creado.categoriaId ?? undefined
    };
  }

  async actualizar(id: number, datos: Partial<Producto>): Promise<boolean> {
    try {
      await this.prismaClient.producto.update({
        where: { id },
        data: {
          ...(datos.nombre !== undefined && { nombre: datos.nombre }),
          ...(datos.precio !== undefined && { precio: new Prisma.Decimal(datos.precio.toFixed(2)) }),
          ...(datos.stock !== undefined && { stock: datos.stock }),
          ...(datos.categoriaId !== undefined && { categoriaId: datos.categoriaId })
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      await this.prismaClient.producto.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
}