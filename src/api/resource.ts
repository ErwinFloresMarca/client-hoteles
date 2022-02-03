import { ObjTy } from '@/types/common'
import request from '@/utils/axiosReq'

/**
 * Simple RESTful resource class
 */
export default class Resource {
  uri: string
  constructor(uri: string) {
    this.uri = uri
  }
  list(query: ObjTy) {
    return request({
      url: '/' + this.uri,
      method: 'get',
      params: { filter: query }
    })
  }
  get(id: string, query: ObjTy) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'get',
      params: { filter: query }
    })
  }
  count(query: ObjTy) {
    return request({
      url: '/' + this.uri + '/count',
      method: 'get',
      params: { where: query }
    })
  }
  store(resource: ObjTy) {
    return request({
      url: '/' + this.uri,
      method: 'post',
      data: resource
    })
  }
  update(id: string, resource: ObjTy) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'patch',
      data: { ...resource, id: undefined }
    })
  }
  destroy(id: string, where?: ObjTy) {
    return request({
      url: '/' + this.uri + '/' + id,
      method: 'delete',
      params: { where: where }
    })
  }
}
