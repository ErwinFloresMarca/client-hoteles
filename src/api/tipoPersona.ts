import Resource from './resource'

export default class TipoPersona extends Resource {
  constructor() {
    super('tipo-personas')
  }
}

export const TipoPersonaResource = new TipoPersona()
