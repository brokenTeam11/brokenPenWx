//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    banner: [], //轮播数据
    hotList: [],
    newList: [],
    specialList: [],
    activityList: [],
    // start: 0, //数据开始条数
    // limit: 10, //每次请求条数
    // loading: false, //底部加载栏显示状态
    // noMore: false, //是否有更多数据
    customerservice: false, //在线客服显示状态
  },


  /**
   * 小程序生命周期
   */
  onLoad: function(options) {
    if (options.id && options.activityid && options.userid){
      wx.navigateTo({
        url: `/pages/gradGoodGoods/grabing/index?id=${options.id}&activityid=${options.activityid}&userid=${options.userid}`,
      })
    }
  },
  onShow: function(e) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取首页商品列表
    app.req('index/goodslist', {
        // start: that.data.start, 注释原因：首页改版
        // limit: that.data.limit 注释原因：首页改版
      })
      .then(res => {
        if (res.flag == '0') {
          that.setData({
            activityList: res.data.activity,
            hotList: res.data.hot,
            newList: res.data.new,
            specialList: res.data.special,
            // start: that.data.start + res.data.list.length 注释原因：首页改版
          })
          // 获取首页轮播和分类
          app.req("index/banner")
            .then(res => {
              if (res.flag == '0') {
                wx.hideLoading()
                that.setData({
                  banner: res.data.banner,
                  category: res.data.category
                })
              }
            })
            .catch(err => {
              wx.hideLoading()
              console.error(err)
            })
        }
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading()
      })
  },

  onPullDownRefresh: function(e) {
    let that = this;
    wx.showLoading({
      mask: true
    })
    // 获取首页商品列表
    app.req('index/goodslist', {
        // start: that.data.start, 注释原因：首页改版
        // limit: that.data.limit 注释原因：首页改版
      })
      .then(res => {
        if (res.flag == '0') {
          that.setData({
            activityList: res.data.activity,
            hotList: res.data.hot,
            newList: res.data.new,
            specialList: res.data.special,
            // start: that.data.start + res.data.list.length 注释原因：首页改版
          })
          // 获取首页轮播和分类
          app.req("index/banner")
            .then(res => {
              if (res.flag == '0') {
                that.setData({
                  banner: res.data.banner,
                  category: res.data.category
                })
                wx.hideLoading()
                wx.stopPullDownRefresh();
              }
            })
            .catch(err => {
              wx.hideLoading()
              wx.stopPullDownRefresh();
              console.error(err)
            })
        }
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading()
        wx.stopPullDownRefresh();
      })
  },
  //上拉触底事件
  // 注释原因：首页改版
  onReachBottom: function() {
    // let vm = this;
    // if (vm.data.loading) { //防止请求未完成多次触发
    //   return
    // }
    // this.setData({
    //   loading: true
    // })
    // app.req('index/goodslist', {
    //     start: vm.data.start,
    //     limit: vm.data.limit
    //   })
    //   .then(res => {
    //     if (res.flag == "0") {
    //       vm.setData({
    //         loading: res.data.list.length === 0 ? true : false,
    //         goodslist: vm.data.goodslist.concat(res.data.list),
    //         start: vm.data.start + res.data.list.length,
    //         noMore: res.data.list.length === 0 ? true : false
    //       })
    //     }
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  },
  /**
   * scroll-view 滚动触底事件
   * 注释原因：使用page滚动
   */
  // scrolltoLower: function() {
  //   let vm = this;
  //   if (vm.data.loading || vm.data.noMore) {
  //     return
  //   }
  //   // console.log(this.data.testheight)
  //   vm.setData({
  //     loading: true
  //   })
  //   setTimeout(function() {
  //     vm.setData({
  //       loading: false,
  //       noMore: true
  //     })
  //   }, 5000)
  // },

  //跳转商品列表
  toGoodsList: function(e) {
    wx.navigateTo({
      url: '../goods/list?detail=' + JSON.stringify(e.currentTarget.dataset.item)
    })
  },
  toHotNewList: e => {
    wx.navigateTo({
      url: '/pages/goods/hotAndNew/index?type=' + e.currentTarget.dataset.type,
    })
  },
  toGoodsDetail: e => {
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  toSpecial: function(e) {
    wx.navigateTo({
      url: '/pages/special/index?id=' + e.currentTarget.dataset.id,
    })
  },
  toGrab: function() {
    wx.navigateTo({
      url: '/pages/gradGoodGoods/grabing/index',
    })
  },
  toGrabById: function(e) {
    wx.navigateTo({
      url: '/pages/gradGoodGoods/grabing/index?id=' + e.currentTarget.dataset.id,
    })
  }
})