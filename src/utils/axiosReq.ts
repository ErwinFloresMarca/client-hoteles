import store from '@/store'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getToken, setToken } from '@/utils/auth'
import { AxiosConfigTy, AxiosReqTy } from '@/types/common'
let requestData: any
let loadingE: any
const service: any = axios.create({
  baseURL: import.meta.env.VITE_API_REST_BASE_URL ? (import.meta.env.VITE_API_REST_BASE_URL as string) : '',
  timeout: 30000 // 超时时间
})
// 请求拦截
service.interceptors.request.use(
  (request: AxiosReqTy) => {
    // console.log('request', request)
    // token配置
    request.headers['Authorization'] = `Bearer ${getToken()}`
    /* 下载文件*/
    if (request.isDownLoadFile) {
      request.responseType = 'blob'
    }
    if (request.isUploadFile) {
      request.headers['Content-Type'] = 'multipart/form-data'
    }
    requestData = request
    if (request.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: 'Cargando',
        spinner: 'el-icon-ElLoading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    /*
     *params会拼接到url上
     * */
    return request
  },
  (err: any) => {
    Promise.reject(err)
  }
)
// 响应拦截
service.interceptors.response.use(
  (res: any) => {
    // console.log('res', res)
    res.data = {
      data: res.data,
      statusCode: res.status
    }
    if (requestData.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (requestData.isDownLoadFile) {
      return res.data
    }
    const { statusCode, msg, isNeedUpdateToken, updateToken } = res.data
    //更新token保持登录状态
    if (isNeedUpdateToken) {
      setToken(updateToken)
    }
    if (statusCode >= 200 && statusCode < 300) {
      return res.data
    } else {
      if (requestData.isAlertErrorMsg) {
        ElMessage({
          message: msg,
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject(msg)
      } else {
        return res.data
      }
    }
  },
  (err: any) => {
    if (loadingE) loadingE.close()
    if (err && err.response && err.response.status) {
      if (err.response.code === 403) {
        ElMessageBox.confirm('No Cuenta Con los Permisos para realizar esta acción', {
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        ElMessage({
          message: err.response.data.error.message,
          type: 'error',
          duration: 2 * 1000
        })
      }
    } else {
      ElMessage({
        message: err,
        type: 'error',
        duration: 2 * 1000
      })
    }
    return Promise.reject(err)
  }
)

export default function khReqMethod({
  url,
  method,
  params,
  data,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg = true
}: AxiosConfigTy): any {
  return service({
    url: url,
    method: method ?? 'post',
    params: params ?? {},
    data: data ?? {},
    bfLoading: bfLoading ?? false,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg,
    baseURL: baseURL ?? import.meta.env.VITE_API_REST_BASE_URL,
    timeout: timeout ?? 15000
  })
}
