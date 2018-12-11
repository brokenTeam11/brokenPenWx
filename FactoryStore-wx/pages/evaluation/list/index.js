// pages/evaluation/list/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    currentTab: 0,
    start1: 0,
    start2: 0,
    evaluationList: [],
    evaluatedList: [],
    loadover1: false,
    loadover2: false,
    nomore1: false,
    nomore2: false,
    first: true,
    showModal: false,
    isBack: false,
  },

  switchTab: function(e) {
    if (e.detail.source !== 'touch') {
      return false
    }
    this.setData({
      currentTab: e.detail.current,
      nomore1: false,
      nomore2: false
    })
    this.getData(0, e.detail.current, 0)
  },
  toPost: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './../post/index?id=' + id,
    })
  },
  toLogistics: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/logistics/index?id=' + id,
    })
  },
  clickTab: function(e) {
    let currentTab = e.currentTarget.dataset.index
    this.setData({
      currentTab: currentTab,
      nomore1: false,
      nomore2: false
    })
    this.getData(0, currentTab, 0)
  },
  loadmore: function(e) {
    let currentTab = e.currentTarget.dataset.index
    this.getData(currentTab === 0 ? this.data.start1 : this.data.start2, currentTab, 1)
  },
  getData: function(start, type, reqType) {
    let that = this
    return new Promise((resolv, reject) => {
      if (type === 0) {
        if (that.data.nomore1) {
          return false;
        }
        if (!that.data.loadover1) {
          wx.showLoading({
            mask: true
          })
        }
        app.req('my/precommentlist', {
            start: start
          })
          .then(res => {
            if (!that.data.loadover1) {
              wx.hideLoading()
            }
            that.setData({
              isBack: false,
              loadover1: true,
              evaluationList: reqType === 0 ? res.data : that.data.evaluationList.concat(res.data),
              start1: reqType === 0 ? res.data.length : that.data.evaluationList.length,
              nomore1: reqType === 1 && res.data.length === 0 ? true : false
            })
            resolv()
          })
          .catch(res => {
            if (!that.data.loadover1) {
              wx.hideLoading()
            }
            reject()
          })
      } else if (type === 1) {
        if (that.data.nomore2) {
          return false;
        }
        if (!that.data.loadover2) {
          wx.showLoading({
            mask: true
          })
        }
        app.req('my/altcommentlist', {
            start: start
          })
          .then(res => {
            if (!that.data.loadover2) {
              wx.hideLoading()
            }
            that.setData({
              isBack:false,
              first: false,
              loadover2: true,
              evaluatedList: reqType === 0 ? res.data : that.data.evaluatedList.concat(res.data),
              start2: reqType === 0 ? res.data.length : that.data.evaluatedList.length,
              nomore1: reqType === 1 && res.data.length === 0 ? true : false
            })
            resolv()
          })
          .catch(res => {
            if (!that.data.loadover2) {
              wx.hideLoading()

            }
            reject()
          })
      }
    })

  },
  onCancel: function() {
    this.setData({
      showModal: false
    })
  },
  onCancel: function() {
    this.setData({
      showModal: false
    })
  },
  showModal: function(e) {
    this.setData({
      showModal: true,
      deleteorderid: e.currentTarget.dataset.id
    })
  },
  onConfirm: function() {
    let that = this
    that.setData({
      showModal: false
    })
    wx.showLoading({
      mask: true
    })
    app.req('my/deleteorder', {
        id: that.data.deleteorderid
      })
      .then(res => {
        that.setData({
          nomore1: false,
          nomore2: false
        })
        that.getData(0, that.data.currentTab, 0)
          .then(function() {
            wx.hideLoading()
          })
      })
  },
  toReview: function(e) {
    let that = this
    let evaluatedList = that.data.evaluatedList[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../post/reviews/index?comid=' + evaluatedList.comment.id + '&goodsid=' + evaluatedList.goodsid + '&orderid=' + evaluatedList.orderid,
    })
  },
  toOrderDetail: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mine/order-detail/order-detail?id=' + id,
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.list,
      current: e.currentTarget.dataset.src
    })
  },
  toGoodDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      mask: true
    })
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        let calc = clientHeight * rpxR - 90;
        that.setData({
          winHeight: calc
        })
      },
    })
    if (options.action) {
      that.setData({
        currentTab: 1
      })
      app.req('my/altcommentlist', {
          start: 0
        })
        .then(res => {
          wx.hideLoading()
          that.setData({
            first: false,
            loadover2: true,
            evaluatedList: res.data,
            start2: res.data.length
          })
        })
        .catch(res => {
          wx.hideLoading()
        })
    } else {
      app.req('my/precommentlist', {
          start: 0
        })
        .then(res => {
          wx.hideLoading()
          that.setData({
            first: false,
            loadover1: true,
            evaluationList: res.data,
            start1: res.data.length
          })
        })
        .catch(res => {
          wx.hideLoading()
        })
    }
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
    let that = this
    if (that.data.first) {
      return false
    }
    that.setData({
      nomore1: false,
      nomore2: false
    })
    if (that.data.isBack) {
      that.setData({
        currentTab: 1
      })
      that.getData(0, that.data.currentTab, 0)
    } else {
      that.getData(0, that.data.currentTab, 0)
    }
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