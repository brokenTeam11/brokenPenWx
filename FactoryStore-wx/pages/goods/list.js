// pages/goods/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, //筛选框显示状态
    list: [{
        name: '人气',
        id: '1',
        dir: "desc"
      }, //排序条件 
      {
        name: '新品',
        id: '2',
        dir: ""
      }, {
        name: '价格',
        id: '3',
        dir: ""
      }
    ],
    category: {}, //分类数据
    start: 0, //起始下标
    limit: 10, //每次请求条数
    order: "1", //排序条件
    dir: "desc", //asc升序desc降序
    price: ["", ""], //价格区间
    value: {}, //筛选条件
    loading: false, //loadmore组件是否显示
    noMore: false, //是否还有更多数据
    loadover: false, //是否加载完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let category = JSON.parse(options.detail); //获取分类数据对象
    that.setData({
      category: category
    })
    wx.setNavigationBarTitle({ //设置页面标题为分类名称
      title: category.name,
    })
    app.req('goods/filter', { //获取分类筛选条件
        id: category.id
      })
      .then(res => {
        if (res.flag == "0") {
          const prices = res.data.list.price
          prices.forEach((item,index)=>{
            item.checked=false
          })
          that.setData({
            filtersData: res.data.list
          })
        }
      })
    app.req('goods/goodslist', { //获取分类商品列表
        id: category.id,
        start: that.data.start,
        limit: that.data.limit,
        order: parseInt(that.data.order),
        dir: that.data.dir,
        price: that.data.price,
        values: that.data.value
      })
      .then(res => {
        if (res.flag == "0") {
          that.setData({
            start:res.data.list.length,
            goodslist: res.data.list,
            loadover: true
          })
        }
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
    let that = this;
    if (!this.data.loadover || this.data.noMore) {  //防止多次请求
      return;
    }
    this.setData({ //显示加载底栏
      loading: true,
      loadover: false,
    })
    app.req('goods/goodslist', { //获取分类列表
        id: that.data.category.id,
        start: that.data.start,
        limit: that.data.limit,
        order: parseInt(that.data.order),
        dir: that.data.dir,
        price: that.data.price,
        values: that.data.value
      })
      .then(res => {
        if (res.flag == "0") {
          that.setData({
            loading: res.data.list.length === 0 ? true : false,
            goodslist: that.data.goodslist.concat(res.data.list),
            start: that.data.start + res.data.list.length,
            noMore: res.data.list.length === 0 ? true : false,
            loadover: true
          })
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  filter: function(e) {  //点击排序按钮
    this.setData({
      order: e.detail.order.order,
      dir: e.detail.order.dir,
      start: 0,
      limit: 10,
      loadover: false,
    })
    this.getGoodsList();
  },

  clickScreen: function() {  //点击筛选，弹出筛选框
    this.setData({
      isShow: true
    })
  },
  closeFunc: function(e) { //关闭筛选框
    this.setData({
      isShow: false
    })
  },

  /**
   * 点击筛选按钮返回筛选条件数据
   */
  filterFunc: function(e) {
    let vm = this;
    let condition = e.detail
    vm.setData({
      start: 0,
      limit: 10,
      loadover: false,
    })
    for (let i in condition) { 
      //判断条件类型，分别赋值
      if (i == 'price') { 
        vm.setData({
          price: condition[i]
        })
      } else {
        vm.setData({
          value: condition[i]
        })

      }
    }
    this.getGoodsList();
  },
  /**
   * 获取商品列表
   * 说明：与上面的获取不同的是该方法获取列表后直接覆盖原数据，上面则是拼接
   */
  getGoodsList: function() {
    let that = this;
    app.req('goods/goodslist', {
        id: that.data.category.id,
        start: that.data.start,
        limit: that.data.limit,
        order: parseInt(that.data.order),
        dir: that.data.dir,
        price: that.data.price,
        values: that.data.value
      })
      .then(res => {
        console.log(res)
        if (res.flag == "0") {
          that.setData({
            loading: false,
            goodslist: res.data.list,
            start: that.data.start + res.data.list.length,
            noMore: false,
            loadover: true
          })
        }
      })
  }
})