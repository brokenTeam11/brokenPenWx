// pages/gradGoodGoods/myDebris/index.js
const app = getApp()
let intervalTimer = null
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
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.req('panicbuying/myfragment', {})
      .then(res => {
        that.setData({
          doing: res.data.doing,
          invalid: res.data.invalid
        })
        wx.hideLoading()
        if (res.data.doing.time) {
          that.getServerTime(parseInt(res.data.doing.time) * 1000)
        }
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
    clearInterval(intervalTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(intervalTimer)
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
  getServerTime: function(endTime) {
    let that = this;
    intervalTimer = setInterval(() => {
      let remainTime = that.getRemainTime(endTime)
      let hours = that.leftpad(remainTime.hours, 2, '0')
      let minutes = that.leftpad(remainTime.minutes, 2, '0')
      let seconds = that.leftpad(remainTime.seconds, 2, '0')
      that.setData({
        time: `${hours}:${minutes}:${seconds}`
      })
      if (remainTime.total <= 0) {
        clearInterval(intervalTimer);
        wx.showLoading({
          title: '加载中',
        })
        app.req('panicbuying/myfragment', {})
          .then(res => {
            that.setData({
              doing: res.data.doing,
              invalid: res.data.invalid
            })
            wx.hideLoading()
            if (res.data.doing.time) {
              that.getServerTime(parseInt(res.data.doing.time) * 1000)
            }
          })
          .catch(res => {
            wx.hideLoading()
          })
      }
    }, 1000)
  },
  getRemainTime: (endTime) => {
    let t = endTime - Date.parse(new Date())
    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)))
    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    }
  },
  leftpad: function(str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
      str = ch + str;
    }
    return str;
  }
})