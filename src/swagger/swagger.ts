export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API de E-commerce',
    version: '1.0.0',
    description: 'Documentación interactiva de la API para pedidos y productos.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo'
    }
  ],
  paths: {
    '/api/pedidos': {
      post: {
        summary: 'Procesa un checkout de compra',
        tags: ['Pedidos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CheckoutRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Pedido procesado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CheckoutResponse'
                }
              }
            }
          },
          400: {
            description: 'La solicitud tiene datos incompletos o inválidos.'
          },
          422: {
            description: 'No hay stock suficiente para completar el pedido.'
          },
          500: {
            description: 'Error interno del servidor.'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ProductoComprado: {
        type: 'object',
        required: ['productoId', 'cantidad'],
        properties: {
          productoId: {
            type: 'integer',
            example: 1
          },
          cantidad: {
            type: 'integer',
            example: 2
          }
        }
      },
      CheckoutRequest: {
        type: 'object',
        required: ['usuarioId', 'productosComprados'],
        properties: {
          usuarioId: {
            type: 'integer',
            example: 1
          },
          productosComprados: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductoComprado'
            }
          }
        }
      },
      DetallePedido: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          pedidoId: { type: 'integer' },
          productoId: { type: 'integer' },
          cantidad: { type: 'integer' },
          precioUnitario: { type: 'number', example: 1500 }
        }
      },
      CheckoutResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 10 },
          usuarioId: { type: 'integer', example: 1 },
          total: { type: 'number', example: 5200 },
          estado: { type: 'string', example: 'FINALIZADO' },
          detalles: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/DetallePedido'
            }
          }
        }
      }
    }
  }
};
