
import Clipboard from 'clipboard'
import { Message } from 'element-ui'
/**
 * @returns {string}
 */
export function createUniqueString () {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

// 判断解密地址是否修改
export function validReceiverChange(pageData, initReceiverInfo) {
  // 判断地址是否修改
  const receiverInfo = {
    receiverName: '收件人',
    receiverMobile: '手机号',
    receiverAddress: '详细地址'
  }
  const { receiverName, receiverMobile, receiverAddress } = pageData
  const fieldJosn = { receiverName, receiverMobile, receiverAddress }
  const {
    receiverName: name,
    receiverMobile: mobile,
    receiverAddress: adresss
  } = initReceiverInfo
  let isEdit =
    (receiverName != name ||
      receiverMobile != mobile ||
      receiverAddress != adresss) &&
    Object.values(fieldJosn).some(item => item.includes('*'))
  let str = ''
  Object.keys(receiverInfo).forEach(item => {
    if (fieldJosn[item].includes('*'))
      str += `${receiverInfo[item]}: ${fieldJosn[item]} `
  })
  return { isEdit, str }
}

export function deepClone (target) {
  if (target === null) return null
  if (typeof target !== 'object') return target
  const cloneTarget = Array.isArray(target) ? [] : {}
  for (let key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = this.deepClone(target[key])  // 递归
    }
  }
  return cloneTarget
}

/** 复制 */
export function copy (el) {
  let clipboard = new Clipboard(`.${el}`)
  clipboard.on('success', () => {
    Message({
      showClose: true,
      message: '复制成功',
      type: 'success'
    })
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    this.messageError('该浏览器不支持自动复制')
    // 释放内存
    clipboard.destroy()
  })
}

export function messageError (msg) {
  Message({
    showClose: true,
    message: msg,
    duration: 100000,
    type: 'error'
  })
}