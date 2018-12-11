// pages/share/poster/index.js
const app = getApp()
let rpx = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.req('panicbuying/poster', {
        id: options.id
      })
      .then(res => {
        that.setData({
          poster: res.data
        })
        wx.getSystemInfo({
          success: function(res) {
            rpx = res.windowWidth / 750;
            that.drawCanvas()
          },
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  drawCanvas: function() {
    let that = this
    const ctx = wx.createCanvasContext("shareCanvas")
    wx.getImageInfo({
      src: that.data.poster.img,
      success(res) {
        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, 650 * rpx, 940 * rpx)
        ctx.drawImage('/static/images/poster_bg.png', 0, 0, 650 * rpx, 940 * rpx)
        ctx.fillStyle = 'rgba(191, 191, 191, .5)'
        ctx.fillRect((650 - 565) / 2 * rpx, 34 * rpx, 565 * rpx, 565 * rpx)
        ctx.drawImage(res.path, (650 - 555) / 2 * rpx, 39 * rpx, 555 * rpx, 555 * rpx)
        ctx.setTextAlign('center')
        ctx.setFillStyle('rgba(46, 47, 77, 1)')
        let f = Math.round(29 * rpx)
        ctx.font = 'bold ' + f + 'px sans-serif'
        ctx.fillText(that.data.poster.name, 650 * rpx / 2, 694 * rpx)
        ctx.setFillStyle('rgba(103, 103, 106, 1)')
        f = Math.round(25 * rpx)
        ctx.font = '400 ' + f + 'px sans-serif'
        ctx.fillText(that.data.poster.parsum, 650 * rpx / 2, 740 * rpx)
        ctx.setFillStyle('rgba(103, 103, 106, 1)')
        f = Math.round(25 * rpx)
        ctx.font = '400 ' + f + 'px sans-serif'
        ctx.fillText('原价:￥' + that.data.poster.price, 650 * rpx / 2, 780 * rpx)
        ctx.setFillStyle('rgba(70, 78, 151, 1)')
        f = Math.round(43 * rpx)
        ctx.font = 'bold ' + f + 'px sans-serif'
        ctx.fillText('限时特卖:￥' + that.data.poster.activityprice, 650 * rpx / 2, 864 * rpx)
        ctx.draw(true, function() {
          wx.downloadFile({
            url: that.data.poster.qrcode,
            success: function(res) {
              ctx.save()
              ctx.beginPath()
              ctx.arc(650 / 2 * rpx, (458 + (178 / 2)) * rpx, 178 / 2 * rpx, 0, 2 * Math.PI)
              ctx.clip()
              ctx.drawImage(res.tempFilePath, (650 - 178) / 2 * rpx, 458 * rpx, 178 * rpx, 178 * rpx)
              ctx.restore()
              ctx.draw(true, function() {
                wx.canvasToTempFilePath({
                  canvasId: 'shareCanvas',
                  success(res) {
                    that.setData({
                      imgTemp: res.tempFilePath
                    })
                    wx.hideLoading()
                  }
                }, this)
              })
            }
          })

        })
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '网络异常，请重试',
        })
      }
    })

  },
  saveImg: function() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgTemp,
      success(res) {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail(res) {
        if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
          wx.showModal({
            title: '提示',
            content: '检测到您保存到相册权限未开启，是否开启',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    console.log(res)
                  },
                  fail(res) {
                    console.log(res)
                  }
                })
              }
            }
          })

        } else {
          console.log(2)
        }
      }
    })
  }
})