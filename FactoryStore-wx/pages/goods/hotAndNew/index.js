// pages/goods/hot&new/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "1",
    start: 0,
    goodsList: [],
    loading: false,
    noMore: false,
    image: {
      "1": "https://kpzuan.com/api/image/reshou.png",
      "2": 'https://kpzuan.com/api/image/meirisanxin.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let title = "靠谱好钻"
    switch (options.type) {
      case "1":
        title = "热销排行"
        break
      case "2":
        title = "每日上新"
        break
    }
    wx.setNavigationBarTitle({ //设置页面标题为分类名称
      title: title
    })
    app.req('goods/list', {
        type: options.type,
      })
      .then(res => {
        that.setData({
          type: options.type,
          goodsList: res.data.list,
          start: res.data.list.length
        })
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
    let that = this
    if (that.data.loading || that.data.noMore) {
      return false
    }
    that.setData({
      loading: true
    })
    app.req('goods/list', {
        type: that.data.type,
        start: that.data.start
      })
      .then(res => {
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.list),
          start: that.data.start + res.data.list.length,
          noMore: res.data.list.length > 0 ? false : true,
          loading: false
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})