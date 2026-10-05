import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  usuario?: { id: number; rol: string };
}

// Validar JWT firma y expiración[cite: 1, 2]
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(new AppError('Acceso denegado. No se proporcionó un token.', 401));

  try {
    const payloadDecodificado = jwt.verify(token, JWT_SECRET) as { id: number; rol: string };
    req.usuario = payloadDecodificado;
    next();
  } catch (error) {
    return next(new AppError('Token inválido o expirado.', 403));
  }
};

// Factoría de Roles (RBAC)[cite: 1, 2]
export const requireRole = (rolesPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return next(new AppError('No tienes los permisos necesarios.', 403));
    }
    next();
  };
};

// Verificación de Propiedad del Recurso (Prueba IDOR)
export const checkPedidoOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pedidoId = parseInt(req.params.id);
    const userId = req.usuario?.id;

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) return next(new AppError('Pedido no encontrado', 404));

    // Permitir si es ADMIN o si es el dueño del pedido
    if (req.usuario?.rol === 'ADMIN' || pedido.usuarioId === userId) {
      return next();
    }

    return next(new AppError('No tienes permisos sobre este recurso.', 403));
  } catch (error) {
    next(error);
  }
};