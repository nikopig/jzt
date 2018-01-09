import axios from 'axios'
import Server from '@/common/js/server.js'
import qs from 'qs'
import config from './config'
let isProd = config.Environment !== 'dev'
let apiUrl = !isProd ? '/api/DataSource/doPostApi' : '/DataSource/doPostApi'
let yuyanUrl = !isProd ? '/yy/test-yu/servlet/' : 'http://10.3.87.48:8895/test-yu/servlet/'
// axios 配置
axios.defaults.timeout = 30000
axios.defaults.baseURL = '/'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export function fetch (url, params, type, operate) {
  return new Promise((resolve, reject) => {
    axios[type](url, params)
      .then(response => {
        var req
        if (!params.paras && type === 'post') {
          req = params
        } else {
          req = type === 'post' ? JSON.parse(params.paras).jsonParas : JSON.parse(params.params.paras).jsonParas
        }
        console.log('接口名：' + operate)
        console.log('入参：' + req)
        console.log(response.data)
        resolve(response.data)
        if (!response.data.Flag) {
          console.log(response.data.ErrInfo)
        }
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  // 用户信息
  userInfo: Server.getSessionSso(),
  // post请求
  post (operate, paras) {
    let param = null
    let tempParas = {
      methodname: operate,
      methodparam: JSON.stringify(paras)
    }
    if (tempParas) {
      param = JSON.stringify({requestType: 'post', jsonParas: JSON.stringify(tempParas)})
    }
    const inparas = {
      url: '/Jlp.Data.InterfaceService/api/inCall/Jlp_Service',
      paras: param
    }
    return fetch(apiUrl, inparas, 'post', operate)
  },
  // get方法
  get (operate, paras, noPower) {
    let param = {}
    if (paras) {
      param = {requestType: 'get', jsonParas: JSON.stringify(paras)}
    }
    if (!noPower) param.userId = this.userInfo.USERID
    param = JSON.stringify(param)
    const inparas = {
      url: '/Jlp.Data.InterfaceService/api/inCall/' + operate,
      paras: param
    }
    return fetch(apiUrl, {params: inparas}, 'get', operate)
  },
// 基础数据接口post方法
  basePost (operate, paras, noPower) {
    let param = {}
    if (paras) {
      param = {requestType: 'post', jsonParas: JSON.stringify(paras)}
    }
    if (!noPower) param.userId = this.userInfo.USERID
    param = JSON.stringify(param)
    const inparas = {
      url: '/Jlp.Data.InterfaceService/api/inCall/' + operate,
      paras: param
    }
    return fetch(apiUrl, inparas, 'post', operate)
  },
  // 基础数据接口post方法
  yuyan (operate, paras, noPower) {
    return fetch(yuyanUrl + operate, paras, 'post', operate)
  }
}
