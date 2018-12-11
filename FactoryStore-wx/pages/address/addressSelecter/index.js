// pages/address/addressSelecter/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.setData({
      id
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
  onShow: function(e) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.req('my/addresslist', {})
      .then(res => {
        let addressList = res.data.list
        addressList.map(address => {
          address.hidePhone = address.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") //处理手机号,隐藏中间四位
          return address
        })
        that.setData({
          addressList: addressList
        })
        wx.hideLoading()
      })
      .catch(res => {
        wx.hideLoading()
      })
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
   * 跳转addressDetail,携带参数id表示修改地址操作
   */
  editAddress: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addressDetail/index?id=' + id,
    })
  },
  /**
   * 跳转addressDetail,不带参表示新增地址操作
   */
  addAddress: function() {
    wx.navigateTo({
      url: '../addressDetail/index'
    })
  },
  /**
   * 点击地址进行选择地址
   */
  selectAddress: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let pages = getCurrentPages() //获取页面栈
    let prevPage = pages[pages.length - 2] //上一页页面对象(确认订单页)
    let address = prevPage.data.address
    let selectAddress = that.data.addressList[index]
    address = {
      aid: selectAddress.id,
      name: selectAddress.name,
      phone: selectAddress.phone,
      address: selectAddress.address
    }
    prevPage.setData({ //将勾选地址对上一页数据进行赋值
        address: address,
        phone: selectAddress.hidePhone,
        isSelect: true,
      }),
      wx.navigateBack({ //返回上一页
        delta: 1
      })
  }
})