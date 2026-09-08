import { ProductosRepository } from './productos.repository';
import { Producto } from './producto.entity';
import { CrearProductoDto, ActualizarProductoDto } from './producto.dto';
import { AppError } from '../errors/app-error';

export class ProductosService {
  constructor(private readonly repository: ProductosRepository) {}

  async obtenerTodos(filtroNombre?: string): Promise<Producto[]> {
    return this.repository.obtenerTodos(filtroNombre);
  }

  async buscarPorId(id: number): Promise<Producto> {
    this.validarId(id);

    const producto = await this.repository.buscarPorId(id);
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    return producto;
  }

  async crear(dto: CrearProductoDto): Promise<Producto> {
    if (!dto.nombre || dto.nombre.trim() === '') {
      throw new AppError('El nombre del producto es obligatorio', 422);
    }

    if (dto.precio === undefined || dto.precio < 0) {
      throw new AppError('El precio debe ser un número mayor o igual a 0', 422);
    }

    const stock = dto.stock ?? 0;

    return this.repository.guardar({
      nombre: dto.nombre.trim(),
      precio: dto.precio,
      stock,
      categoriaId: dto.categoriaId
    });
  }

  async actualizar(id: number, dto: ActualizarProductoDto): Promise<Producto> {
    this.validarId(id);

    const productoExistente = await this.repository.buscarPorId(id);
    if (!productoExistente) {
      throw new AppError('Producto no encontrado para actualizar', 404);
    }

    if (dto.nombre !== undefined && dto.nombre.trim() === '') {
      throw new AppError('El nombre del producto no puede estar vacío', 422);
    }

    const actualizado = await this.repository.actualizar(id, dto);
    if (!actualizado) {
      throw new AppError('No se pudo actualizar el producto', 400);
    }

    return (await this.repository.buscarPorId(id))!;
  }

  async eliminar(id: number): Promise<void> {
    this.validarId(id);

    const eliminado = await this.repository.eliminar(id);
    if (!eliminado) {
      throw new AppError('Producto no encontrado para eliminar', 404);
    }
  }

  private validarId(id: number): void {
    if (isNaN(id) || id <= 0) {
      throw new AppError('El ID proporcionado es inválido', 400);
    }
  }
}