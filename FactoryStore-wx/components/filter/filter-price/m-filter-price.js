// components/m-filter-price.js
Component({
  /**
   * 组件的属性列表
   * havImage:是否有顶部图片
   * marginTop:模块距离上方模块距离。
   */
  properties: {
    price:{
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodslist: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isCurrent:true,
    isFocus1:false,
    isFocus2:false,
    lowPrice:'',
    highPrice:'',
    prices:{},
    priceList:[]
  },

  /**
   * 组件的生命周期
   */
  attached: function () { 
      
  }, 

  /**
   * 组件的方法列表
   */
  methods: {
    _bindInputFocus1:function (e) {
      this.setData({
        isFocus1: true
      })
    },
    _bindInputBlur1:function (e) {
      if (!this.data.lowPrice) {
        this.setData({
          current: -1
        })
      }
      const lowPrice = e.detail.value
      const highPrice = this.data.highPrice
      const prices = {}
      if (lowPrice>highPrice && highPrice!='') {
        wx.showToast({
          title: '最低价不能高于最高价',
          icon: 'none'
        })
        this.setData({
          isFocus1: false,
          lowPrice:''
        })
        return
      }

      prices['highPrice'] = highPrice
      prices['lowPrice'] = lowPrice
      this.setData({
        isFocus1: false,
        prices,
        lowPrice: e.detail.value
      })
      this.triggerEvent('getPrice',prices)
    },
    _bindInputFocus2: function (e) {
      this.setData({
        isFocus2: true
      })
    },
    _bindInputBlur2: function (e) {
      if (!this.data.highPrice) {
        this.setData({
          current: -1
        })
      }
      const highPrice = e.detail.value
      const lowPrice = this.data.lowPrice
      const prices = {}

      console.log(lowPrice)
      console.log(highPrice)
      if (lowPrice > highPrice && lowPrice != '') {
        wx.showToast({
          title: '最低价不能高于最高价',
          icon: 'none'
        })
        this.setData({
          isFocus2: false,
          highPrice: ''
        })
        return
      }

      prices['highPrice'] = highPrice
      prices['lowPrice'] = lowPrice
      this.setData({
        isFocus2: false,
        prices,
        highPrice: e.detail.value
      })
      this.triggerEvent('getPrice', prices)
    },
    _bindTapOnPrices:function (e) {
      let newArr = this.data.newArr || []
      // 获取价格数组
      let priceList = this.data.price
      console.log(priceList)
      // 获取当前选中的下标
      let currentInex = e.currentTarget.dataset.index
      console.log(currentInex)
      // 当前选中取反
      priceList[currentInex].checked = !priceList[currentInex].checked
      priceList.forEach((item,index)=>{
        if (index != currentInex){
          item.checked=false
        }
      })
      if (priceList[currentInex].checked) {
        // 如果当前为选中，将值放入labelIds
        const prices = {}
        prices['lowPrice'] = priceList[currentInex].low,
        prices['highPrice'] = priceList[currentInex].high == 'max' ? '' : priceList[currentInex].high
        this.setData({ prices })
        this.triggerEvent('getPrice', prices)
      } else {
        // 如果当前为不选中,prices为空
        const prices = {}
        prices['lowPrice'] = '',
        prices['highPrice'] = ''
        this.setData(prices)
        this.triggerEvent('getPrice', prices)
      }
      this.setData({
        lowPrice:'',
        highPrice:'',
        price: priceList
      })
    }
  }
})