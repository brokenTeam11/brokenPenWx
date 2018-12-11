// pages/mine/order-detail/order-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderON:'20188888',
    showModal1:false,
    showModal2:false,
    cancelText1:'再想想',
    confirmText1:'确定',
    title1:'确定要取消订单吗？',
    showModal4:false,
    cancelText4: '取消',
    confirmText4: '确定',
    title4: '确定要删除吗？'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const id = options.id
    this.setData({
      id
    })
    // 获取订单详情
    app.req('my/orderdetail', {
      id
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          const phone = res.data.address.phone
          let newPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
          this.setData({
            order:res.data,
            phone: newPhone
          })
          checkTime.call(this)
          setInterval(checkTime.bind(this), 1000);
          function checkTime() {
            let endTime = res.data.outtime
            let nowTime = new Date()
            let nowSeconds = nowTime.getTime()
            let d1 = new Date(endTime.replace(/-/g, "/"));
            let fSeconds = d1.getTime()
            let second = Math.floor((fSeconds - nowSeconds) / 1000);//未来时间距离现在的秒数
            let day = Math.floor(second / 86400);//整数部分代表的是天；一天有24*60*60=86400秒 ；
            second = second % 86400;//余数代表剩下的秒数；
            let hour = Math.floor(second / 3600);//整数部分代表小时；
            second %= 3600; //余数代表 剩下的秒数；
            let minute = Math.floor(second / 60);
            second %= 60;
            let str = day+"天"+hour+"小时"+minute+"分钟"+second+"秒"
            this.setData({
              time:str
            })
          }
          wx.hideLoading()
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    showModal:false
  },
  /**
   * 弹窗
   */
  cancelOrder: function () {
    this.setData({
      showModal1: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal1: function () {
    this.setData({
      showModal1: false
    });
  },
  hideModal4: function () {
    this.setData({
      showModal4: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel1: function () {
    this.hideModal1();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm1: function () {
    // 取消订单
    app.req('my/cancelorder', {
      id:this.data.id
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          // 获取订单详情
          app.req('my/orderdetail', {
            id:this.data.id
          })
            .then(res => {
              console.log(res)
              if (res.flag == "0") {
                const phone = res.data.address.phone
                let newPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
                this.setData({
                  order: res.data,
                  phone: newPhone
                })
                this.hideModal1()
              }
            })
        }
      })
  },
  copyON:function (e) {
    let that = this;
    wx.setClipboardData({
      data: that.data.orderON,
      success: function (res) {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel4: function () {
    this.hideModal4();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm4: function () {
    // 获取全部订单列表
    app.req('my/deleteorder', {
      id: this.data.id
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          wx.redirectTo({
            url: '/pages/mine/my-order/my-order',
          })
          this.hideModal4();
        }
    })
  },
  /**
   * 删除订单
   */
  deleteOrder:function () {
    this.setData({
      showModal4: true
    })
  },
  /**
   * 前往商品详情页
   */
  toGoodDetail:function (e) {
    wx.navigateTo({
      url: '/pages/goods/detail?id='+e.currentTarget.dataset.id
    })
  },
  /**
   * 立即支付
   */
  payRight:function () {
    let that = this
    // 获取全部订单列表
    app.req('goods/payment', {
      id: this.data.id
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          wx.requestPayment(
            {
              'timeStamp': res.data.timestamp.toString(),
              'nonceStr': res.data.noncestr,
              'package': res.data.package,
              'signType': res.data.signtype,
              'paySign': res.data.paysign,
              'success': function (res) { },
              'fail': function (res) { },
              'complete': function (res) { 
                wx.redirectTo({
                  url: '/pages/mine/order-detail/order-detail?id=' + that.data.id
                })
              }
            })
        }
      })
  },
  /**
   * 确认收货
   */
  confirmOrder:function () {
    let that = this
    // 确认收货
    app.req('goods/receipt', {
      id: this.data.id
    })
      .then(res => {
        if (res.flag == "0") {
          wx.showLoading({
            title: '加载中',
          })
          // 获取订单详情
          app.req('my/orderdetail', {
            id: that.data.id
          })
            .then(res => {
              console.log(res)
              if (res.flag == "0") {
                const phone = res.data.address.phone
                let newPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
                this.setData({
                  order: res.data,
                  phone: newPhone
                })
                wx.hideLoading()
                wx.showToast({
                  title: '您已收获宝贝，分享给想买的朋友吧',
                  icon:'none'
                })
              }
            })
        }
      })
  },
  /**
   * 查看物流
   */
  lookLogistics: function (e) {
    const id = this.data.id
    wx.navigateTo({
      url: './../logistics/index?id=' + id,
    })
  },
  /**
   * 再次购买
   */
  buyOnce:function () {
    const id = this.data.id
    wx.navigateTo({
      url: '/pages/goods/confirm-order?id=' + id,
    })
  },
  /**
   * 前往评价页面
   */
  toEvaluation: function (e) {
    const id = this.data.id
    wx.navigateTo({
      url: '/pages/evaluation/post/index?id=' + id
    })
  },
  /**
   * 前往追评页面
   */
  writeChaseReview() {
    const id = this.data.id
  }
})