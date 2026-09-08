import { Given, When, Then, Before } from '@cucumber/cucumber';
import expect from 'expect';
import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/config/database';

let response: request.Response;
let idGuardado: number;

Before(() => {
  db.prepare('DELETE FROM productos').run();
});

Given('que la base de datos de productos está limpia', () => {
  db.prepare('DELETE FROM productos').run();
});

Given('que existe un producto guardado con nombre {string} y precio {int}', async (nombre: string, precio: number) => {
  const res = await request(app)
    .post('/api/v1/productos')
    .send({ nombre, precio });

  idGuardado = res.body.id;
});

Given('que existen los siguientes productos en la base de datos:', async (dataTable) => {
  const productos = dataTable.hashes();
  for (const prod of productos) {
    await request(app)
      .post('/api/v1/productos')
      .send({ nombre: prod.nombre, precio: Number(prod.precio) });
  }
});

When('envío una solicitud POST a {string} con el cuerpo:', async (ruta: string, docString: string) => {
  const body = JSON.parse(docString);
  response = await request(app).post(ruta).send(body);
});

When('envío una solicitud GET a {string}', async (ruta: string) => {
  const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
  response = await request(app).get(rutaFinal);
});

When('envío una solicitud PUT a {string} con el cuerpo:', async (ruta: string, docString: string) => {
  const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
  const body = JSON.parse(docString);
  response = await request(app).put(rutaFinal).send(body);
});

When('envío una solicitud DELETE a {string}', async (ruta: string) => {
  const rutaFinal = ruta.replace('{id_guardado}', String(idGuardado));
  response = await request(app).delete(rutaFinal);
});

Then('el código de respuesta debe ser {int}', (statusCode: number) => {
  expect(response.status).toBe(statusCode);
});

Then('el cuerpo de la respuesta debe contener un campo {string}', (campo: string) => {
  expect(response.body).toHaveProperty(campo);
});

Then('el campo {string} debe ser {string}', (campo: string, valor: string) => {
  expect(response.body[campo]).toBe(valor);
});

Then('el campo {string} debe ser {int}', (campo: string, valor: number) => {
  expect(response.body[campo]).toBe(valor);
});

Then('la respuesta debe contener un mensaje de error', () => {
  expect(response.body).toHaveProperty('error');
});

Then('la lista devuelta debe contener solo {int} elementos', (cantidad: number) => {
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBe(cantidad);
});