import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export class AuthController {
  // 1. Registro
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body) {
        throw new AppError('El cuerpo de la petición no puede estar vacío', 400);
      }

      const { nombre, email, password, rol } = req.body;
      if (!email || !password || !nombre) {
        throw new AppError('Todos los campos son obligatorios', 400);
      }

      const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
      if (usuarioExiste) {
        throw new AppError('El email ya está registrado', 400);
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          rol: rol || 'USER',
        },
        select: { id: true, nombre: true, email: true, rol: true },
      });

      return res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
      next(error);
    }
  }

  // 2. Login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        throw new AppError('Credenciales inválidas', 401);
      }

      const payload = { id: usuario.id, rol: usuario.rol };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      await prisma.refreshToken.create({
        data: { token: refreshToken, usuarioId: usuario.id },
      });

      return res.json({ mensaje: 'Inicio de sesión exitoso', accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  // 3. Renovación de Tokens
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AppError('Refresh Token requerido', 401);

      const tokenGuardado = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!tokenGuardado) throw new AppError('Refresh Token inválido o revocado', 403);

      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const newAccessToken = jwt.sign({ id: payload.id, rol: payload.rol }, JWT_SECRET, { expiresIn: '15m' });

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      next(new AppError('Token de refresco no válido o expirado', 403));
    }
  }
}