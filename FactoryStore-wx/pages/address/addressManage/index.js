// pages/address/addressManage/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addList: [],
    loadover: false,
    showModal: false
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
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      loadover: false
    })
    app.req('my/addresslist', {}) //获取地址列表
      .then(res => {
        wx.hideLoading()
        let addressList = res.data.list
        addressList.map(address => {
          address.hidePhone = address.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") //隐藏手机号码中间部分
          return address
        })
        that.setData({
          addList: addressList,
          loadover: true
        })
      })
      .catch(res => {
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getAddress()
  },

  /**
   * 获取地址列表
   */
  getAddress: function() {
    let that = this
    app.req('my/addresslist', {})
      .then(res => {
        let addressList = res.data.list
        addressList.map(address => {
          address.hidePhone = address.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
          return address
        })
        that.setData({
          addList: addressList
        })
        wx.hideLoading() //隐藏loading
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
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
   * 新增地址
   */
  addAddress: function() {
    wx.navigateTo({
      url: '../addressDetail/index',
    })
  },
  /**
   * 点击删除按钮，弹出模态框
   */
  deleteAddress: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    let isdefault = e.currentTarget.dataset.isdefault
    that.setData({
      showModal: true,
      id,
      isdefault
    })

  },
  /**
   * 确认删除
   */
  onConfirm: function() {
    let that = this
    wx.showLoading({
      title: '',
      mask: true
    })
    app.req('my/deladdress', { //删除地址
        id: that.data.id,
        isdefault: that.data.isdefault
      })
      .then(res => {
        if (res.flag == '0') {
          that.setData({
            showModal: false
          })
          this.getAddress()
        }
      })
      .catch(res => {
        wx.hideLoading()
      })
  },
  /**
   * 取消删除
   */
  onCancel: function() {
    let that = this
    that.setData({
      showModal: false
    })
  },
  /**
   * 设置地址为默认地址
   */
  setDefault: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '',
      mask: true
    })
    app.req('my/setdefaddr', { //设置默认地址
        id: id
      })
      .then(res => {
        this.getAddress()
      })
      .catch(res => {
        wx.hideLoading()
      })
  },
/**
 * 跳转addressDetail,携带参数id表示为修改地址操作
 */
  editAddress: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../addressDetail/index?id=' + id,
    })
  }
})