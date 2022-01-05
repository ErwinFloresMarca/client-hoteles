/*vuex ts*/
import { RouterTy } from '@/types/router'

interface StateTy {
  app: AppTy
  permission: PermissionTy
  user: UserTy
}

interface UserTy {
  id: string
  nombreUsuario: string
  nombreCompleto: string
  estado: boolean
  email; string
  avatar: string
  role: string
  fechaCreacion: Date
  token: string
}

interface AppTy {
  sidebar: {
    opened: boolean
    //opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // withoutAnimation: false
  }
  device: 'desktop'
  cachedViews: Array<string>
}
interface PermissionTy {
  isGetUserInfo: boolean //是否已经设置了权限
  routes: RouterTy //将过滤后的异步路由和静态路由集合
  addRoutes: RouterTy //过滤后的异步路由
}
