// components/gradGoodsNav/1.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myIndex: {
      type: String,
      value: '0',

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navList: [{
      title: "疯抢ing",
      icon: "icon-rushtobuy",
      url: '/pages/gradGoodGoods/grabing/index'
    }, {
      title: "即将开始",
      icon: "icon-start",
      url: '/pages/gradGoodGoods/aboutToStart/index'
    }, {
      title: "我的碎片",
      icon: "icon-fragment",
      url: '/pages/gradGoodGoods/myDebris/index'
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    redirectTo: function(e) {
      if (this.data.myIndex == e.currentTarget.dataset.index) {
        return false
      }
      wx.redirectTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})