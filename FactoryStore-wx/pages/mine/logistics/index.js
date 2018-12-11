// pages/mine/logistics/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    const id = options.id
    // 获取物流信息
    app.req('my/logistics', {
      id
    })
      .then(res => {
        if (res.flag == "0") {
          let Traces = res.data.Traces
          Traces.map(item=>{
            let time = item.AcceptTime
            item['date']=time.split(' ')[0]
            item['time']=time.split(' ')[1]
            return item
          })
          this.setData({
            info: res.data
          })
          wx.hideLoading()
        }
      })
  },
  /**
   * 前往详情页
   */
  toDetail:function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/detail?id='+id,
    })
  }
})