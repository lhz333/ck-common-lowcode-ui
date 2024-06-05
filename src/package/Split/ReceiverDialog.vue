<template>
  <el-dialog
    title="解密信息"
    :visible.sync="dialogVisible"
    width="30%"
    append-to-body
    :before-close="handleClose"
  >
    <div class="info">
      <i type="primary" class="el-icon-info"></i>
      <span v-if="receiverInfo">
        {{
          `收件人：${receiverInfo.receiverName}, 手机号：${receiverInfo.receiverMobile},详细地址：${receiverInfo.receiverAddress}`
        }}
      </span>
      <span v-else>系统解密失败</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'ReceiverDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    receiverInfo: {
      default: null
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  display: flex;
  align-items: center;
  .el-icon-info {
    color: #e6a23c;
    font-size: 22px;
    margin-right: 6px;
    vertical-align: middle;
  }
}
</style>
