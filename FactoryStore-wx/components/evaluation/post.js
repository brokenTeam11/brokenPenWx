Component({
  /**
   * 组件的属性列表
   * havImage:是否有顶部图片
   * marginTop:模块距离上方模块距离。
   */
  properties: {
    labellist:{
      type:Array,
      value:[]
    },
    good:{
      type:Object,
      value:{}
    } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    select: false,
    mask: false,
    content: "",
    goodItem:{}
  },

  attached: function () {
    const goodItem = {
      goodsid: this.data.good.goodsid,
      listid: this.data.good.listid,
      title: this.data.good.title,
      score: 5,
      isanonymity:2
    }
    this.setData({
      goodItem
    })
    this.triggerEvent('getData', this.data.goodItem)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击label印象
     */
    clickOnLabel: function (e) {
      let labelIds = this.data.labelIds || []
      let newArr = this.data.newArr || []
      if (!this.judgeFunc()) {
        return
      }
      // 获取label印象数组
      let labellist = this.data.labellist
      // 获取当前选中的下标
      let currentInex = e.currentTarget.dataset.index
      // 获取当前选中的值
      let currentId = e.currentTarget.dataset.id
      // 当前选中取反
      labellist[currentInex].checked = !this.data.labellist[currentInex].checked
      if (labellist[currentInex].checked) {
        // 如果当前为选中，将值放入labelIds
        labelIds.push(currentId)
      } else {
        // 如果当前为不选中，向后删除一位
        for (let key in labelIds) {
          if (labelIds[key] === currentId) {
            labelIds.splice(key, 1)
          }
        }
      }
      let goodItem = this.data.goodItem
      console.log(goodItem)
      goodItem.label = labelIds
      this.setData({
        labelIds,
        labellist
      })
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 判断选择的不能超过12个
     */
    judgeFunc: function (callback) {
      let id = this.data.labelIds || [],
        value = this.data.labelVals || []
      if (id.length + value.length >= 12) {
        wx.showToast({
          title: '最多可选择12个标签',
          icon: 'none'
        })
        return false
      }
      return true
    },
    /**
     * 添加描述
     */
    addLabels: function () {
      this.showMask()
    },
    /**
     * 显示弹窗
     */
    showMask: function () {
      this.setData({
        mask: true
      })
    },
    /**
     * 隐藏弹窗
     */
    hideMask: function () {
      this.setData({
        mask: false
      })
    },
    /**
     * 弹窗取消事件
     */
    cancelFunc: function () {
      this.setData({
        inputVal: ''
      })
      this.hideMask()
    },
    /**
     * 弹窗确认事件
     */
    conformFunc: function () {
      let labellist1 = this.data.labellist1 || []
      let inputVal = this.data.inputVal
      if (!inputVal || inputVal=='') {
        this.hideMask()
        return
      }
      for (let key in labellist1) {
        if (labellist1[key].name && labellist1[key].name == inputVal) {
          this.hideMask()
          this.setData({
            inputVal: ""
          })
          return
        }
      }
      labellist1.push({ name: inputVal })
      console.log(labellist1.length + this.data.labellist.length)
      if (labellist1.length + this.data.labellist.length > 12) {
        wx.showToast({
          title: '最多存在12个标签',
          icon: 'none'
        })
        this.hideMask()
        this.setData({
          inputVal: ""
        })
        return
      }
      this.setData({
        labellist1,
        inputVal: ''
      })
      this.hideMask()
    },
    /**
     * 添加描述输入框失去焦点事件
     */
    blurOnInput: function (e) {
      this.setData({
        inputVal: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
      })
    },
    /**
     * 自定义印象点击事件
     */
    clickOnLabel1: function (e) {
      let labelVals = this.data.labelVals || []
      let newArr = this.data.newArr || []
      if (!this.judgeFunc()) {
        return
      }
      // 获取label印象数组
      let labellist1 = this.data.labellist1 || []
      // 获取当前选中的下标
      let currentInex = e.currentTarget.dataset.index
      // 获取当前选中的值
      let currentVal = e.currentTarget.dataset.value
      // 当前选中取反
      labellist1[currentInex].checked = !this.data.labellist1[currentInex].checked
      if (labellist1[currentInex].checked) {
        // 如果当前为选中，将值放入labelIds
        labelVals.push(currentVal)
      } else {
        // 如果当前为不选中，向后删除一位
        for (let key in labelVals) {
          if (labelVals[key] === currentVal) {
            labelVals.splice(key, 1)
          }
        }
      }
      let goodItem = this.data.goodItem
      goodItem.newlabel = labelVals
      this.setData({
        labelVals,
        labellist1
      })
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 添加图片
     */
    addImg: function () {
      let that = this
      let count = this.data.uploadImgCount || 0
      wx.chooseImage({
        count: 6 - count,  //最多可以选择的图片总数  
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          const tempFilePaths = res.tempFilePaths
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true
          })
          let uploadImgCount = that.data.uploadImgCount || 0;
          for (let i = 0, h = tempFilePaths.length; i < h; i++) {
            wx.uploadFile({
              url: 'https://kpzuan.com/api/system/upload',
              filePath: tempFilePaths[i],
              name: 'file',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success(res) {
                uploadImgCount++;
                wx.hideToast();
                const data = JSON.parse(res.data)
                let uploadImgs = that.data.uploadImgs || []
                uploadImgs.push({
                  url: data.data.url
                })
                that.setData({
                  uploadImgCount,
                  uploadImgs
                })
                that.data.goodItem.img = uploadImgs.map(item=>item.url)
                that.triggerEvent('getData', that.data.goodItem)
              },
              fail(res) {
                wx.hideToast();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
                })
              }
            })
          }
        }
      })
    },
    /**
     * 删除图片
     */
    deleteImg: function (e) {
      let index = e.currentTarget.dataset.index
      let uploadImgs = this.data.uploadImgs
      let uploadImgCount = this.data.uploadImgCount
      uploadImgs.splice(index, 1)
      uploadImgCount = uploadImgs.length  
      this.setData({
        uploadImgs,
        uploadImgCount
      })
      this.data.goodItem.img = uploadImgs.map(item => item.url)
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 评价框输入焦点事件
     */
    blurOnTextArea: function (e) {
      console.log(e.detail.value.length)
      if (e.detail.value.length >= 500) {
        wx.showToast({
          title: '最多只能输入500个字',
          icon:"none"
        })
        return
      }
      this.setData({
        content: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
      })
      this.data.goodItem.content = e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 获取星星组件的分数
     */
    getScore: function (e) {
      this.data.goodItem.score = e.detail.current
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 复选框是否匿名
     */
    checkboxChange:function (e) {
      this.data.goodItem.isanonymity = e.detail.value[0]?1:2
      this.triggerEvent('getData', this.data.goodItem)
    },
    /**
     * 预览图片
     */
    previewImg: function (e) {
      var index = e.currentTarget.dataset.index;
      var imgArr = this.data.goodItem.img
      wx.previewImage({
        current: imgArr[index], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }
})