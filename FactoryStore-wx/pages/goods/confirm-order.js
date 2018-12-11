// pages/goods/confirm-order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: "",
    isSelect: false,
    isClick: true,
    activeId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    console.log(options)
    if (options.cid) {
      let cid = options.cid.split(',')
      this.setData({
        cid
      })
    }
    if (options.idarr) {
      let idarr = JSON.parse(options.idarr)
      console.log(idarr)
      this.setData({
        idarr
      })
    }
    if (options.id) {
      const id = options.id
      this.setData({
        oid: id
      })
    }
    if (options.activeId && options.activeId != "undefined") {
      that.setData({
        activeId: options.activeId
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (this.data.idarr) {
      this.getOrderDetailByIdArr()
    }
    if (this.data.oid) {
      this.getOrderDetail()
    }
  },
  /**
   * 根据订单id获取订单详情
   */
  getOrderDetail: function(id) {
    // 获取订单详情
    app.req('goods/oncemore', {
        id: this.data.oid,
      })
      .then(res => {
        if (res.flag == "0") {
          let newphone = ''
          if (res.data.address.phone) {
            newphone = res.data.address.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
          }
          this.setData({
            data: res.data,
            address: this.data.isSelect ? this.data.address : res.data.address,
            phone: this.data.isSelect ? this.data.phone : newphone,
            idarr: res.data.idarr
          })
        }
      })
  },
  /**
   * 根据idarr获取订单详情
   */
  getOrderDetailByIdArr: function() {
    wx.showLoading({
      title: '加载中',
    })
    // 获取订单详情
    app.req('goods/orderconfirm', {
        idarr: this.data.idarr,
        id: this.data.activeId
      })
      .then(res => {
        wx.hideLoading()
        if (res.flag == "0") {
          let newphone = ''
          if (res.data.address.phone) {
            newphone = res.data.address.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
          }
          this.setData({
            data: res.data,
            address: this.data.isSelect ? this.data.address : res.data.address,
            phone: this.data.isSelect ? this.data.phone : newphone
          })
        }
      })
  },

  /**
   * 前往商品详情页
   */
  toGoodItem: function(e) {
    wx.navigateTo({
      url: '/pages/good/detail?id=' + e.currentTarget.dataset.gid
    })
  },
  /**
   * 输入备注
   */
  handleOnInput: function(e) {
    console.log(e.detail)
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 提交订单
   */
  submitOrder: function() {
    const {
      isClick
    } = this.data
    if (!isClick) {
      return
    }
    this.setData({
      isClick: false
    })
    if (!Object.keys(this.data.address).length) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return
    }
    const that = this
    // 提交订单
    app.req('goods/sendorder', {
        idarr: this.data.idarr,
        remark: this.data.remark,
        aid: this.data.address.aid,
        activityid: this.data.activeId ? this.data.activeId : 0,
        fragment: this.data.data.fragment ? this.data.data.fragment : 0,
        discount: this.data.data.discount,
        ftprice: this.data.data.ftprice,
        cid: this.data.cid || []
      })
      .then(res => {
        const id = res.data.id
        if (res.flag == "0") {
          // 调起微信支付
          wx.requestPayment({
            'timeStamp': res.data.timestamp.toString(),
            'nonceStr': res.data.noncestr,
            'package': res.data.package,
            'signType': res.data.signtype,
            'paySign': res.data.paysign,
            'success': function(res) {
              console.log(res)
            },
            'fail': function(res) {
              console.log('付款失败')
              console.log(res)
            },
            'complete': function(res) {
              wx.redirectTo({
                url: '/pages/mine/order-detail/order-detail?id=' + id
              })
              that.setData({
                isClick: false
              })
            }
          })
        }
      })
  },

  toAddAddress: function() {
    wx.navigateTo({
      url: '/pages/address/addressDetail/index',
    })
  },
  toSelect: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.aid
    wx.navigateTo({
      url: '/pages/address/addressSelecter/index?id=' + id,
    })
  }
})