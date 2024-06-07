<template>
  <div>
    <!-- 客服模块 - 换货 - 表单 -->
    <el-form
      v-if="pageType === 'exchange'"
      label-position="right"
      :model="params"
      :inline="true"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="店铺交易号">
            <v-selectpage
              style="min-width: 180px"
              ref="selectpage"
              title="单号"
              placeholder="店铺交易号"
              :data="`${API.order.getTradeList}`"
              v-model="params.taobaoTid"
              key-field="taobaoTid"
              show-field="taobaoTid"
              :result-format="resultFormat"
              @values="taobaoTidValues"
            ></v-selectpage>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="换货原因">
            <el-select
              v-model="params.exchangeReason"
              clearable
              @visible-change="$event => exchangeReasonSelect($event, item)"
            >
              <el-option
                v-for="item in reasonOps"
                :key="item.code"
                :label="item.type"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="返品承运商">
            <el-select v-model="params.returnShiptype" clearable>
              <el-option
                v-for="item in shipperList"
                :key="item.code"
                :label="item.title"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="返品运单号">
            <el-input
              v-model="params.returnTracknum"
              placeholder="请输入返品运单号"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- sku列表 -->
    <SkuList :skuListData="pageData.skuAndProductList" :warehouseAll="warehouseAll" />

    <el-form
      ref="form"
      :inline="true"
      :model="form"
      size="small"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="拆单数">
            <el-input-number
              style="width: 120px"
              v-model="form.splitNum"
              controls-position="right"
              :min="0"
              :max="10"
              @keyup.enter.native="changeSplitNum"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <!-- <el-col
        v-if="pageType === 'allTrades' && pageData.shopId == 20"
        :span="8"
      >
        <el-form-item label="是否取消原出库单">
          <el-switch
            active-value="1"
            inactive-value="0"
            v-model="form.isCancelStorageNO"
          ></el-switch>
        </el-form-item>
      </el-col> -->
      </el-row>
    </el-form>

    <!-- 拖拽表单区 -->
    <div style="margin-bottom: 30px;" v-if="form.splitNum">
      <Group
        v-for="(item, index) in form.splitNum"
        ref="dragGroup"
        :key="index"
        :orderShopId="orderShopId"
        :warehouseAll="warehouseAll"
        :storeOption="storeOption"
        :groupData="pageData.skuInfoVOList[index]"
        :taobaoTid="pageData.taobaoTid"
      />
    </div>

    <div class="sku-draggable-form">
      <el-form
        label-width="80px"
        ref="pageDataForm"
        :model="pageData"
        :rules="pageDataRules"
        :inline="true"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="收件人" prop="receiverName">
              <el-input v-model="pageData.receiverName" clearable>
                <el-button
                  slot="append"
                  icon="el-icon-view"
                  @click="onlinedDecrypt"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="receiverMobile">
              <el-input v-model="pageData.receiverMobile" clearable>
                <el-button
                  slot="append"
                  icon="el-icon-view"
                  @click="onlinedDecrypt"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮编">
              <el-input v-model="pageData.receiverZip" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省" prop="receiverState">
              <el-input v-model="pageData.receiverState" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市" prop="receiverCity">
              <el-input v-model="pageData.receiverCity" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区" prop="receiverDistrict">
              <el-input
                v-model="pageData.receiverDistrict"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="receiverAddress">
              <el-input v-model="pageData.receiverAddress" clearable>
                <el-button
                  slot="append"
                  icon="el-icon-view"
                  @click="onlinedDecrypt"
                ></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递类型" prop="shippingType">
              <el-select v-model="pageData.shippingType" clearable>
                <el-option
                  v-for="item in shipperList"
                  :key="item.code"
                  :label="item.title"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递单号">
              <el-input v-model="pageData.trackNumber" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <p class="submit-tip">提交前，请仔细检查拆单/换货数据是否填写正确</p>
      <el-button type="info" @click="close">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitSplitForm">确认</el-button>
    </div>

    <ReceiverDialog
      :dialogVisible.sync="receiverDialogVisible"
      :receiverInfo="receiverInfo"
    ></ReceiverDialog>
  </div>
</template>

<script>
import SkuList from './SkuList.vue'
import Group from './group.vue'
import ReceiverDialog from './ReceiverDialog.vue'
import API from '@/utils/api.js'
import { validReceiverChange } from '@/utils/index'

export default {
  name: 'CommonOmsSplit',
  data() {
    return {
      API,
      submitLoading: false,
      clearTaobaoTidValues: false,
      warehouseAll: [],
      shipperList: [],
      reasonOps:[],
      pageData: {
        skuAndProductList: [],
        guid: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverMobile: '',
        receiverName: '',
        receiverState: '',
        receiverAddress: '',
        shippingType: '',
        receiverZip: '',
        trackNumber: '',
        skuInfoVOList: [],
        taobaoTid: ''
      },
      params: {},
      checkExchangeRes: false,
      form: {
        splitNum: 0,
        isCancelStorageNO: '0'
      },
      pageDataRules: {
        receiverName: [{ required: true, trigger: 'blur', message: '请输入收件人姓名' }],
        receiverMobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
        receiverState: [{ required: true, trigger: 'blur', message: '请输入省' }],
        receiverCity: [{ required: true, trigger: 'blur', message: '请输入市' }],
        receiverDistrict: [{ required: true, trigger: 'blur', message: '请输入区' }],
        receiverAddress: [{ required: true, trigger: 'blur', message: '请输入详细地址' }],
        shippingType: [{ required: true, trigger: 'change', message: '请选择快递类型' }]
      },
      storeOption: [],
      orderShopId: '',
      receiverDialogVisible: false,
      receiverInfo: null,
      initReceiverInfo: {}
    }
  },
  components: {
    SkuList,
    Group,
    ReceiverDialog
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pageType: String,
    csexceptionType: String,
    isReissue: Boolean
  },
  created() {
    this.getShipperList()
    this.getWarehouses()
    this.getStoreInfo()
    
    const { receiverName, receiverMobile, receiverAddress } = this.rowData
    this.initReceiverInfo = { receiverName, receiverMobile, receiverAddress }

    if (this.pageType === 'allTrades') {
      this.orderShopId = this.rowData.shopId
      let id = !this.rowData.splitType
        ? this.rowData.taobaoTid
        : this.rowData.parent
      this.getSkuList(id)
    }
  },
  methods: {
    async getExchangeReason(shopid){
      if(!shopid) return
      let res = await this.$axios.get(API.lowcodeApi.getExchangeReason,{
        params:{
          shopid:shopid
        }
      })
      let { Status, Result } = { ...res.data }
      if (Status == "true") {
        this.reasonOps = Result
      }
    },
    exchangeReasonSelect() {
      if (!this.params.taobaoTid) {
        this.$message.error('请先选择店铺交易号')
        return false 
      }
    },
    // 获取订单解密数据
    async onlinedDecrypt() {
      let taobaotid = this.rowData.taobaoTid
      // 如果订单是合单的情况，需要传父订单（parent）字段进行解密
      if (this.rowData.parent && this.rowData.parent.length > 0) {
        taobaotid = this.rowData.parent
      }
      let res = await this.$axios.get(API.order.getOnlineDecrypt, {
        params: {
          oaid: this.rowData.oaid,
          taobaotid: taobaotid
        }
      })

      let { Status, Result, Msg } = { ...res.data }
      if (Status == 'true') {
        this.receiverInfo = Result
        this.receiverDialogVisible = true
      } else {
        this.$message.error(Msg)
      }
    },
    changeSplitNum() {},
    close() {
      this.$emit('close')
      this.clearFormData()
    },
    /**
     * 清除页面数据
     */
    clearFormData() {
      this.pageData = {
        skuInfoVOList: []
      }
      this.form.splitNum = 0
      if (this.pageType === 'exchange' && !this.clearTaobaoTidValues) {
        this.$refs.selectpage.$refs.search.value =
        this.$refs.selectpage.search = ''
        this.$refs.selectpage.remove()
      }
      this.clearTaobaoTidValues = false
      this.reasonOps = []
    },
    resultFormat(resp) {
      let gridResult = {}
      gridResult.totalRow = resp.data.Result.total
      gridResult.list = resp.data.Result.content || resp.data.Result
      if (resp && resp.data) return gridResult
    },
    // 获取仓位
    async getWarehouses () {
      let params = {
        type: 'EC'
      }
      let res = await this.$axios.get(API.system.getDataListInfo, {
        params: {
          sortName: 'id',
          sortOrder: '1',
          pageSize: '-1',
          table: 'oms_warehouse_info',
          id: '63',
          queryParameters: params
        }
      })
      let { Status, Result: { content } } = res.data
      if (Status == 'true') {
        this.warehouseAll = content
      }
    },
    /**
     * 店铺交易号
     */
    taobaoTidValues(data) {
      if (!data.length) {
        this.clearTaobaoTidValues = true
        this.clearFormData()
        return
      }
      this.form.splitNum = 0
      this.rowData = data[0]
      this.orderShopId = data[0].shopId
      this.getSkuList(data[0].taobaoTid)
      this.checkExchange()
    },
    /**
     * 判断是否是二次换货
     */
    async checkExchange() {
      let res = await this.$axios.get(API.order.checkExchange, {
        params: {
          outId: this.params.taobaoTid
        }
      })
      let { Status, Result } = res.data
      if (Status == 'true') {
        this.checkExchangeRes = Result
      }
    },
    /**
     * 快递
     */
    async getShipperList() {
      let res = await this.$axios.get(API.admin.shipperList)
      let { Status, Result } = { ...res.data }
      if (Status == 'true') {
        this.shipperList = Result
      }
    },
    // 门店列表
    async getStoreInfo() {
      let res = await this.$axios.get(API.customer.getStoreO2OList)
      let { Status, Result } = res.data
      if (Status == 'true') {
        this.storeOption = Result
      } else {
        this.$message.error(Result)
      }
    },
    // 获取sku列表
    async getSkuList(dataId) {
      let res = await this.$axios.get(
        `${API.order.listTradeByTaoBaoTidLastExchange}/${dataId}`
      )
      let { Status, Result } = res.data
      if (Status == 'true') {
        let {
          skuAndProductList,
          guid,
          receiverCity,
          receiverDistrict,
          receiverMobile,
          receiverName,
          receiverState,
          receiverAddress,
          shippingType,
          receiverZip,
          taobaoTid,
          trackNumber,
          shopId,
          returnShiptype,
          buyerNick,
          returnTracknum,
          warehouseCode
        } = { ...Result }
        // if ((shopId == 20 || shopId == 21) && this.pageType != 'exchange') {
        //   this.$confirm('唯品会平台没有换货/拆单业务，请谨慎操作', "确认", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   }).then(async () => { })
        // }
        let params = {
          skuAndProductList,
          guid,
          receiverCity,
          receiverDistrict,
          receiverMobile,
          receiverName,
          receiverState,
          receiverAddress,
          shippingType,
          receiverZip,
          taobaoTid,
          trackNumber,
          returnTracknum,
          shopId,
          returnShiptype,
          buyerNick,
          warehouseCode
        }
        this.pageData = { ...this.pageData, ...params }
        await this.getExchangeReason(this.pageData.shopId);
        // 拆单数默认为1
        if (skuAndProductList.length) {
          this.form.splitNum = 1
        }
      } else {
        this.$message.error(Result)
      }
    },
    // 提交拆单数据
    submitSplitForm() {
      if ( !this.form.splitNum || this.pageData.skuInfoVOList.some(item => !item.itemsDetaileList.length)) {
        this.$message.error('请维护拆单/换货sku的信息')
        return
      }

      // 仓位校验
      let dragGroupValid = []
      if (this.$refs['dragGroup']) {
        this.$refs['dragGroup'].forEach(item => {
          dragGroupValid.push(
            new Promise(resolve => {
              item.$refs['ruleForm'].validate(valid => {
                if (valid) resolve()
              })
            })
          )
        })
      }

      // 表单校验
      const pageDataFormValid = new Promise(resolve => {
        this.$refs['pageDataForm'].validate(valid => {
          if (valid) resolve()
        })
      })

      // 校验sku数量大于0
      const flag = this.pageData.skuInfoVOList.some(item => {
        return item.itemsDetaileList.some(col => col.qty == 0)
      })
      if (flag) return this.$message.error('换货数量不能为0')

      // 校验同一拆单行 仓位不一致情况
      const warehouseflag = this.pageData.skuInfoVOList.some(item => {
        const firstValue = item.itemsDetaileList[0].warehousecode
        return item.itemsDetaileList.some(col => col.warehousecode != firstValue)
      })
      if (warehouseflag) return this.$message.error('存在仓位不一致商品，请修改后提交')
      
      const { isEdit, str } = validReceiverChange(
        this.pageData,
        this.initReceiverInfo
      )
      Promise.all([pageDataFormValid, ...dragGroupValid]).then(async () => {
        let info = ''
        if (this.rowData.type === '品牌直发') {
          info = '得物直发订单快递由官方指定，请确认后再拆单！'
        } else if (this.checkExchangeRes && this.pageType === 'exchange') {
          info = '已拆单订单是否要继续拆单/换货？'
        } else {
          info = '您是否要新建一次拆单/换货？'
        }
        if (isEdit) {
          info = `${str}未修改，是否确定提交`
        }
        this.$confirm(info, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            let paramsData = {},
            requestUrl = '',
            pageData = this.common.deepClone(this.pageData)
            pageData.skuInfoVOList = pageData.skuInfoVOList.map(item => {
              item.itemsDetaileList = item.itemsDetaileList.map(col => {
                if(col.sku) col.sku = typeof col.sku === 'string' ? col.sku : col.sku.guid
                return col
              })
              if (item.virtualCode === '100046' && item.storeCode) {
                item.virtualCode = item.storeCode
              } else {
                delete item.storeCode
              }
              return item
            })
            if (this.pageType === 'allTrades') {
              if(this.isReissue){
                paramsData = { ...pageData, isReissue: this.isReissue }
                requestUrl = API.customer.addTradeExchangeByReissue
              }else{
                paramsData = { ...pageData }
                requestUrl = API.order.addTradeExchange
              }
            } else {
              requestUrl = API.customer.addExchange
              paramsData = {
                exchangeVO: {
                  ...this.params,
                  ordercode: this.params.taobaoTid
                },
                addTradeExchangeVO: { ...pageData, ...this.params },
                checkExchangeRes: this.checkExchangeRes
              }
            }
            
            this.submitLoading = true
            let res = await this.$axios.post(requestUrl, { ...paramsData })
            let { Status, Msg } = res.data
            this.submitLoading = false
            if (Status == 'true') {
              this.$message.success(Msg)
              if (this.csexceptionType) this.updateFinnish()
              this.close()
              this.$emit('refresh')
            } else if(res.data.StatusCode === "809"){
              this.$message({
                showClose: true,
                duration: 0,
                type:'error',
                message: res.data.Msg
              })
              this.close()
              this.$emit('refresh')
            } else {
              this.$message.error(Msg)
            }
          })
          .catch(() => {})
      })
    },
    // 异常订单已处理
    async updateFinnish() {
      let res = await this.$axios.post(API.order.tradeUpdateFinnish, {
        guid: this.rowData.guid
      })
      let { Status, Msg, Result } = res.data
      if (Status == 'true') {
        this.$message.success(Msg)
      } else {
        this.$message.error(Result)
      }
    }
  },
  watch: {
    'form.splitNum'(newVal, oldVal) {
      if (newVal > oldVal && this.pageData.skuInfoVOList.length !== newVal) {
        if(this.pageData.skuAndProductList.length){
          if (newVal == 1) {
            this.pageData.skuInfoVOList.push({
              itemsDetaileList: this.common.deepClone(
                this.pageData.skuAndProductList
              ),
              tradeType: '',
              virtualCode: this.pageData.warehouseCode
            })
            return false
          }
          for (let i = oldVal; i < newVal; i++) {
            this.pageData.skuInfoVOList.push({
              itemsDetaileList: [],
              tradeType: '',
              virtualCode: this.pageData.warehouseCode
            })
          }
        }else {
          for (let i = oldVal; i < newVal; i++) {
            this.pageData.skuInfoVOList.push({
              itemsDetaileList: [{
                warehousecode: this.pageData.warehouseCode,
                qty: 1,
                sku: ''
              }],
              tradeType: '',
              virtualCode: this.pageData.warehouseCode
            })
          }
        }
        
      } else {
        this.pageData.skuInfoVOList.splice(0, oldVal - newVal)
      }
    }
  }
}
</script>

<style lang="less">
.sku-draggable-form {
  padding: 10px 10px 0 10px;
  margin-bottom: 50px;
  border: 1px dashed #aaa;
}
.submit-tip {
  text-align: right;
  color: red;
  margin: 5px 0;
}
.dialog-footer {
  text-align: right;
  padding: 10px 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #fff;
  width: 100%;
}

.view_image {
  margin-left: 20px;
  position: absolute;
}
</style>
