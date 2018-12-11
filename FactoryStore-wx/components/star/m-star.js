Component({
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    current:5,
    stars: [1, 2, 3, 4, 5],
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
    },
    moved: function () { },
    detached: function () { },
  },

  attached: function () {
    let { current } = this.data
    this.triggerEvent('getScore', { current })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /***
    * 星星点亮函数
    */
    changeStar: function (e) {
      let { current } = e.currentTarget.dataset
      this.setData({
        current
      })
      this.triggerEvent('getScore', { current })
    },
  }
})