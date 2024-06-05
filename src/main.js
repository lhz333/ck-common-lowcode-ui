import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' 

import '../src/assets/css/main.css'
import '../src/assets/css/eladmin.css'
import './assets/css/icon.css'

import { axios } from './utils/http.js'

//全局修改默认配置，点击空白处不能关闭弹窗
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI, {
  size: 'small'
})
Vue.prototype.$axios = axios

Vue.config.productionTip = false

import vSelectPage from 'v-selectpage'
Vue.use(vSelectPage, {
  dataLoad: function (vue, data, params) {
    return new Promise((resolve, reject) => {
      axios
        .get(data, {
          params: { ...params }
        })
        .then(resp => resolve(resp), resp => reject(resp))
    })
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
