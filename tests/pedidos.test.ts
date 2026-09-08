import request from 'supertest';
import app from '../src/app';

describe('Checkout de pedidos', () => {
  it('debe procesar un pedido exitoso y devolver 201', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({
        usuarioId: 1,
        productosComprados: [
          { productoId: 1, cantidad: 2 },
          { productoId: 2, cantidad: 1 }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total');
  });

  it('debe devolver 400 cuando falta info del cuerpo', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({ usuarioId: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
