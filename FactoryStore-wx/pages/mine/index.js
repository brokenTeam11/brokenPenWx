// pages/mine/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取商品详情
    app.req('my/index', {
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            data: res.data
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toCoupon:function(){
    wx.navigateTo({
      url: '/pages/coupon/index',
    })
  },
  toMyOrder:function () {
    wx.navigateTo({
      url: './my-order/my-order',
    })
  },
  toCollcetion:function () {
    wx.navigateTo({
      url: './collection/collection-edit/index',
    })
  },
  toFootprint:function () {
    wx.navigateTo({
      url: './footprint/footprint-edit/index',
    })
  },
  tapOnOrder:function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: './my-order/my-order?id=' + e.currentTarget.dataset.id
    })
  },
  /***
   * 登录授权
   */
  getAuthorization:function () {
    app.getUser().then(res=>{
      if (res==='未授权') {
        wx.navigateTo({
          url: '/pages/authorization/index'
        })
      }
    }).catch(res=>{
      console.error(res)
    })
  },
  /**
   * 跳转地址管理
   */
  toAddressManage:function(){
    wx.navigateTo({
      url: '/pages/address/addressManage/index',
    })
  },
  /**
   * 前往帮助中心
   */
  toHelpCenter() {
    wx.navigateTo({
      url: '/pages/mine/helpcenter/index'
    })
  },
  /**
   * 前往了解工厂店
   */
  toAbouUs() {
    wx.navigateTo({
      url: '/pages/mine/aboutUs/index'
    })
  },
  /**
   * 前往评价列表
   */
  toEvaluationList:function(){
    wx.navigateTo({
      url: '/pages/evaluation/list/index'
    })
  }
})