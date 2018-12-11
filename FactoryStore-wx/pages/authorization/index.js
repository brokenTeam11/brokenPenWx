// pages/authorization/index.js
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
  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    const info = e.detail.errMsg
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.getUser()
        .then(function() {
          wx.navigateBack({
            detail: 1
          })
        })
        .catch(res => {
          if (res = '网络异常') {
            wx.showToast({
              title: res,
            })
          } else if (res.data.flag == '1004') {
            app.doLogin()
              .then(function() {
                app.getUser()
                  .then(function() {
                    wx.navigateBack({
                      detail: 1
                    })
                  })
                  .catch(function() {
                    wx.showToast({
                      title: '网络异常',
                    })
                  })
              })
          }
        })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})