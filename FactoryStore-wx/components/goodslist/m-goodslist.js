// components/m-goodlist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   * havImage:是否有顶部图片
   * marginTop:模块距离上方模块距离。
   */
  properties: {
    havImage: {
      type: Boolean,
      value: false,
    },
    marginTop: {
      type: String,
      value: "10rpx"
    },
    type: {
      type: Number,
      value: 2
    },
    goodslist: {
      type: Array,
      value: [{
        id: 1,
        image: "http://img.zbird.cn/ww3/aurora2/new/an/4.jpg",
        name: "大钻石",
        price: "500"
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 跳转商品详情
     * @param  {Object} e   操作对象，商品ID在wxml中赋值
     */
    toDetail: function(e) {
      // app.formidCallBack = res => {
      wx.navigateTo({
        url: '/pages/goods/detail?id=' + e.currentTarget.dataset.id,
      })
      // }
    }
  }
})