import { ObjTy } from './common'

export interface ICategoria {
  id?: string
  descripcion: string
  estado?: boolean
  fechaCreacion?: Date
}

export interface IHabitacion {
  id?: string
  codigo: string
  detalle: string
  precio: number
  estadoId?: string
  piso?: number
  categoriaId?: string
  fechaCreacion?: Date
  categoria?: ObjTy
  estado?: ObjTy
}

export interface ISalon {
  id?: string
  codigo: string
  detalle: string
  precio: number
  estadoId?: string
  fechaCreacion?: Date
}

export interface IPersona {
  id?: string
  tipoDocumento: 'CI' | 'NIT'
  documento: string
  nombres: string
  apellidos?: string
  correo?: string
  clave: string
  tipoPersonaId: string | undefined
  tipoPersona?: any
  estado?: boolean
  fechaCreacion?: Date
}

export interface ICuadernoDeNovedades {
  id?: string
  userId: string
  user?: any
  novedades: Array<any>
  fechaCreacion?: Date
}
export interface INovedad {
  detalle: string
  importancia: string
  fechaHora?: Date
}
