export interface ProductoComprado {
  productoId: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  total: number;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}
