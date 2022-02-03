import request from '@/utils/axiosReq'
import { ObjTy } from '@/types/common'
import Resource from './resource'

export function loginReq(data: ObjTy) {
  return request({
    url: '/users/login',
    data: data,
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/users/me',
    bfLoading: false,
    method: 'get'
  })
}

export default class User extends Resource {
  constructor() {
    super('users')
  }
  signup(resource: ObjTy, isAdmin = false) {
    return request({
      url: '/' + this.uri + '/sign-up' + (isAdmin ? '/admin' : ''),
      method: 'post',
      data: resource
    })
  }
}

export const UserResource = new User()
