import layout from '@/layout'

export const UserRouterChildrens = [
  {
    path: 'index',
    name: 'Users',
    meta: { title: 'Usuario', elSvgIcon: 'UserFilled', affix: false, noCache: true },
    component: () => import('@/views/user/index')
  }
]

const UserRoute = {
  path: '/users',
  component: layout,
  redirect: '/users/index',
  meta: { title: 'Usuarios', roles: ['admin'], breadcrumb: false },
  children: UserRouterChildrens
}

export default UserRoute
