import layout from '@/layout'

export const AdministracionRouterChildrens = [
  {
    path: 'categorias',
    name: 'Categorias',
    meta: { title: 'Categorias', elSvgIcon: 'Collection', affix: false, noCache: true },
    component: () => import('@/views/categoria/index')
  },
  {
    path: 'habitaciones',
    name: 'Habitaciones',
    meta: { title: 'Habitaciones', elSvgIcon: 'House', affix: false, noCache: true },
    component: () => import('@/views/habitacion/index')
  },
  {
    path: 'salones',
    name: 'Salones',
    meta: { title: 'Salones', elSvgIcon: 'HomeFilled', affix: false, noCache: true },
    component: () => import('@/views/salon/index')
  },
  {
    path: 'personas',
    name: 'Personas',
    meta: { title: 'Personas', elSvgIcon: 'User', affix: false, noCache: true },
    component: () => import('@/views/persona/index')
  },
  {
    path: 'cuadernos-de-novedades',
    name: 'CuadernosDeNovedades',
    meta: { title: 'Cuadernos de Novedades', elSvgIcon: 'Notebook', affix: false, noCache: true },
    component: () => import('@/views/cuadernoDeNovedades/index')
  }
]

const AdministracionRoute = {
  path: '/administracion',
  component: layout,
  redirect: '/administracion/categorias',
  meta: { title: 'Administración', elSvgIcon: 'Setting', roles: ['admin'], breadcrumb: false },
  children: AdministracionRouterChildrens
}

export default AdministracionRoute
