// pages/mine/my-order/my-order.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{ title: "全部", count: 3 }, { title: "待付款", count: 1,haveCount:true }, { title: "待发货", count: 2 },{ title: "待收货", count: 0 }],
    current:1,
    orderList: [{ status: 1 }, { status: 2 }, { status: 3 }, { status: 4 }, { status: 5 }, { status: 6 }],
    noneData:{
      src:'/static/images/img_shopping.png',
      info:'您还没有订单噢~'
    },
    isLoad:false,
    showModal1: false,
    showModal2: false,
    cancelText1: '再想想',
    confirmText1: '确定',
    title1: '确定要取消订单吗？',
    showModal4: false,
    cancelText4: '取消',
    confirmText4: '确定',
    title4: '确定要删除吗？',
    isNone:false,
    haveOrder: false,
    start: 0, //起始下标
    limit: 10, //每次请求条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Object.keys(options).length)
    if (!Object.keys(options).length) {
      this.setData({
        current:1
      })
      return
    }
    const id = options.id
    this.setData({
      current:id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({
      haveOrder: true,
    })
    this.getOrderList()
  },
  /**
   * 获取订单列表
   */
  getOrderList:function () {
    const current = this.data.current
    // 获取全部订单列表
    app.req('my/orderlist', {
      start: 0,
      limit: this.data.limit,
      type: current
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            orderList: res.data.list,
            count:parseInt(res.data.unpay.replace(/(^\s*)|(\s*$)/g, "")),
            start: this.data.start + res.data.list.length,
            haveOrder:true
          })
          if (current==1) {
            this.setData({
              haveOrder: res.data.list.length
            })
          }
          wx.stopPullDownRefresh()
        }
      })
  },
  onPullDownRefresh:function(){
    this.getOrderList();
  },
  tabChange:function (e) {
    if (e.target.dataset.current == undefined) {
      return 
    }
    const current = e.target.dataset.current
    this.setData({
      current: e.target.dataset.current,
      isLoad:true,
      noMore: false,
      loading:false,
      start:0
    })
    app.req('my/orderlist', {
      start: 0,
      limit: this.data.limit,
      type: this.data.current
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            orderList: res.data.list,
            count: parseInt(res.data.unpay.replace(/(^\s*)|(\s*$)/g, "")),
            isLoad: false
          })
        }
      })
  },
  onReachBottom:function () {
    if (this.data.loading) {  //防止多次请求
      return;
    }
    this.setData({
      loading: true
    })
    app.req('my/orderlist', {
      start: this.data.start,
      limit: this.data.limit,
      type:this.data.current
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            orderList: this.data.orderList.concat(res.data.list),
            count: parseInt(res.data.unpay.replace(/(^\s*)|(\s*$)/g, "")),
            start:this.data.start+res.data.list.length,
            noMore: !res.data.list.length ? true : false,
            loading: !res.data.list.length ? true : false,
          })
        }
      })

  },
  goOrderDetail:function (e) {
    console.log(e)
    wx.navigateTo({
      url: './../order-detail/order-detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 弹窗,取消订单，删除订单
   */
  cancelOrder: function (e) {
    const cancelId = e.currentTarget.dataset.id
    this.setData({
      showModal1: true,
      cancelId
    })
  },
  deleteOrder:function (e) {
    const deleteId = e.currentTarget.dataset.id
    this.setData({
      showModal4: true,
      deleteId
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
    this.setData({
      start:0
    })
    wx.showLoading({
      title: '取消订单中',
    })
    // 取消订单
    app.req('my/cancelorder', {
      id: this.data.cancelId
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            loading: false
          })
          this.getOrderList()
          this.hideModal1()
          wx.pageScrollTo({
            scrollTop: 0,
          })
          wx.showLoading({
            title: '取消成功',
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
    this.setData({
      start: 0
    })
    wx.showLoading({
      title: '删除订单中',
    })
    // 删除订单
    app.req('my/deleteorder', {
      id:this.data.deleteId
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            loading:false
          })
          this.getOrderList()
          this.hideModal4();
          wx.pageScrollTo({
            scrollTop: 0,
          })
          wx.showToast({
            title: '删除成功'
          })
        }
      })
  },
  /**
   * 查看物流
   */
  lookLogistics:function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './../logistics/index?id='+id,
    })
  },
  /**
   * 确认收货
   */
  confirmOrder: function (e) {
    const id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '确认收货中',
    })
    // 确认收货
    app.req('goods/receipt', {
      id
    })
      .then(res => {
        if (res.flag == "0") {
          wx.navigateTo({
            url: '/pages/mine/order-detail/order-detail?id='+id,
          })
          wx.hideLoading()
        }
      })
  },
  /**
   * 立即支付
   */
  payRight:function (e) {
    const id = e.currentTarget.dataset.id
    // 获取全部订单列表
    app.req('goods/payment', {
      id
    })
      .then(res => {
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
                  url: '/pages/mine/order-detail/order-detail?id=' + id
                })
              }
            })
        }
      })
  },
  /**
   * 再次购买
   */
  buyOnce:function (e) {
    const id = e.currentTarget.dataset.id
    // 获取全部订单列表
    wx.navigateTo({
      url: '/pages/goods/confirm-order?id='+id
    })
  },
  /**
   * 前往评价页面
   */
  toEvaluation:function (e) {
    wx.navigateTo({
      url: '/pages/evaluation/post/index?id='+e.currentTarget.dataset.id
    })
  },
  /**
   * 前往追评页面
   */
  writeChaseReview(e) {
    wx.navigateTo({
      url: '/pages/evaluation/post/reviews/index'
    })
  }
})