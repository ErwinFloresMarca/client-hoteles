import Resource from './resource'

export default class Persona extends Resource {
  constructor() {
    super('personas')
  }
}

export const PersonaResource = new Persona()
