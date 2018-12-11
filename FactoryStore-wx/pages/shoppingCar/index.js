// pages/shoppingCar/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCar: [],
    oldSelect: [],
    checkAll: false,
    totalPrice: 0,
    total: 0,
    idarr: {},
    cid: '',
    showModal: false,
    cancelText: "取消",
    confirmText: "确定",
    title: "确定要删除吗？",
    goodsSelected: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    app.req('cart/list', {})
      .then(res => {
        let shopList = that.selectGoods(that.data.oldSelect, that.data.goodsSelected, res.data.list)
        that.setData({
          shopCar: shopList.data,
          checkAll: shopList.checkAll
        })
        that.calculatedTotal()
      })
      .catch(res => {})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this;
    app.req('cart/list', {})
      .then(res => {
        let shopList = that.selectGoods(that.data.oldSelect, that.data.goodsSelected, res.data.list)
        that.setData({
          shopCar: shopList.data,
          checkAll: shopList.checkAll
        })
        that.calculatedTotal()
        wx.stopPullDownRefresh()
      })
      .catch(res => {
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 商店checkbox选择事件
   */
  checkboxShop: function(e) {
    let that = this;
    let newSelect = e.detail.value; //已选择数组
    let oldSelect = that.data.oldSelect; //上一次选择的数组
    let shopCar = that.data.shopCar; //购物车数据
    let goodsSelected = []
    //通过对比新旧数组的长度判断此次操作是选中商店还是取消选中
    if (newSelect.length > oldSelect.length) { //选中商店
      for (let i in newSelect) { //遍历新数组
        if (!oldSelect.includes(newSelect[i])) { //找出勾选的商店，将其下的生效商品勾选
          shopCar = shopCar.map((pre) => {
            if (pre.id === newSelect[i]) {
              pre.checked = true
              pre.goods = pre.goods.map(c => {
                if (c.status === '1' && c.type === '1' && c.stock > 0) {
                  c.checked = true
                }
                return c
              })
            }
            return pre
          })
        }
      }
    } else { //取消选中商店
      for (let i in oldSelect) {
        if (!newSelect.includes(oldSelect[i])) { //找出取消勾选的商店，将其下的生效商品取消勾选
          shopCar = shopCar.map((pre) => {
            if (pre.id === oldSelect[i]) {
              delete pre.checked
              pre.goods = pre.goods.map(c => {
                delete c.checked
                return c
              })
            }
            return pre
          })
        }
      }
    }
    for (let shop of shopCar) {
      for (let good of shop.goods) {
        if (good.checked) {
          goodsSelected.push(good.cid)
        }
      }
    }
    let checkAll = false
    if (newSelect.length === shopCar.length) {
      checkAll = true
    } else {
      checkAll = false
    }
    that.setData({
      oldSelect: newSelect,
      shopCar: shopCar,
      checkAll: checkAll,
      goodsSelected: goodsSelected
    })
    that.calculatedTotal()
  },

  /**
   * 购物车商品checkbox事件
   */
  checkboxCommodity: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index, //操作商品所属商店id
      shopCar = that.data.shopCar, //购物车数据
      selectArray = e.detail.value, //操作后所操作的商品所属商店下所有选中商品的id数组
      oldSelect = that.data.oldSelect, //上一次操作后的选中商店id数组
      sum = 0, //计数器
      goodsSelected = []
    for (let goodIndex in shopCar[index].goods) { //遍历商店商品数组，计算商店中生效商品的数量
      let good = shopCar[index].goods[goodIndex]
      if (good.status === '1' && good.type === '1' && good.stock > 0) {
        sum++
      }
    }
    if (sum === selectArray.length) { //如果生效商品数量等于选中商品的数量，勾选商店
      shopCar[index].checked = true
      shopCar[index].goods = shopCar[index].goods.map(c => {
        if (selectArray.includes(c.cid)) {
          c.checked = true
        }
        return c
      })
    } else if (selectArray.length === 0) { //选中商品的数量为0，取消勾选商店
      delete shopCar[index].checked
      shopCar[index].goods = shopCar[index].goods.map(c => {
        delete c.checked
        return c
      })
    } else { //生效商品数量大于选中商品的数量,取消勾选商店
      delete shopCar[index].checked
      shopCar[index].goods = shopCar[index].goods.map(c => {
        if (selectArray.includes(c.cid)) {
          c.checked = true
        } else {
          delete c.checked
        }
        return c
      })
    }
    let newSelect = shopCar.map(c => { //最后获取当前选中的商店id,存入数组
      if (c.checked) {
        return c.id
      }
    })
    newSelect = newSelect.filter(n => n)
    let checkAll = false
    if (newSelect.length === shopCar.length) {
      checkAll = true
    } else {
      checkAll = false
    }
    for (let shop of shopCar) {
      for (let good of shop.goods) {
        if (good.checked) {
          goodsSelected.push(good.cid)
        }
      }
    }
    that.setData({
      shopCar: shopCar,
      oldSelect: newSelect,
      checkAll: checkAll,
      goodsSelected: goodsSelected
    })
    that.calculatedTotal()
  },

  checkAll: function(e) {
    let that = this
    let shopCar = that.data.shopCar
    let newSelect = []
    let checkAll = that.data.checkAll
    let goodsSelected = []
    if (e.detail.value.length) {
      shopCar.map(car => {
        let i = 0
        car.goods.map(good => {
          if (good.status === '1' && good.type === '1' && good.stock > 0) {
            good.checked = true
            i++
          }
          return good
        })
        if (i > 0) {
          newSelect.push(car.id)
          car.checked = true
        }
        return car
      })
      checkAll = true
    } else {
      shopCar.map(car => {
        car.goods.map(good => {
          delete good.checked
          return good
        })
        delete car.checked
        return car
      })
      checkAll = false
    }
    for (let shop of shopCar) {
      for (let good of shop.goods) {
        if (good.checked) {
          goodsSelected.push(good.cid)
        }
      }
    }
    that.setData({
      shopCar: shopCar,
      oldSelect: newSelect,
      checkAll: checkAll,
      goodsSelected: goodsSelected
    })
    that.calculatedTotal()
  },

  //加法
  add: function(a, b) {
    let c, d, e;
    let that = this
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (that.mul(a, e) + that.mul(b, e)) / e;
  },
  //乘法
  mul: function(a, b) {
    let c = 0,
      d = a.toString(),
      e = b.toString();
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  },

  /**
   * 计算总计和商品数
   */
  calculatedTotal: function() {
    let that = this
    let shopCar = that.data.shopCar //当前购物车数据
    let totalPrice = 0 //总价
    let total = 0 //总数
    let idarr = {} //传输给结算页面的数据
    let cid = []
    let sum = 0 //计数器
    shopCar.map(car => {
      car.goods.map(good => {
        if (good.checked) {
          total = that.add(total, good.count)
          totalPrice = that.add(totalPrice, that.mul(good.price, good.count))
          idarr[sum] = {
            id: good.goeid,
            sum: good.count,
            norms: good.norms
          }
          cid.push(good.cid)
          sum++
        }

      })
    })
    that.setData({
      total: total,
      totalPrice: totalPrice,
      idarr: idarr,
      cid: cid.join(',')
    })

  },
  /**
   * 删除商品
   */
  deleteGood: function(e) {
    let that = this
    that.setData({
      showModal: true,
      deleteCid: e.currentTarget.dataset.cid
    })
  },

  /**
   * 跳转提交订单页面
   */
  toConfirm: function() {
    let that = this
    let cid = that.data.cid
    let idarr = JSON.stringify(that.data.idarr)
    if (idarr === '{}') {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../goods/confirm-order?idarr=' + idarr + '&cid=' + cid,
      })
    }
  },

  /**
   * 跳转商品详情
   */
  toGoodDetail: function(e) {
    let gid = e.currentTarget.dataset.gid
    wx.navigateTo({
      url: '../goods/detail?id=' + gid,
    })
  },
  onCancel: function() {
    this.setData({
      showModal: false
    })
  },
  onConfirm: function() {
    let that = this
    let cid = that.data.deleteCid
    let goodsSelected = that.data.goodsSelected
    app.req('cart/delete', {
        id: cid
      })
      .then(res => {
        if (res.flag == '0') {
          if (goodsSelected.includes(cid)) {
            goodsSelected.splice(goodsSelected.indexOf(cid), 1)
          }
          app.req('cart/list', {})
            .then(res => {
              let shopList = that.selectGoods(that.data.oldSelect, that.data.goodsSelected, res.data.list)
              that.setData({
                shopCar: shopList.data,
                checkAll: shopList.checkAll,
                goodsSelected: goodsSelected,
                showModal: false
              })
              that.calculatedTotal()
            })
            .catch(res => {
              console.error(res)
            })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  selectGoods: function(shopsSelect, goodsSelect, datalist) {
    let sum = 0
    datalist.map(shop => {
      if (shopsSelect.includes(shop.id)) {
        shop.checked = true
        shop.goods = shop.goods.map(c => {
          if (goodsSelect.includes(c.cid) && c.status === '1' && c.type === '1' && c.stock > 0) {
            c.checked = true
          }
          if (c.status === '1' && c.type === '1' && c.stock > 0) {
            sum++
          }
          return c
        })
      } else {
        shop.goods = shop.goods.map(c => {
          if (goodsSelect.includes(c.cid) && c.status === '1' && c.type === '1' && c.stock > 0) {
            c.checked = true
          }
          if (c.status === '1' && c.type === '1' && c.stock > 0) {
            sum++
          }
          return c
        })
      }
      return shop
    })
    let checkAll = true
    if (sum !== goodsSelect.length || sum === 0) {
      checkAll = false
    }
    let result = {
      data: datalist,
      checkAll: checkAll
    }
    return result
  }
})