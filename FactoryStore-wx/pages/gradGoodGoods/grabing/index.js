// pages/gradGoodGoods/grabing/index.js
const app = getApp();
var timer = {};
let intervalTimer = null;
let first = true
let activityid = undefined,
  userid = undefined,
  username = undefined,
  shareActivityid = undefined,
  shareUserid = undefined
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeList: [],
    loading: false,
    currentId: "",
    maskDisplay: true,
    infoModel: true,
    shareModel: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activityid) {
      shareActivityid = options.activityid
    }
    if (options.userid) {
      shareUserid = options.userid
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.hideShareMenu()
    let that = this;
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    
    that.getData(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for (let each in timer) {
      clearTimeout(timer[each])
    }
    clearInterval(intervalTimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    for (let each in timer) {
      clearTimeout(timer[each])
    }
    clearInterval(intervalTimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let activeList = that.data.activeList;
    let active = {}
    for (let a in activeList) {
      if (activeList[a].id == that.data.currentId) {
        active = activeList[a]
      }
    }
    that.setData({
      maskDisplay: true,
      shareModel: true
    })
    return {
      title: username + '邀你' + active.activityprice + '元抢[' + active.name + ']，你确定不来吗',
      imageUrl: active.img,
      path: '/pages/index/index?id=' + active.id + '&activityid=' + activityid + '&userid=' + userid
    }
  },

  swiperChange: function (e) {
    let that = this
    if (that.data.loading) {
      return false
    }
    that.setData({
      loading: true
    })
    let id = that.data.activeList[e.detail.current].id
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    for (let each in timer) {
      clearTimeout(timer[each])
    }
    app.req('panicbuying/getdata', {
      id: id
    })
      .then(res => {
        that.setData({
          loading: false,
          currentId: that.data.activeList[e.detail.current].id,
          fragment: res.data.fragment,
          status: res.data.status,
          marquee: res.data.marquee
        })
        that.pushList(res.data.marquee)
      })
      .catch(res => {
        wx.hideLoading()
        that.setData({
          loading: false
        })
      })
  },
  catchTouchMove: function (e) {
    return false
  },

  pushList: function (list) {
    for (let each in timer) {
      clearTimeout(timer[each])
    }
    let that = this;
    let time = 0
    let marqueeList = []
    for (let i = 0; i < list.length; i++) {
      let randomTime = 1000 + Math.random() * 2000
      timer['timer' + i] = setTimeout(function () {
        marqueeList.push(new Doomm(list[i].status == 1 ? `${list[i].name}冲了进来` : `${list[i].name}抢到了碎片${list[i].fragment}片`, Math.random() * 10 > 5 ? 0 : 179, 8 + Math.random() * 2, list[i].avatar))
        that.setData({
          marqueeList: marqueeList
        })
      }, time)
      time = time + randomTime
    }
    wx.hideLoading()
  },
  getData: function (id) {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.req('panicbuying/index', {
      activityid: shareActivityid ? shareActivityid : 0
    })
      .then(res => {
        if (res.data.isexpired === 2) {
          if (first) {
            let time = parseInt(res.data.list[0].time)
            that.getServerTime(time * 1000)
          }
          that.setData({
            activeList: res.data.list,
            currentId: id ? id : res.data.list[0].id,
          })
          app.req('panicbuying/getdata', {
              id: id ? id : res.data.list[0].id,
          })
            .then(data => {
              that.setData({
                fragment: data.data.fragment,
                status: data.data.status,
                marquee: data.data.marquee
              })
              if (first) {
                app.req('panicbuying/share', {})
                  .then(shareRes => {
                    first = false
                    activityid = shareRes.data.activityid
                    userid = shareRes.data.userid
                    username = shareRes.data.username
                    that.setData({
                      loading: false
                    })
                    that.pushList(data.data.marquee)
                  })
                  .catch(res => {
                    wx.hideLoading()
                    that.setData({
                      loading: false
                    })
                  })
              } else {
                that.setData({
                  loading: false
                })
                that.pushList(data.data.marquee)
              }

            })
            .catch(res => {
              wx.hideLoading()
              that.setData({
                loading: false
              })
            })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '活动已结束',
            showCancel: false,
            confirmColor: '#62648a',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })
        }


      })
      .catch(res => {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        that.setData({
          loading: false
        })
      })

  },
  toRule: function () {
    wx.navigateTo({
      url: '/pages/mine/helpcenter/detail/index'
    })
  },
  grapFragmentation: function (e) {
    let that = this;
    let goodsid = e.currentTarget.dataset.goodsid;
    app.req('panicbuying/grabfragment', {
      goodsid: goodsid,
      sharerid: shareUserid ? shareUserid : null
    })
      .then(res => {
        if (res.data.status == 1) {
          that.setData({
            count: res.data.count,
            maskDisplay: false,
            infoModel: false,
            needfragment: e.currentTarget.dataset.fragment
          })
        } else if (res.data.status == 2) {
          wx.showToast({
            title: '活动已结束',
            success: function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        } else if (res.data.status == 3) {
          that.setData({
            loading: true
          })
          that.getData(goodsid)
        }
      })
  },
  closeMask: function () {
    this.setData({
      maskDisplay: true,
      infoModel: true,
      shareModel: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getData(this.data.currentId)
  },
  stopCatch: function () {
    return false
  },
  openShare: function () {
    this.setData({
      maskDisplay: false,
      shareModel: false,
      infoModel: true
    })
  },
  cancelShare: function () {
    this.setData({
      maskDisplay: true,
      shareModel: true
    })
  },
  toShare: function () {
    wx.navigateTo({
      url: '/pages/share/poster/index?id=' + this.data.currentId,
    })
  },
  toGoodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/goods/detail?id=' + e.currentTarget.dataset.goodsid,
    })
  },
  getServerTime: function (endTime) {
    let that = this;
    intervalTimer = setInterval(() => {
      let remainTime = that.getRemainTime(endTime)
      let hours = that.leftpad(remainTime.hours, 2, '0')
      let minutes = that.leftpad(remainTime.minutes, 2, '0')
      let seconds = that.leftpad(remainTime.seconds, 2, '0')
      that.setData({
        time: `${hours}:${minutes}:${seconds}`
      })
      if (remainTime.total <= 0) {
        clearInterval(intervalTimer);
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }, 1000)
  },
  getRemainTime: (endTime) => {
    let t = endTime - Date.parse(new Date())
    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)))
    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    }
  },
  leftpad: function (str, len, ch) {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
      str = ch + str;
    }
    return str;
  }
})
class Doomm {
  constructor(text, top, time, avatar) {
    this.text = text;
    this.top = top;
    this.time = time;
    this.avatar = avatar
  }
}