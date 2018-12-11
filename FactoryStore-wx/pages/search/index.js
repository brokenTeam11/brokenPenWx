// pages/search/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    image: "https://kpzuan.com/api/image/KB@3x.png",
    tag: [],
    name: '推荐',
    selId: '0',
    start: 0,
    topDistance: 0,
    noMore: false,
    loading: false
  },
  clickTag: function(e) {
    let that = this
    if (e.currentTarget.dataset.id == that.data.selId) {
      that.setData({
        topDistance: 0
      })
      return false
    }
    let tag = that.data.tag;
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    app.req('index/search', {
        id: e.currentTarget.dataset.id,
        start: 0
      })
      .then(res => {
        that.setData({
          goods: res.data.list,
          name: res.data.name,
          start: res.data.list.length,
          selId: e.currentTarget.dataset.id,
          topDistance: 0,
          noMore: false,
        })
        wx.hideLoading()
      })
      .catch(res => {
        wx.hideLoading()
      })
  },
  loadmore: function(e) {
    let that = this
    if (that.data.loading || that.data.noMore) {
      return false
    }
    wx.showNavigationBarLoading()
    that.setData({
      loading: true
    })
    app.req('index/search', {
        id: that.data.selId,
        start: that.data.start,

      })
      .then(res => {
        that.setData({
          goods: that.data.goods.concat(res.data.list),
          start: that.data.start + res.data.list.length,
          loading: false,
          noMore: res.data.list.length > 0 ? false : true
        })
        wx.hideNavigationBarLoading()
      })
      .catch(res => {
        wx.hideNavigationBarLoading()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      mask: true,
      title: '加载中...'
    })
    app.req("index/searchdetail", {})
      .then(res => {
        that.setData({
          goods: res.data.goods,
          start: res.data.goods.length,
          image: res.data.image,
          tag: res.data.tag,
          name: res.data.name,
          selId: res.data.tag[0].id
        })
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

  }
})