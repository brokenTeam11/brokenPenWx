// pages/evaluation/post/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current1:5,
    current2:5,
    current3:5,
    isclick:true
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
    // 进入评论
    app.req('my/entercomment', {
      id
    })
      .then(res => {
        if (res.flag == "0") {
          for (let key in res.data.labellist) {
            res.data.labellist[key].checked=false
          }
          this.setData({
            labellist: res.data.labellist,
            ordersn: res.data.ordersn,
            goodlist: res.data.goodlist
          })
          wx.hideLoading()
        }
      })
    this.queryMultipleNodes()
  },
  /***
   * 星星点亮函数
   */
  getScore1: function (e) {
    this.setData({
      current1: e.detail.current
    })
  },
  getScore2: function (e) {
    this.setData({
      current2: e.detail.current
    })
  },
  getScore3: function (e) {
    this.setData({
      current3: e.detail.current
    })
  },
  /**
   * 提价评价
   */
  submit:function () {
    if(!this.data.isclick){
      true
    } 
    this.setData({
      isclick:false
    })
    // 提交评价
    app.req('my/addcomment', {
      id:this.data.id,
      ordersn: this.data.ordersn,
      service:this.data.current1,
      goodsdesc:this.data.current2,
      speed:this.data.current3,
      good:this.data.goods
    })
      .then(res => {
        if (res.flag == "0") {
          wx.showToast({
            title: '提交成功',
          })
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            isBack:true
          })

          wx.navigateBack({
            delta: 1
          })
          this.setData({
            isclick: true
          })
        }
      })
  },
  /**
   * 获取评价组件的内容
   */
  getEvaluation:function (e) {
    console.log(e)
    Array.prototype.pushNew = function (newObj, key) {
      const isExist = this.some((item, index) => {
        return item[key] === newObj[key]
      })
      if (isExist) {
        for (let i = 0, length = this.length; i < length; i++) {
          if (this[i][key] == newObj[key]) {
            this[i] = newObj
            break;
          }
        }
      } else {
        this.push(newObj)
      }
      return this
    }
    let goods = this.data.goods || []
    let { detail } = e
    goods.pushNew(detail,'listid')
    this.setData({
      goods
    })
  },
  /**
     * 计算节点距离顶部的距离
     */
    
  queryMultipleNodes: function () {
    var query = wx.createSelectorQuery()
    var that = this
    query.select('#evaluation162').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res)
    })
  }
})