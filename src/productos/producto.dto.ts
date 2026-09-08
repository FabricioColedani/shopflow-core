export interface CrearProductoDto {
  nombre: string;
  precio: number;
  stock?: number;
  categoriaId?: number;
}

export interface ActualizarProductoDto {
  nombre?: string;
  precio?: number;
  stock?: number;
  categoriaId?: number;
}