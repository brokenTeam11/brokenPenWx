// pages/mine/helpcenter/index.js
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
  onLoad: function(options) {
    app.req('support/list')
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            list: res.data.list,
            phone: res.data.phoneserver
          })
        }
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
  toDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: './detail/index?id=' + e.currentTarget.dataset.id + '&&name=' + e.currentTarget.dataset.name
    })
  },
  /***
   * 打电话
   */
  callFunction() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  }
})