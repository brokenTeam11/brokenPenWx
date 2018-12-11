// pages/gradGoodGoods/aboutToStart/index.js
const app = getApp()
let loading = false //
let start = 0
let noMore = false
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.req("panicbuying/nextactivity", {})
      .then(res => {
        that.setData({
          count: res.data.count,
          goodslist: res.data.goodslist,
          name: res.data.name,
          time: res.data.time
        })
        start = res.data.goodslist.length
        wx.hideLoading()
      })
      .catch(res => {
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loadmore: function() {
    let that = this;
    if (loading || noMore) {
      return false
    }
    loading = true
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.req("panicbuying/nextactivity", {
        start: start
      })
      .then(res => {
        start = start + res.data.goodslist.length
        noMore = res.data.goodslist.length > 0 ? false : true
        loading = false
        that.setData({
          goodslist: that.data.goodslist.contant(res.data.goodslist),
        })
        wx.hideLoading()
      })
      .catch(res=>{
        wx.hideLoading()
        loading = false
      })
  }
})