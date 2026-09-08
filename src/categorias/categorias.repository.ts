import prisma from '../config/prisma';
import { PrismaClient } from '@prisma/client';
import { Categoria } from './categoria.entity';

export class CategoriasRepository {
  constructor(private readonly prismaClient: PrismaClient = prisma) {}

  async obtenerTodas(filtroNombre?: string): Promise<Categoria[]> {
    const categorias = await this.prismaClient.categoria.findMany({
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

    return categorias;
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    return this.prismaClient.categoria.findUnique({ where: { id } });
  }

  async guardar(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    return this.prismaClient.categoria.create({
      data: {
        nombre: categoria.nombre
      }
    });
  }

  async actualizar(id: number, datos: Partial<Categoria>): Promise<boolean> {
    try {
      await this.prismaClient.categoria.update({
        where: { id },
        data: {
          ...(datos.nombre !== undefined && { nombre: datos.nombre })
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      await this.prismaClient.categoria.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}