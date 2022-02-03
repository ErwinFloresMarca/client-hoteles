import Resource from './resource'

export default class CuadernoDeNovedad extends Resource {
  constructor() {
    super('cuaderno-de-novedades')
  }
}

export const CuadernoDeNovedadResource = new CuadernoDeNovedad()
