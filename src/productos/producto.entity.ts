export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoriaId?: number;
}