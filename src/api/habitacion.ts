import Resource from './resource'

export default class Habitacion extends Resource {
  constructor() {
    super('habitaciones')
  }
}

export const HabitacionResource = new Habitacion()
