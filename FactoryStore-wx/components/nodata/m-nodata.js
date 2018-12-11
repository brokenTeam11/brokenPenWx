Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: String,
      value: ''
    },
    src: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
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
    onConfirm() {
      this.triggerEvent('confirmFunc')
    },
    onCancel() {
      this.triggerEvent('cancelFunc')
    }
  }
})