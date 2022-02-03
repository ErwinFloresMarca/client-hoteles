import Resource from './resource'

export default class Categoria extends Resource {
  constructor() {
    super('categorias')
  }
}

export const CategoriaResource = new Categoria()
