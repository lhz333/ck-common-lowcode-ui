export default {
  customer: {
    getStoreO2OList: '/omsUrl/admin/admin-center/admin/store/storeO2OList', // O2O门店列表
    addTradeExchangeByReissue: '/omsUrl/admin/customer-center/cep/case/addTradeExchangeByReissue', //客户收件异常拆单
    addExchange: '/omsUrl/admin/customer-center/cep/exchange/addExchange', //增加换货
  },
  order: {
    tradeUpdateFinnish: '/omsUrl/admin/order-center/order/trade/updateFinnish', // 更新客服报表已完成
    getTradeList: '/omsUrl/admin/order-center/order/return/comgrid/trade', //trade下拉数据列表
    getOnlineDecrypt: '/omsUrl/admin/order-center/order/manual/getOnlinedecrypt', // 获取订单解密信息
    checkExchange: '/omsUrl/admin/order-center/orderSplit/checkExchange', // 判断是否是二次换货
    listTradeByTaoBaoTidLastExchange: '/omsUrl/admin/order-center/order/manual/listTradeByTaoBaoTidLastExchange', // 拉取最新换货订单
    addTradeExchange: '/omsUrl/admin/order-center/orderSplit/addTradeExchange', //创建换货订单
  },
  admin: {
    /*************************  快递管理  **************************/
    shipperList: '/omsUrl/admin/admin-center/cep/shipper/shipperList' // 快递列表
  },
  lowcodeApi: {
    getOmsSkuV2: '/metaData/api/open/OmsSkuV2',
    getExchangeReason: '/metaData/api/open/getExchangeReason',
  },
  system: {
    getDataListInfo: '/omsUrl/admin/admin-center/admin/lower/getDataListInfo', // 仓位联动框
  }
}
