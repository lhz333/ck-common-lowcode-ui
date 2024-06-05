import CommonOmsSplit from '@/package/Split/index.vue'

const components = [ CommonOmsSplit ]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default install