// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import {
  showFullScreenLoading,
  tryHideFullScreenLoading
} from '@/utils/loading'
import { Message } from 'element-ui'
import { createUniqueString } from '@/utils/index'

axios.interceptors.request.use(
  config => {
    if (config.headers.isLoading !== false) {
      // 如果配置了isLoading: false，则不显示loading
      showFullScreenLoading()
    }
    let { clientId } = config.headers
    if(config.url.includes('/omsUrl')) {
      clientId = 'micro'
      config.headers['clientId'] = 'micro'
      config.url = config.url.slice(7)
    }
    config.headers['loginName'] = localStorage.getItem('username')
    config.headers["Brand"] = localStorage.getItem("brand");
    config.headers['Authorization'] = localStorage.getItem('token')
    if(!clientId) config.headers['clientId'] =  window.__MICRO_APP_ENVIRONMENT__ ? localStorage.getItem('clientId') : 'lowcode'
    config.headers['request_id'] = createUniqueString()
    config.headers['access_roles'] = localStorage.getItem('access_roles')
    /** 员工号 */
    let employeeId = localStorage.getItem('employeeId')
    if(employeeId) config.headers['staffNo'] = employeeId
    let brand = localStorage.getItem("brand")
    let roles = JSON.parse(localStorage.getItem('roles'))
    if (roles && brand && roles.length) {
      let role = roles[brand][0]
      if (role && role != 'null') {
        config.headers['areaCode'] = role
      }
    }
    /** 按钮 actionsId */
    let permissionActionId = sessionStorage.getItem('permissionActionId') || ''
    if(permissionActionId) config.headers['actionId'] = permissionActionId

    return config
  },
  error => {
    tryHideFullScreenLoading()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(error)
  }
)

const handleResponseStatus = (status) => {
  if (status == '401') {
    Message.error({
      message: '登录已过期，请您重新登录！'
    })
    if (window.__MICRO_APP_ENVIRONMENT__) {
      window.microApp.dispatch({ tokenExpired: true })
      return false
    } else {
      localStorage.clear()
    }
  }
}

// http响应拦截器
axios.interceptors.response.use(
  data => {
    tryHideFullScreenLoading()
    handleResponseStatus(data.data.StatusCode)
    return data
  },
  error => {
    //当返回信息为未登录或者登录失效的时候重定向为登录页面
    handleResponseStatus(error.response.status)

    if (error.response.status == '405') {
      Message.error({
        message: '您没有此功能的操作权限！'
      })
    }
    tryHideFullScreenLoading()
    return Promise.reject(error)
  }
)

export { axios }
