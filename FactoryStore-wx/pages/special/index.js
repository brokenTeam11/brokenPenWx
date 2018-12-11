// pages/special/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selCateId: 0,
    start: 0,
    loading: false,
    noMore: false,
    topDistance:0,
    scrollTop:0,
    topIndex:0
  },
  selectCate: function(e) {
    let that = this
    let cid = e.currentTarget.dataset.id
    if (that.data.loading || that.data.selCateId == cid) {
      return false
    }
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    app.req("special/getgoods", {
        id: that.data.info.id,
        cid: cid,
        start: 0
      })
      .then(res => {
        that.setData({
          goodsList: res.data.list,
          selCateId: cid,
          start: res.data.list.length,
          topIndex:0,
          loading: false,
          noMore: false
        })
        wx.hideLoading()
      })
      .catch(res=>{
        wx.hideLoading()
      })
  },
  layoutScroll: function(e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let id = options.id
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: function (res) {
        let clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
          console.log(rpxR)
        let calc = 21 / rpxR;
        query.select("#nav").boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(res => {
          that.setData({
            topDistance: res[0].top + calc * 2
          })
        })
      },
    })
    
    app.req("special/detail", {
        id: parseInt(id)
      })
      .then(res => {
        res.data.cate.unshift({
          cid: 0,
          name: "全部"
        })
        that.setData({
          info: {
            id: res.data.id,
            name: res.data.name,
            image: res.data.image,
            summary: res.data.summary
          },
          cateList: res.data.cate,
          goodsList: res.data.goods,
          start: res.data.goods.length
        })
        wx.setNavigationBarTitle({
          title: res.data.name,
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
  loadmore: function() {
    let that = this
    if (that.data.loading || that.data.noMore) {
      return false
    }
    that.setData({
      loading: true
    })
    app.req("special/getgoods", {
        id: that.data.info.id,
        cid: that.data.selCateId,
        start: that.data.start
      })
      .then(res => {
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.list),
          start: that.data.start + res.data.list.length,
          loading: false,
          noMore: res.data.list.length > 0 ? false : true
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})