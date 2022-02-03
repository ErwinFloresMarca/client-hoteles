import { loginReq, getInfoReq } from '@/api/user'
import { setToken, removeToken, getToken } from '@/utils/auth'
import { ObjTy } from '@/types/common'
import { UserTy } from '@/types/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    nombreUsuario: '',
    nombreCompleto: '',
    email: '',
    estado: false,
    avatar: '',
    fechaCreacion: new Date(),
    role: ''
  }
}

const state = getDefaultState()

const mutations = {
  M_id: (state: UserTy, id: string) => {
    state.id = id
  },
  M_nombreUsuario: (state: UserTy, nombreUsuario: string) => {
    state.nombreUsuario = nombreUsuario
  },
  M_avatar: (state: UserTy, avatar: string) => {
    state.avatar = avatar
  },
  M_fechaCreacion: (state: UserTy, fechaCreacion: Date) => {
    state.fechaCreacion = fechaCreacion
  },
  M_email: (state: UserTy, email: string) => {
    state.email = email
  },
  M_estado: (state: UserTy, estado: boolean) => {
    state.estado = estado
  },
  M_nombreCompleto: (state: UserTy, nombreCompleto: string) => {
    state.nombreCompleto = nombreCompleto
  },
  M_role: (state: UserTy, role: string) => {
    state.role = role
  }
}

const actions = {
  // user login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login({ commit }: ObjTy, data: ObjTy) {
    return new Promise((resolve, reject) => {
      loginReq(data)
        .then((res: ObjTy) => {
          if (res.statusCode === 200) {
            //commit('SET_Token', res.data?.jwtToken)

            setToken(res.data.token)
            resolve(null)
          } else {
            reject(res)
          }
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit }: ObjTy) {
    return new Promise((resolve, reject) => {
      getInfoReq()
        .then((response: ObjTy) => {
          const data = response.data
          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { role, nombreUsuario, nombreCompleto, id, avatar, estado, fechaCreacion, email } = data
          commit('M_nombreUsuario', nombreUsuario)
          commit('M_nombreCompleto', nombreCompleto)
          commit('M_id', id)
          commit('M_avatar', avatar)
          commit('M_estado', estado)
          commit('M_fechaCreacion', new Date(fechaCreacion))
          commit('M_email', email)
          commit('M_role', role)
          // commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // user logout
  logout() {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      // resetRouter()
      resolve(null)
    })
  },
  // remove token
  resetToken() {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resolve(null)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
