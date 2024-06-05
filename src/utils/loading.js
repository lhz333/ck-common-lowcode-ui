import { Loading } from 'element-ui'

let loading
function startLoading (info) {
  loading = Loading.service({
    target: '.loading-area',
    lock: true,
    text: `${info}`,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.2)'
  })
}
function endLoading () {
  loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
const showFullScreenLoading = function (info = '加载中') {
  if (needLoadingRequestCount === 0) {
    startLoading(info)
  }
  needLoadingRequestCount++
}

const tryHideFullScreenLoading = function () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

export { showFullScreenLoading, tryHideFullScreenLoading }
