import rateLimit from 'express-rate-limit';
import cors from 'cors';

// Rate Limiting para evitar ataques de fuerza bruta en login[cite: 2]
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos[cite: 2]
  max: 5, // Bloquea tras 5 intentos[cite: 2]
  message: { error: 'Demasiados intentos de inicio de sesión. Por favor, reintente en 15 minutos.' },
});

// Configuración segura de CORS[cite: 2]
export const corsOptions = cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000', //[cite: 2]
  optionsSuccessStatus: 200,
});