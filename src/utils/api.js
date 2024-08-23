export default {
  customer: {
    getStoreO2OList: '/metaData/api/open/store/storeO2OList', // O2O门店列表
    addTradeExchangeByReissue: '/metaData/api/flow/cep/case/addTradeExchangeByReissue', //客户收件异常拆单
    addExchange: '/metaData/api/flow/cep/exchange/addExchange', //增加换货
  },
  order: {
    tradeUpdateFinnish: '/metaData/api/open/order/trade/updateFinnish', // 更新客服报表已完成
    getTradeList: '/metaData/api/open/order/return/comgrid/trade', //trade下拉数据列表
    getOnlineDecrypt: '/metaData/api/flow/order/manual/getOnlinedecrypt', // 获取订单解密信息
    checkExchange: '/metaData/api/flow/orderSplit/checkExchange/byflow', // 判断是否是二次换货
    listTradeByTaoBaoTidLastExchange: '/metaData/api/flow/order/manual/listTradeByTaoBaoTidLastExchange', // 拉取最新换货订单
    addTradeExchange: '/metaData/api/flow/orderSplit/addTradeExchange', //创建换货订单
  },
  admin: {
    /*************************  快递管理  **************************/
    shipperList: '/metaData/api/open/cep/shipper/shipperList' // 快递列表
  },
  lowcodeApi: {
    getOmsSkuV2: '/metaData/api/open/OmsSkuV2',
    getExchangeReason: '/metaData/api/open/getExchangeReason',
  },
  system: {
    getDataListInfo: '/formAPI/base/dataList', // 仓位联动框，
    getShopConfigByKey: '/metaData/api/open/shopmanager/getShopConfigBykey', // 根据key获取店铺配置
  }
}
