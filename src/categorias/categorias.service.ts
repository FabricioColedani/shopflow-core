import { CategoriasRepository } from './categorias.repository';
import { Categoria } from './categoria.entity';
import { CrearCategoriaDto, ActualizarCategoriaDto } from './categoria.dto';
import { AppError } from '../errors/app-error';

export class CategoriasService {
  constructor(private readonly repository: CategoriasRepository) {}

  async obtenerTodas(filtroNombre?: string): Promise<Categoria[]> {
    return this.repository.obtenerTodas(filtroNombre);
  }

  async buscarPorId(id: number): Promise<Categoria> {
    this.validarId(id);

    const categoria = await this.repository.buscarPorId(id);
    if (!categoria) {
      throw new AppError('Categoría no encontrada', 404);
    }

    return categoria;
  }

  async crear(dto: CrearCategoriaDto): Promise<Categoria> {
    if (!dto.nombre || dto.nombre.trim() === '') {
      throw new AppError('El nombre de la categoría es obligatorio', 422);
    }

    return this.repository.guardar({
      nombre: dto.nombre.trim()
    });
  }

  async actualizar(id: number, dto: ActualizarCategoriaDto): Promise<Categoria> {
    this.validarId(id);

    const existe = await this.repository.buscarPorId(id);
    if (!existe) {
      throw new AppError('Categoría no encontrada para actualizar', 404);
    }

    if (dto.nombre !== undefined && dto.nombre.trim() === '') {
      throw new AppError('El nombre de la categoría no puede estar vacío', 422);
    }

    const actualizado = await this.repository.actualizar(id, dto);
    if (!actualizado) {
      throw new AppError('No se pudo actualizar la categoría', 400);
    }

    return (await this.repository.buscarPorId(id))!;
  }

  async eliminar(id: number): Promise<void> {
    this.validarId(id);

    const eliminado = await this.repository.eliminar(id);
    if (!eliminado) {
      throw new AppError('Categoría no encontrada para eliminar', 404);
    }
  }

  private validarId(id: number): void {
    if (isNaN(id) || id <= 0) {
      throw new AppError('El ID proporcionado es inválido', 400);
    }
  }
}