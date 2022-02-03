import Resource from './resource'

export default class Salon extends Resource {
  constructor() {
    super('salones')
  }
}

export const SalonResource = new Salon()
