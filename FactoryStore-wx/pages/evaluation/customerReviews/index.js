// pages/evaluation/customerReviews/index.js
const app = getApp()
let component = null;
let id = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // top标签显示（默认不显示）
    backTopValue: true,
    topNum: 0,
    close: true,
    isOpen: false,
    haveArrow: false,
    limit: 50,
    noMore: false,
    loading: false,
    current1: true,
    label: 0,
    type: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // id = options.id
    const {
      id
    } = options
    this.setData({
      id
    })
    //获取组件对象
    component = this.selectComponent('#scroll');
    this.getReviewsList();
  },

  /**
   * 获取顾客评价列表
   */
  getReviewsList() {
    // 获取顾客评价列表
    app.req('goods/commentlist', {
        id: this.data.id,
        start: 0,
        type: this.data.type,
        label: this.data.label,
        limit: this.data.limit
      })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            commentlist: res.data,
            comments: res.data.comment,
            start: res.data.comment.length
          })
          let count = 0
          count = haveCount(res.data.all, count)
          count = haveCount(res.data.good, count)
          count = haveCount(res.data.review, count)
          count = haveCount(res.data.img, count)
          const newArr = res.data.label.filter(getItem('num'))

          function getItem(num) {
            return item => item.num != 0
          }
          count = count + newArr.length
          if (count > 6) {
            this.setData({
              haveArrow: true
            })
          } else {
            this.setData({
              haveArrow: false,
            })
          }
        }
      })

    function haveCount(el, count) {
      const element = parseInt(el)
      if (element !== 0) {
        count++
      }
      return count
    }
  },
  onclick: function () {
    this.setData({
      close: !this.data.close,
      isOpen: !this.data.isOpen,
    })
  },
  
  /**
   * type上点击
   */
  clickOnType(e) {
    const {
      type
    } = e.currentTarget.dataset
    for (let i = 1; i <= 4; i++) {
      this.setData({
        ['current' + i]: false,
      })
    }
    this.setData({
      ['current' + type]: true,
      current: -1,
      type,
      label: 0,
      start: 0,
      loading: false
    })
    // 获取顾客评价列表
    this.getReviewsList()
  },
  /**
   * 在标签上点击
   */
  clickOnLabel(e) {
    const {
      current,
      label
    } = e.currentTarget.dataset;
    for (let i = 1; i <= 6; i++) {
      this.setData({
        ['current' + i]: false
      })
    }
    console.log(current)
    this.setData({
      current,
      label,
      type: 0,
      start: 0,
      loading: false
    })
    // 获取顾客评价列表
    this.getReviewsList()
  },
  
  /**
   * 下拉刷新
   */

  onPullDown: function (e) {
    //数据请求完成后需要调用该方法结束loading
    component.stop();
    app.req('goods/commentlist', {
        id: this.data.id,
        type: this.data.type,
        label: this.data.label,
        start: 0,
        limit: this.data.limit,
      })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            comments: res.data.comment,
            start: res.data.comment.length,
            // noMore: !res.data.comment.length ? true : false,
            // loading: !res.data.comment.length ? true : false,
          })
         
        }
        
      })
    
  },
  

  /**
   * 获取更多
   */
  bindscrolltolower: function (e) {
    if (this.data.loading) { //防止多次请求
      return;
    }
    this.setData({
      loading: true
    })
    //显示loading
    // component.startLoad();
    app.req('goods/commentlist', {
        id: this.data.id,
        type: this.data.type,
        label: this.data.label,
        start: this.data.start,
        limit: this.data.limit,
      })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            comments: this.data.comments.concat(res.data.comment),
            start: this.data.start + res.data.comment.length,
            noMore: !res.data.comment.length ? true : false,
            loading: !res.data.comment.length ? true : false,
          })
        }
        //数据请求完成后需要调用该方法结束loading
        component.noData();
      })
  }
})
