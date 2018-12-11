// components/swiper.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indicatorDots: { //是否显示面板指示点
      type: Boolean,
      value: false,
    },
    autoplay: { //是否自动切换
      type: Boolean,
      value: true
    },
    interval: { //自动切换时间间隔
      type: Number,
      value: 5
    },
    circular: { //是否采用衔接滑动
      type: Boolean,
      value: true
    },
    duration: { //滑动动画时长  
      type: Number,
      value: 1
    },
    height: { //轮播模块高度
      type: String,
      value: "500rpx"
    },
    banner: { //图片数据
      type: Array,
      value: [{
        id: 1,
        image: "http://img.zbird.cn/ww3/aurora2/new/an/4.jpg",
        url: "www.baidu.com",

      }, {
        id: 2,
        image: "http://img.zbird.cn/ww3/aurora2/new/an/4.jpg",
        url: "www.baidu.com",
        type: 1
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 轮播点击跳转事件
     * @param {Object} e 操作对象
     * e.currentTarget.dataset.type 为跳转链接类型：1为小程序路径、2为外部链接
     * e.currentTarget.dataset.url 为链接地址
     */
    navigateTo: function(e) {
      if (e.currentTarget.dataset.type === 1) {
        wx.navigateTo({
          url: '/pages/webview/index?url=' + e.currentTarget.dataset.url,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      } else if (e.currentTarget.dataset.type === 2) {
        wx.navigateTo({
          url: '',
        })
      } else if (e.currentTarget.dataset.type === 3 || e.currentTarget.dataset.type === 4) {
        wx.navigateTo({
          url: '/pages/goods/detail?id=' + e.currentTarget.dataset.url,
        })
      }
    }
  }
})