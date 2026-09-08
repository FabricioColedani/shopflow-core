export interface ProductoCompradoDto {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoDto {
  usuarioId: number;
  productosComprados: ProductoCompradoDto[];
}
