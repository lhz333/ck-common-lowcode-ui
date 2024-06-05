<template>
  <div class="sku-draggable-content">
    <draggable
      tag="ul"
      :list="skuListData"
      ghostClass="ghostClass"
      :group="{ name: 'module', pull: 'clone', put: false }"
      :sort="false"
      :clone="cloneData"
      :move="handleMove"
      class="clear"
    >
      <li v-for="(item, index) in skuListData" :key="index">
        <p> 
          <i
            class="copyBtn copyBtn_SKU el-icon-document-copy"
            :data-clipboard-text="item.sku"
            title="复制SKU"
            @click="common.copy('copyBtn_SKU')"
          ></i>SKU：{{ item.sku }}</p>
        <p>数量：{{ item.qty }}</p>
        <p>仓位：{{ item.warehousename }}</p>
      </li>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name:'CommonOmsSkuList',
  data () {
    return {

    }
  },
  props: {
    skuListData: {
      type: Array
    },
    warehouseAll: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  components: {
    draggable
  },
  methods: {
    // 克隆元素
    cloneData (obj) {
      let data = this.common.deepClone(obj)
      if(data.warehousecode && !this.warehouseAll.some(item => item.warehousecode == data.warehousecode)) {
        data.storeCode = data.warehousecode
        data.warehousecode = '100046'
      }
      return data
    },
    // 移动到目标区域时 如果当前区域已经存在重复sku，则不允许添加
    handleMove (e) {
      let { sku } = e.draggedContext.element
      return !e.relatedContext.list.some(item => item.sku == sku)
    }
  }
}
</script>

<style lang="less">
.sku-draggable-content {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px dashed #aaa;
  ul {
    display: flex;
    align-items: center;
    li {
      min-width: 170px;
      padding: 5px 10px 0 10px;
      margin: 0 10px;
      border: 1px solid #ccc;
      p {
        margin-bottom: 5px;
      }
    }
  }
}
</style>