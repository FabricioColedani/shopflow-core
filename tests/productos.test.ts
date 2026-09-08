import request from 'supertest';
import app from '../src/app';
import { db } from '../src/config/database';

describe('Pruebas de Endpoints - API Productos (/api/v1/productos)', () => {
  let productoCreadoId: number;

  // Limpiar/preparar la base de datos antes de las pruebas
  beforeAll(() => {
    db.prepare('DELETE FROM productos').run();
  });

  // 1. Crear con datos válidos -> 201 y recurso creado
  it('Debe crear un recurso con datos válidos (201)', async () => {
    const res = await request(app)
      .post('/api/v1/productos')
      .send({
        nombre: 'Teclado Mecánico',
        precio: 45000
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Teclado Mecánico');
    expect(res.body.precio).toBe(45000);

    // Guardamos el ID para pruebas posteriores
    productoCreadoId = res.body.id;
  });

  // 2. Crear sin título/nombre -> 422
  it('Debe retornar 422 al intentar crear sin el campo obligatorio nombre', async () => {
    const res = await request(app)
      .post('/api/v1/productos')
      .send({
        precio: 1500
      });

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('error');
  });

  // 3. Consultar ID existente -> 200
  it('Debe retornar 200 al consultar un ID existente', async () => {
    const res = await request(app).get(`/api/v1/productos/${productoCreadoId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productoCreadoId);
    expect(res.body.nombre).toBe('Teclado Mecánico');
  });

  // 4. Consultar ID inexistente -> 404
  it('Debe retornar 404 al consultar un ID que no existe en la BBDD', async () => {
    const res = await request(app).get('/api/v1/productos/999999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // 5. Consultar ID inválido -> 400
  it('Debe retornar 400 al consultar con un ID no numérico', async () => {
    const res = await request(app).get('/api/v1/productos/abc-invalido');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // 6. Aplicar filtro -> Solo elementos coincidentes
  it('Debe retornar solo los elementos coincidentes al aplicar un filtro por query param', async () => {
    // Insertamos otro elemento para la prueba de filtrado
    await request(app)
      .post('/api/v1/productos')
      .send({ nombre: 'Mouse Inalámbrico', precio: 25000 });

    const res = await request(app).get('/api/v1/productos?nombre=Teclado');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nombre).toBe('Teclado Mecánico');
  });

  // 7. Modificar un campo válido -> 200
  it('Debe retornar 200 y el recurso modificado al actualizar un campo válido', async () => {
    const res = await request(app)
      .put(`/api/v1/productos/${productoCreadoId}`)
      .send({
        precio: 48000
      });

    expect(res.status).toBe(200);
    expect(res.body.precio).toBe(48000);
    expect(res.body.nombre).toBe('Teclado Mecánico');
  });

  // 8. Eliminar recurso existente -> 204
  it('Debe retornar 204 (No Content) al eliminar un recurso existente', async () => {
    const res = await request(app).delete(`/api/v1/productos/${productoCreadoId}`);

    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    // Verificamos que efectivamente fue eliminado de SQLite
    const resBusqueda = await request(app).get(`/api/v1/productos/${productoCreadoId}`);
    expect(resBusqueda.status).toBe(404);
  });

  // 9. Invocar ruta desconocida -> 404
  it('Debe retornar 404 al invocar una ruta o endpoint inexistente', async () => {
    const res = await request(app).get('/api/v1/ruta-desconocida-que-no-existe');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});