import { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma';

export class PedidosRepository {
  constructor(private readonly prismaClient: PrismaClient = prisma) {}

  getClient(): PrismaClient {
    return this.prismaClient;
  }
}
