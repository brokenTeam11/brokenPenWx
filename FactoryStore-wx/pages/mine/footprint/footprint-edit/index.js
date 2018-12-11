// pages/mine/footprint/footprint-edit/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    cancelText:'再想想',
    confirmText:'确定',
    title:'确定要删除吗？',
    start: 0,
    limit: 10,
    noneData: {
      src: '/static/images/img_footprint@3x.png',
      info: '您还没有足迹哦~'
    },
    loading: false,
    noMore: false,
    move:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showLoading({
      title: '加载中',
    })
    // 获取收藏列表
    app.req('my/footprint', {
      start: 0,
      limit: this.data.limit
    })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            count: res.data.count,
            list: res.data.list,
            start: res.data.list.length
          })
          wx.hideLoading()
        }
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindOnCheckbox: function (e) {
    let checkboxitems = this.data.list
    let values = e.detail.value
    for (let i = 0; i < checkboxitems.length; i++) {
      checkboxitems[i].checked = false;
      for (let j = 0; j < values.length; ++j) {
        if (checkboxitems[i].id == values[j]) {
          checkboxitems[i].checked = true;
          break;
        }
      }
    }
    let checkAll = false
    if (checkboxitems.length == values.length) {
      checkAll = true;
    }
    this.setData({
      list: checkboxitems,
      checkAll: checkAll
    });
  },
  bindOnAllChckeck: function (e) {
    let checkboxitems = this.data.list
    if (e.detail.value.length === 0) {
      for (let i = 0; i < checkboxitems.length; i++) {
        checkboxitems[i].checked = false;
      }
    } else {
      for (let i = 0; i < checkboxitems.length; i++) {
        checkboxitems[i].checked = true;
      }
    }
    this.setData({
      list: checkboxitems
    });
  },
  /**
   * 触底事件
   */
  bindscrolltolower: function () {
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })
    // 获取商品详情
    app.req('my/footprint', {
      start: this.data.start,
      limit: this.data.limit
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          this.setData({
            count: res.data.count,
            list: this.data.list.concat(res.data.list),
            start: this.data.start + res.data.list.length,
            noMore: !res.data.list.length ? true : false,
            loading: !res.data.list.length ? true : false
          })
        }
      })
  },
  /**
   * 弹窗
   */
  cancelCollection: function () {
    this.setData({
      showModal: true
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
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    const list = this.data.list
    const idlist = list.reduce((list, item2) => {
      return item2.checked === true ? list.concat(item2["id"]) : list
    }, [])
    // 取消收藏
    app.req('my/cancelfoot', {
      idlist
    })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          // 获取收藏列表
          app.req('my/footprint', {
            start: 0,
            limit: this.data.limit
          })
            .then(res => {
              console.log(res)
              if (res.flag == "0") {
                this.setData({
                  count: res.data.count,
                  list: res.data.list,
                  start: res.data.list.length
                })
                wx.showToast({
                  title: '删除成功'
                })
                this.hideModal();
              }
            })
        }
      })
  },
  goback: function () {
    wx.redirectTo({
      url: './../footprint',
    })
  },
  /**
   * 前往商品详情页
   */
  toGoodDetail: function (e) {
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 编辑与完成切换
   */
  changeOnEdit: function () {
    this.setData({
      move: !this.data.move
    })
  }

})