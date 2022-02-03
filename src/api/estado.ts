import Resource from './resource'

export default class Estado extends Resource {
  constructor() {
    super('estados')
  }
}

export const EstadoResource = new Estado()
