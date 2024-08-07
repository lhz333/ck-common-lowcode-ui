<template>
  <el-form 
    :model="groupData"
    ref="ruleForm"
    size="mini"
    :inline="true"
    label-position="left"
  >
    <draggable
      class="sku-draggable-group"
      v-model="groupData.itemsDetaileList"
      :group="{ name: 'module', put: true }"
      tag="ul"
      ghostClass="ghostClass"
      :animation="100"
      :move="handleMove"
    >
      <li
        v-for="(item, index) in groupData.itemsDetaileList"
        :key="index"
      >
        <el-form-item
          :prop="'itemsDetaileList.'+ index +'.sku'"
          label="SKU"
          :rules="{ required: true, message: '请选择sku', trigger: 'blur'}"
        >
          <el-select
            v-model="item.sku"
            :ref="`sku${index}refs`"
            placeholder="请选择sku"
            filterable
            clearable
            remote
            :remote-method="getSkuData"
            @visible-change="$event => skuSelectShow($event, item)"
            @change="$event => skuChange($event, item)"
            value-key="index"
          >
            <el-option v-if="skuDataList.length" value="title" disabled>
              <span class="select-page-item-guid">SKU</span>
              <span class="select-page-item-shortDesc">物理仓仓位</span>
              <span class="select-page-item-qty">数量</span>
            </el-option>
            <el-option
              v-for="(cell, index) in skuDataList"
              :key="index"
              :label="cell.guid"
              :value="{ index, ...cell }"
            >
              <span class="select-page-item-guid">{{ cell.guid }}</span>
              <span class="select-page-item-shortDesc">{{ cell.shortDesc }}</span>
              <span class="select-page-item-qty">{{ cell.availableQty }}</span>
            </el-option>
            <el-pagination
              small
              layout="prev, pager, next"
              @current-change="$event => changeNumber($event, index)"
              :page-size="10"
              :current-page="selectPageOption.pageNumber"
              :total="selectPageOption.total"
              :hide-on-single-page="true"
              style="width: 100%; bottom: 0;background: #fff;"
            ></el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item
          :prop="'itemsDetaileList.'+ index +'.qty'"
          label="数量"
          :rules="{ required: true, message: '请输入数量', trigger: 'blur'}"
        >
          <el-input-number v-model="item.qty" controls-position="right" :min="0" ></el-input-number>
        </el-form-item>
        <el-form-item
          :prop="'itemsDetaileList.'+ index +'.warehousecode'"
          label="仓位"
          :rules="{ required: true, message: '请选择仓位', trigger: 'blur'}"
        >
          <el-select
            clearable
            v-model="item.warehousecode"
            placeholder="请选择仓位"
            @visible-change="$event => changeVirtualCode($event, item)"
          >
            <el-option
              v-for="cell in warehouseAll"
              :key="cell.warehousecode"
              :label="cell.branch_desc"
              :value="cell.warehousecode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="item.warehousecode === '100046'"
          :prop="'itemsDetaileList.'+ index +'.storeCode'"
          label="门店"
          :rules="{ required: true, message: '请选择o2o仓位门店', trigger: 'blur'}"
        >
          <!-- <el-row>
            <el-col :span="18"> -->
              <el-select
                v-model="item.storeCode"
                placeholder="请输入门店信息"
                filterable
                clearable
                @change="changeStoreBranch"
              >
                <el-option
                  v-for="cell in storeOption"
                  :key="cell.branch"
                  :label="cell.branchDesc"
                  :value="String(cell.branch)">
                  <span style="float: left">{{ cell.branchDesc }}</span>
                  <span style="float: right;" v-if="cell.showEnable">开店</span>
                  <span style="float: right; color: red" v-else>闭店</span>
                </el-option>
              </el-select>
            <!-- </el-col>
            <el-col :span="4">
              <el-button
                v-permission="['匹配门店']"
                type="primary"
                @click="matchBranch"
                style="padding: 5px;margin-left: -10px;"
              >匹配门店</el-button>
            </el-col>
          </el-row> -->
        </el-form-item>
        <img v-if="item.isChange" class="change_image" src="./images/exchanged.png" alt="">
        <i class="el-icon-error close-icon" @click="handleRemove(index)"></i>
      </li>
    </draggable>
  </el-form>
</template>

<script>
import draggable from 'vuedraggable'
import API from '@/utils/api.js'

export default {
  name:'CommonOmsGroup',
  data () {
    return {
      otoShops: [],
      skuDataList: [],
      selectPageOption: {
        pageNumber: 1,
        total: 10
      },
      oldSkuValue: null
    }
  },
  props: {
    orderShopId: Number,
    taobaoTid: String,
    groupData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    warehouseAll: {
      type: Array,
      default: () => {
        return []
      }
    },
    storeOption: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    draggable
  },
  computed: {
    isO2OStore () {
      return this.groupData.virtualCode && !this.warehouseAll.some(item => item.warehousecode == this.groupData.virtualCode)
    }
  },
  created () {
    this.getShopConfigByKey()
    this.getSkuData()
  },

  methods: {
    // 移动到目标区域时 如果当前区域已经存在重复sku，则不允许添加
    handleMove (e) {
      let { sku } = e.draggedContext.element
      return !e.relatedContext.list.some(item => item.sku == sku)
    },
    handleRemove (index) {
      this.groupData.itemsDetaileList.splice(index, 1)
    },
    skuSelectShow(val, item) {
      if(!val) {
        this.selectPageOption.pageNumber = 1
        return false
      } else {
        this.oldSkuValue = this.common.deepClone(item.sku)
        if(!this.skuDataList.length) this.changeNumber(1)
      }
    },
    // sku下拉框添加换货逻辑
    skuChange(data, item) {
      if (!data) return
      let { guid: sku, realCode: warehousecode, availableQty } = data
      if (!availableQty) {
        this.$message.error('此sku数量为0, 不可换货')
        this.$set(item, 'sku', this.oldSkuValue)
        return
      }
      if (this.groupData.itemsDetaileList.filter(col => {
        let itemsku = col.sku
        if(col.sku) itemsku = typeof col.sku === 'string' ? col.sku : col.sku.guid 
        return itemsku === sku
      }).length > 1) {
        this.$message.error('此目标区域已存在相同的sku')
        this.$set(item, 'sku', this.oldSkuValue)
        return
      }
      
      this.$set(item, 'isChange', true)
      this.groupData.itemsDetaileList.forEach(col => {
        col.warehousecode = warehousecode
      })
      this.$set(this.groupData, 'virtualCode', warehousecode)
    },
    changeNumber(val, index) {
      this.selectPageOption.pageNumber = val
      this.getSkuData(this.$refs[`sku${index}refs`] ? this.$refs[`sku${index}refs`][0].query : null)
    },
    async getSkuData(sku = null) {
      let res = await this.$axios.get(API.lowcodeApi.getOmsSkuV2,{
        params: {
          guid: sku,
          pageSize: 10,
          pageNumber: this.selectPageOption.pageNumber
        }
      })
      let { Status, Result, Msg } = { ...res.data }
      if (Status == 'true') {
        this.skuDataList = Result.content || Result
        this.selectPageOption.total = Result.total || Result.length
      } else {
        this.$message.error(Msg)
      }
    },
    // 选择仓位
    changeVirtualCode (val, item) {
      const flag = this.otoShops.some(col => col.shopId === this.orderShopId && col.value === 'true')

      if (!flag && !val && item.warehousecode === '100046') {
        this.$confirm('当前订单不支持门店发货业务，请谨慎操作', "确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => { })
      }

      this.groupData.itemsDetaileList.forEach(col => {
        this.$set(col, 'warehousecode', item.warehousecode)
      })
      this.$set(this.groupData, 'virtualCode', item.warehousecode)
    },

    async getShopConfigByKey() {
      let res = await this.$axios.get(API.system.getShopConfigByKey , {
        params: {key: 'shop_store_router_enable'}
      })
      let { Status, Result, Msg } = res.data
      if(Status == 'true') {
        this.otoShops = Result
      } else {
        this.$message.error(Msg)
      }
    },
    /**
     * 根据 branch shopid 查找 storeId
     */
    async changeStoreBranch(branch) {
      this.groupData.itemsDetaileList.forEach(col => {
        this.$set(col, 'storeCode', branch)
      })
      this.$set(this.groupData, 'storeCode', branch)
    },
    // async matchBranch () {
    //   let skuList = this.common.deepClone(this.groupData.itemsDetaileList).map(cur => {
    //     if(cur.sku) return typeof cur.sku === 'string' ? cur.sku : cur.sku.guid
    //   }).filter(col => col).join(',')
    //   if(!skuList) return this.$message.error('请先选择sku')
    //   let params = { skuList, taobaoTid: this.taobaoTid }
    //   let res = await this.$axios.get(API.order.matchBranch, {
    //     params: params
    //   })
    //   let { Status, Result } = res.data
    //   if (Status == "true") {
    //     var values = Object.values(Result)
    //     if (values.length > 0) {
    //       let value = values[0]
    //       if (!values.some(item => item != value)) {
    //         this.handleVirtualCode(value, 'match')
    //       } else {
    //         this.$message.error('所选的商品不属于同一个仓位')
    //       }
    //     }
    //   }
    // },
    /**
     * 根据 storeId 查询对应门店
     */
    async handleVirtualCode (storeId, type = '') {
      if(!storeId) return
      let res = await this.$axios.get(API.customer.getStoreO2OList, {
        params: { branch: storeId }
      })
      let { Status, Result, Msg } = res.data
      if(Status == 'true') {
        let storeCode = Result.length ? Result[0].branch : storeId
        this.$set(this.groupData, 'storeCode', storeCode)
        this.$set(this.groupData, 'virtualCode', '100046')
        this.groupData.itemsDetaileList.forEach(col => {
          this.$set(col, 'warehousecode', '100046')
          this.$set(col, 'storeCode', storeCode)
        })
        if (!Result.length && type == 'match') this.$message.error('没有匹配到对应门店')
      } else {
        this.$message.error(Msg) 
      }
    }
  },
  watch: {
    'isO2OStore': {
      handler (val) {
        if (val) {
          this.handleVirtualCode(this.groupData.virtualCode)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scope>
.sku-draggable-group {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  overflow-x: auto;
  display: flex;
  align-items: center;
  border: 1px dashed #aaa;
  &.active, &:hover {
    border: 1px solid red;
  }
  li {
    position: relative;
    min-width: 240px;
    width: 240px;
    padding: 5px 10px 0 10px;
    margin: 0 10px;
    border: 1px solid #ccc;
    &:hover, &.active {
      border-color: rgb(64, 158, 255);
      .close-icon {
        display: block;
      }
    }
    .close-icon {
      position: absolute;
      top: -10px;
      right: -10px;
      display: none;
      font-size: 20px;
      z-index: 2;
      cursor: pointer;
    }
    .change_image {
      position: absolute;
      left: -15px;
      top: -10px;
      width: 30px;
      z-index: 2;
    }
  }
  .ghostClass {
    position: relative;
    height: 80px;
    line-height: 80px;
    overflow: hidden;
    background: #fff;
    border: 1px dashed rgb(64, 158, 255);
    &::after {
      content: '放到这里';
      display: block;
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      font-size: 16px;
      color: #666;
      z-index: 10;
    }
  }
}
.sku-draggable-group .el-form-item {
  margin-right: 0;
  margin-bottom: 8px;
  .el-form-item__content {
    width: 76%;
  }
}
.select-page-item {
  &-guid, &-shortDesc, &-qty {
    display: inline-block;
    margin-right: 10px;
  }
  &-guid {
    min-width: 130px;
  }
  &-shortDesc {
    min-width: 120px;
  }
  &-qty {
    min-width: 50px;
    margin-right: 0;
  }
}
</style>