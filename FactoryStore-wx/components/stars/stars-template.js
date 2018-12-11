Component({
  properties: {
    /* 显示有色星星的个数 */
    value: {
      type: Number,
      value: 0,
      /* 监听value值的变化 */
      observer: function (newVal, oldVal, changedPath) {
        this.init()
      }
    },
    /* 设置星星大小 */
    size: {
      type: Number,
      value: 30
    }
  },
  attached() {
    /* 组件生命周期函数，在组件实例进入页面节点树时执行 */
    this.init();
  },
  data: {
    stars: [0, 0, 0, 0, 0]
  },
  methods: {
    init() {
      let star = this.properties.value;
      let stars = [0, 0, 0, 0, 0];
      /* 图片名称，通过设置图片名称来动态的改变图片显示 */
      for (let i = 0; i < Math.floor(star); i++) {
        stars[i] = 'star';
      }
      if (star > Math.floor(star)) {
        stars[Math.floor(star)] = 'halfStar';
      }
      for (let i = 0; i < stars.length; i++) {
        if (stars[i] == 0) {
          stars[i] = 'grayStar';
        }
      }
      this.setData({
        stars
      })
    },
  }
})