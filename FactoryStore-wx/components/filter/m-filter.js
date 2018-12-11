// components/m-filter.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   * havImage:是否有顶部图片
   * marginTop:模块距离上方模块距离。
   */
  properties: { 
    filtersData:{
      type: Object
    },
    // isShow:{
    //   type:Boolean,
    //   value:false
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodslist: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isDisabled:true,
    kinds:{},
    prices:{}
  },

  /**
   * 组件的生命周期
   */

  /**
   * 组件的方法列表
   */
  methods: {
    _closeFilter:function () {
      this.setData({
        isShow:false
      })
    },
    submitFliter:function () {
      console.log(1)
    },
    getPrice:function (e) {
      const price = []
      price.push(e.detail.lowPrice)
      price.push(e.detail.highPrice)
      this.setData({
        prices: { price }
      })
    },
    getKind:function (e) {
      console.log(e.detail)
      const kinds = this.data.kinds || {}
      for(const key in e.detail){
        kinds[key]=e.detail[key]
      }
      this.setData({
        kinds
      })
    },
    _filterFunc:function () {
      const values = {
        values:this.data.kinds
      }
      this.triggerEvent('getList', { ...values,...this.data.prices})
      this.triggerEvent('closeFunc')
    },
    _closeFun:function () {
      this.triggerEvent('closeFunc')
    }
  }
})