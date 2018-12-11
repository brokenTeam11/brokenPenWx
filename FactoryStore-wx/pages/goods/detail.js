// pages/goods/detail.js
let WxParse = require('./../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    isNotCar: false,
    isNotCar2: false,
    autoplay: true,
    interval: 6000,
    duration: 1000,
    comments: [1, 2, 3, 3, 4],
    top: 0,
    commentTop: 0,
    parameterTop: 0,
    imgTop: 0,
    scrollTop: 0,
    collection: false,
    isShow: false,
    btnValue: '',
    noloveImg: '/static/images/btn_collection@3x.png',
    isloveImg: '/static/images/btn_collection.png',
    isClick: true,
    model: true
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 获取商品的id
    let id = options.id
    let that = this
    // 获取商品详情
    app.req('goods/detail', {
        id
      })
      .then(res => {
        if (res.flag == "0") {
          that.setData({
            id: id,
            detailArr: res.data,
            islove: res.data.islove,
            good: {
              image: res.data.logo,
              name: res.data.name,
              price: res.data.price,
              norms: res.data.parsum,
              id
            }
          })
          const content = res.data.content
          const summary = res.data.shop.summary
          // 调用富文本插件
          WxParse.wxParse('article', 'html', content, that, 0);
          WxParse.wxParse('summary', 'html', summary, that, 0);
          wx.getSystemInfo({
            success: function(res) {
              that.setData({
                scrollHeight: res.windowHeight
              });
            }
          });
          that.queryMultipleNodes('#evaluation', 'commentTop')
          that.queryMultipleNodes('#diamond-parameter', 'parameterTop')
          that.queryMultipleNodes('#detial-img', 'imgTop')
          // 获取购物车数量
          that.getCarList()
          // 获取顶部航条高度
          that.getHeight()
          wx.hideLoading()
        }
      })
      .catch(res => {
        console.log('catch')
      })

  },
  onHide: function() {
    //页面隐藏的时候移除storage里面中的 规格选择中的用户上次选中的 信息
    wx.removeStorage({
      key: 'goodSku',
      success: function(res) {},
    })
  },
  onUnload: function() {
    //页面隐藏的时候移除storage里面中的 规格选择中的用户上次选中的 信息
    wx.removeStorage({
      key: 'goodSku',
      success: function(res) {},
    })
  },
  /**
   * 图片预览
   */
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.detailArr.image;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr //所有要预览的图片的地址集合 数组形式
    })
  },
  /**
   * scroll-view中页面滚动的时候触发的函数
   */
  scrollTopFun(e) {
    this.setData({
      top: e.detail.scrollTop
    })
  },
  /**
   * 点击顶部导航，跳到页面的某个位置
   */
  goArea: function(e) {
    this.setData({
      toview: e.target.dataset.current
    })
  },
  /**
   * 收藏和取消收藏
   */
  collectionFunc: function() {
    let collection = this.data.islove
    if (collection == 1) {
      collection = 2
    } else {
      collection = 1
    }
    // 获取商品详情
    app.req('goods/collection', {
        id: this.data.id,
        status: collection
      })
      .then(res => {
        if (res.flag == "0") {
          wx.showToast({
            title: collection == 1 ? '收藏成功' : '取消收藏',
          })
          this.setData({
            islove: collection
          })
        }
      })
  },
  /**
   * 点击详情页中的加入购物车或者立即后面按钮
   */
  tapOnBuy: function(e) {
    // 防止多次点击
    let isClick = this.data.isClick;
    if (!isClick) {
      return
    }
    this.setData({
      isClick: false
    })
    // 如果点击的范围不是加入购物车或者立即购买的区域，切换函数
    if (e.target.dataset.bcurrent === undefined) {
      this.setData({
        isClick: true
      })
      return
    }
    const current = e.target.dataset.bcurrent // 获取当前点击的是那个按钮
    const normstype = e.currentTarget.dataset.normstype // 获取当前商品时单一规格还是多规格
    const id = this.data.id // 获取商品的id
    this.setData({
      btnValue: current,
      normstype: normstype
    })
    let that = this
    if (current == 3) {
      that.setData({
        model: false,
        isClick: true
      })
      return false
    }
    // 当点击的时候先从storage中获取用户上次规格选择选中的值，如果找到了，那么直接读取storage中的值，否则直接用接口请求的值
    wx.getStorage({
      key: 'goodSku',
      success: function(res) {
        that.setData({
          chooseSkuList: res.data
        })
        // 判断是多规格选择
        if (res.data.goods) {
          that.setData({
            sku: {
              list: res.data.list,
              good: res.data.goods
            },
            handinch: res.data.handinch,
            nid: res.data.goods.id
          })
        }
        // 判断是只有手寸 手寸会单独传一个规格id，和库存和手寸列表
        if (res.data.nid) {
          that.setData({
            nid: res.data.nid,
            count: res.data.total,
            handinch: res.data.handinch
          })
        }
        // 调用选择规格函数
        that.chooseSku()
        // 将点击重新设置为true,表示可点击了
        that.setData({
          isClick: true
        })
      },
      fail: function(res) {
        // 失败表示没有找到，没有找到直接调用接口获取规格列表
        that.chooseSkuFunc()
        // 将点击重新设置为true,表示可点击了
        that.setData({
          isClick: true
        })
      }
    })
  },
  /**
   * 调用选择规格接口
   */
  chooseSkuFunc: function() {
    // 商品详情商品规格选择
    app.req('goods/choosesku', {
        id: this.data.id
      })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            chooseSkuList: res.data
          })
          // 判断是多规格
          if (res.data.goods) {
            this.setData({
              sku: {
                list: res.data.list,
                good: res.data.goods
              },
              handinch: res.data.handinch,
              nid: res.data.goods.id
            })
          }
          // 判断是只有手寸 手寸会单独传一个规格id，和库存和手寸列表
          if (res.data.nid) {
            this.setData({
              nid: res.data.nid,
              count: res.data.total,
              handinch: res.data.handinch
            })
          }
          // 调用选择规格的接口
          this.chooseSku()
        }
      })
  },
  /**
   * 选择规格
   */
  chooseSku: function() {
    const normstype = this.data.normstype
    // 如果为1是单一规格，否则是多规格
    if (normstype == 1) {
      this.simple()
    } else {
      this.complex()
    }
  },
  /**
   * 单一规格
   */
  simple: function() {
    let that = this
    const count = parseInt(this.data.count)
    // 判断有没有库存，如果没有库存的话，提示没有库存
    if (count > 0) {
      if (Object.keys(this.data.handinch).length) {
        //  单一规格下，有手寸列表，显示规格选择弹窗，选择手寸大小
        this.showSku()
      } else { // 单一规格下，没有有手寸列表，立即加入购物车或者立即购买
        // 如果是1表示点击的加入购物车
        if (this.data.btnValue == 1) {
          // 购物车新增接口
          app.req('cart/add', {
              sid: this.data.detailArr.shop.id, // 商家id
              gid: this.data.id, // 商品id
              nid: this.data.nid, // 规格id
            })
            .then(res => {
              if (res.flag == "0") {
                // 显示加入购物车的动画
                this.carAnimation();
              }
            })
        } else { // 否则点击的是立即购买，或者参数，跳到确认订单页面
          const idarr = {
            0: {
              id: this.data.nid,
              sum: 1,
              norms: ""
            }
          }
          console.log(1)
          wx.navigateTo({
            url: './confirm-order?idarr=' + JSON.stringify(idarr)
          })
        }

      }
    } else { // 没有库存显示没有库存
      wx.showToast({
        title: '没有库存了!',
      })
    }
  },
  /**
   * 多规格
   */
  complex: function() {
    // 多规格，显示规格选择弹窗
    this.showSku();
  },
  /**
   * 加入购物车
   */
  addCar: function() {
    // 购物车新增接口
    app.req('cart/add', {
        sid: this.data.detailArr.shop.id,
        gid: this.data.id,
        nid: this.data.nid,
        norms: this.data.norms || "" // 当用户在规格选择弹窗弹出时，直接点击了加入购物车，没有选择规格，则规格默认为空
      })
      .then(res => {
        if (res.flag == "0") {
          // 将规格选择弹窗隐藏
          this.hideSku();
          // 显示加入购物车动画
          this.carAnimation();
        }
      })
  },
  /**
   * 立即购买
   */
  buyAtOnce: function() {
    let that = this;
    const idarr = {
      0: {
        id: this.data.nid,
        sum: 1,
        norms: this.data.norms || "" // 当用户在规格选择弹窗弹出时，直接点击了立即购买，没有选择规格，则规格默认为空
      }
    }
    //  前往确认订单页面
    wx.navigateTo({
      url: './confirm-order?idarr=' + JSON.stringify(idarr) + '&activeId=' + that.data.detailArr.activity.id
    })
  },
  /**
   * 子组件（规格弹窗）触发的加入购物车或者立即购买
   */
  btnFunc: function(e) {

    const {
      current
    } = e.detail
    if (current == 1) {
      // 如果是1，是加入购物车
      this.addCar()
    } else {
      // 否则是立即购买
      this.buyAtOnce()
    }
  },
  /**
   * 显示规格组件
   */
  showSku: function() {
    this.setData({
      isShow: true
    })
  },
  /**
   * 关闭规格组件
   */
  closeSku: function() {
    this.hideSku()
  },
  /**
   * 从子组件哪里重新获取新的规格id
   */
  getNewId: function(e) {
    const nid = e.detail.nid
    this.setData({
      nid
    })
  },
  /**
   * 隐藏规格组件
   */
  hideSku: function() {
    this.setData({
      isShow: false
    })
  },
  /**
   * 前往商家介绍页面
   */
  toShop: function(e) {
    const summary = e.currentTarget.dataset.summary
    wx.navigateTo({
      url: './goodDesc/index?summary=' + summary
    })
  },
  /**
   * 子组件（选择规格）传过来的规格参数
   */
  skuFunc: function(e) {
    this.setData({
      norms: e.detail.norms
    })
  },
  /**
   * 获取购物车数量
   */
  getCarList: function() {
    // 获取购物车数量
    app.req('cart/list', {
        id: this.data.id
      })
      .then(res => {
        this.setData({
          carcount: res.data.count
        })
      })
  },
  /**
   * 将上次选中的规格数据放进localStorage中（由子组件触发的规格选择，传过来的数据）
   */
  getPrevInfo: function(e) {
    wx.setStorage({
      key: 'goodSku',
      data: e.detail.list,
    })
  },
  /**
   * 加入购物车动画
   */
  carAnimation: function() {
    this.setData({
      isNotCar: true
    })
    setTimeout(() => {
      this.setData({
        isNotCar: false
      })
      this.getCarList()
    }, 1500)
  },
  /**
   * 获取节点距离顶部的的高度
   */
  queryMultipleNodes: function(value, top) {
    var query = wx.createSelectorQuery()
    var that = this
    query.select(value).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      const topObj = {}
      if (!res[0]) {
        return
      }
      topObj[top] = res[0].top
      that.setData({
        ...topObj
      })
    })
  },
  /**
   *  获取顶部航条高度
   */
  getHeight: function() {
    var that = this
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#nav').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为myText的元素的信息 的数组
      //取高度
      that.setData({
        navHeight: res[0].height
      })
    })
  },
  /**
   * 回到首页
   */
  goIndex: function() {
    wx.switchTab({
      url: './../index/index'
    })
  },
  /**
   * 到购物车
   */
  toCar: function() {
    wx.switchTab({
      url: './../shoppingCar/index'
    })
  },
  /**
   * 前往顾客评价列表
   */
  toCustomerReviews() {
    wx.navigateTo({
      url: '/pages/evaluation/customerReviews/index?id=' + this.data.id,
    })
  },
  toGradGoods: function(e) {
    let that = this
    wx.redirectTo({
      url: '/pages/gradGoodGoods/grabing/index?id=' + that.data.id,
    })
  },
  goOnBuy: function() {
    let that = this
    // 当点击的时候先从storage中获取用户上次规格选择选中的值，如果找到了，那么直接读取storage中的值，否则直接用接口请求的值
    wx.getStorage({
      key: 'goodSku',
      success: function(res) {
        that.setData({
          chooseSkuList: res.data
        })
        // 判断是多规格选择
        if (res.data.goods) {
          that.setData({
            sku: {
              list: res.data.list,
              good: res.data.goods
            },
            handinch: res.data.handinch,
            nid: res.data.goods.id
          })
        }
        // 判断是只有手寸 手寸会单独传一个规格id，和库存和手寸列表
        if (res.data.nid) {
          that.setData({
            nid: res.data.nid,
            count: res.data.total,
            handinch: res.data.handinch
          })
        }
        // 调用选择规格函数
        that.chooseSku()
        // 将点击重新设置为true,表示可点击了
        that.setData({
          isClick: true,
          model: true
        })
      },
      fail: function(res) {
        // 失败表示没有找到，没有找到直接调用接口获取规格列表
        that.chooseSkuFunc()
        // 将点击重新设置为true,表示可点击了
        that.setData({
          isClick: true,
          model: true
        })
      }
    })
  },
  closeModel: function() {
    this.setData({
      model: true
    })
  },
  stopClose: function() {
    return false
  },
  showToast: function(e) {
    wx.showToast({
      title: e.currentTarget.dataset.text,
      icon: 'none'
    })
  }
})