const app = getApp()
Component({
  properties: {
    reviewsItem: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          isToolong: false,
          isOPen: false,
          isToolong2: false,
          isOPen2: false
        })
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        const { content } = newVal.main
        const length = content.replace(/[^\x00-\xff]/g, "aa").length;
        if (length > 132) {
          this.setData({
            isToolong: true,
            isOPen: true
          })
        }
        const rcontent = newVal.review.content
        if (rcontent) {
          const length2 = rcontent.replace(/[^\x00-\xff]/g, "aa").length;
          if (length2 > 132) {
            this.setData({
              isToolong2: true,
              isOPen2: true
            })
          }
        }
      }
    },
    getRate: {
      type: Object,
      value: {}
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    isOPen: false,//主评上的展开收起判断
    isToolong: false,//主评上的展开收起判断
    likeImg: '/static/images/-s-givethethumbsup1_btn@3x.png',
    unlikeImg: '/static/images/-s-givethethumbsup_btn@3x.png',
    isClick: true,
    isOPen2: false,// 追评上的展开收起判断
    isToolong2: false,// 追评上的展开收起判断
    showRate: 1,
  },
  ready() {

  },
  attached () {
    // 当组件被挂载到页面上的时候，读取父组件传来的一整个规格数据对象
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onshow() {
    },
    

    /**
     * 评论展开收起
     */
    openContent() {
      this.setData({
        isOPen: !this.data.isOPen
      })
    },
    
    /**
     * 点赞
     */
    likeFunc() {
      let isClick = this.data.isClick
      if (!isClick) {
        return
      }
      this.setData({
        isClick: false
      })
      // 点赞
      app.req('goods/commentlike', {
        id: this.data.reviewsItem.id
      })
        .then(res => {
          if (res.flag == "0") {
            switch (res.data.action) {
              case 1: {
                wx.showToast({
                  title: '点赞成功',
                })
                let reviewsItem = { ...this.data.reviewsItem }
                reviewsItem.like++
                reviewsItem.islike = res.data.action
                this.setData({ reviewsItem, isClick: true })
                break
              }
              case 2: {
                wx.showToast({
                  title: '取消点赞',
                })
                let reviewsItem = { ...this.data.reviewsItem }
                let { like, islike } = reviewsItem
                reviewsItem.like--
                reviewsItem.islike = res.data.action
                this.setData({ reviewsItem, isClick: true })
                break;
              }
              default: {
              }
            }
          }
        })
    },
    /**
     * 分享
     */
    shareFunc() {
      // 分享
      app.req('goods/sharecomment', {
        id: this.data.reviewsItem.id
      })
        .then(res => {
          if (res.flag == "0") {

          }
        })
    },
    /**
     * 在追评上的展开收起
     */
    openRviewsContent() {
      this.setData({
        isOPen2: !this.data.isOPen2
      })
    },
    /**
     * 主评上的预览图片
     */
    previewImg: function (e) {
      var index = e.currentTarget.dataset.index;
      var imgArr = this.data.reviewsItem.main.img
      wx.previewImage({
        current: imgArr[index], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    /**
     * 追评上的图片预览
     */
    previewImg2(e) {
      var index = e.currentTarget.dataset.index;
      var imgArr = this.data.reviewsItem.review.img
      wx.previewImage({
        current: imgArr[index], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
  }
})