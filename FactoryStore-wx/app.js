/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')



/**
 * 钻界商城 API模块
 */
const getdata = require('./utils/getData.js')
App({
  data: {
    name: '钻界商城-小程序',
    version: '0.1.0',
    currentCity: '北京'
  },
  /**
   * WeChat API
   */
  wechat: wechat,

  /**
   * 钻界工厂 API
   */
  getdata: getdata,

  /**
   * 发送请求二次封装，添加token
   * @param  {String} path   请求路径
   * @param  {Object} params 参数(为空则不填)
   * @return {Object} res    后台返回数据
   */
  req: function(path, params = {}) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.checkUser) {
        that.tokenReadyCallback = res => {
          let token = wx.getStorageSync('token')
          that.globalData.checkUser = false
          getdata(path, params, token)
            .then(res => {
              if (res.data.flag == "0") {
                resolve(res.data)
              } else if (res.data.flag == "1000") {
                wx.showToast({
                  icon: "none",
                  title: res.data.data,
                })
                reject(res.data.flag)
              } else if (res.data.flag == '1004') { //session_key过期
                that.doLogin().then(res => {
                  wx.setStorageSync('token', res.data.data.token)
                  resolve(that.req(path, params))
                }).catch(res => {
                  reject()
                  wx.showToast({
                    title: '网络异常',
                  })
                })
              } else if (res.data.flag == '1005') {
                wx.showToast({
                  icon: "none",
                  title: res.data.data
                })
                reject(res.data.flag)
              } else if (res.data.flag == '1006') {
                wx.redirectTo({
                  url: '/pages/authorization/index',
                })
              }else{
                wx.showToast({
                  icon:"none",
                  title:"系统异常"
                })
                reject('后台报错')
              }
            })
            .catch(
              res => {
                reject(res)
              }
            )
        }
      } else {
        let token = wx.getStorageSync('token')
        getdata(path, params, token)
          .then(res => {
            if (res.data.flag == "0") {
              resolve(res.data)
            } else if (res.data.flag == "1000") {
              wx.showToast({
                icon: "none",
                title: res.data.data,
              })
              reject(res.data.flag)
            } else if (res.data.flag == '1004') { //session_key过期
              that.doLogin().then(res => {
                wx.setStorageSync('token', res.data.data.token)
                resolve(that.req(path, params))
              }).catch(res => {
                wx.showToast({
                  title: '网络异常',
                })
              })
            } else if (res.data.flag == '1005') {
              wx.showToast({
                icon: "none",
                title: res.data.data
              })
              reject(res.data.flag)
            } else if (res.data.flag == '1006') {
              reject(res.data.flag)

              wx.redirectTo({
                url: '/pages/authorization/index',
              })
            }
          })
          .catch(
            res => {
              reject(res)
            }
          )
      }


    })
  },
  onLaunch: function() {
    wx.showModal({
      title: '提示',
      content: '尊敬的客户您好，目前系统处于测试阶段，商品价格均为测试价格，请勿购买，敬请谅解！点击确定表示同意并继续使用。',
      showCancel:false
    })
    let that = this
    that.checkToken()
      .then(function() {
        return that.getUser()
      })
      .then(function(res) {
        if (that.tokenReadyCallback) {
          that.tokenReadyCallback(true)
        } else {
          that.globalData.checkUser = false
        }
      })
      .catch(function() {
        that.doLogin()
          .then(res => {
            wx.setStorageSync('token', res.data.data.token)
            that.getUser()
              .then(function() {
                if (that.tokenReadyCallback) {
                  that.tokenReadyCallback(true)
                } else {
                  that.globalData.checkUser = false
                }
              })
              .catch(function() {
                wx.showToast({
                  title: '网络异常',
                })
              })
          })
      })
    if (wx.getStorageSync('goodSku')) {
      wx.removeStorage({
        key: 'goodSku',
        success: function(res) {},
      })
    }

  },

  /**
   * 检查token状态
   */
  checkToken: function() {
    return new Promise((resolve, reject) => {
      let loginFlag = wx.getStorageSync('token')
      if (loginFlag) {
        resolve()
      } else {
        reject('token已过期')
      }
    })
  },

  /**
   * 获取token
   */
  doLogin: function() {
    return new Promise((resolve, reject) => {
      wechat
        .login()
        .then(res => {
          this.globalData.checkUser = false
          getdata("system/inituser", {
              code: res.code
            }, '')
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err)
            })
        })
    })
  },
  setToken(token) {
    return new Promise((resolve, reject) => {
      wx.setStorageSync('token', token)
      this.globalData.checkUser = true
      reject()
    })
  },
  getUser() {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                that.getdata("system/login", {
                    nickname: res.userInfo.nickName,
                    avatar: res.userInfo.avatarUrl,
                    sex: res.userInfo.gender
                  }, wx.getStorageSync('token'))
                  .then(res => {
                    if (res.data.flag == '0') {
                      resolve(res)
                    } else {
                      reject(res)
                    }
                  })
                  .catch(err => {
                    reject(err)
                  })
              }
            })
          } else {
            that.getdata("system/logout", {}, wx.getStorageSync('token'))
              .then(res => {
                if (res.data.flag == '0') {
                  resolve('未授权')
                } else {
                  reject(res)
                }
              })
              .catch(res => {
                reject(res)
              })
          }
        }
      })
    })

  },
  /**
   * 收集formid
   * @param  {String} formId   单个formId
   */

  dealFormIds: function(formId, callback) {
    return new Promise((resolve, reject) => {
      if (formId !== "the formId is a mock one") {
        let formIds = this.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
        if (!formIds) formIds = [];
        let data = {
          formid: formId,
          expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
        }
        formIds.push(data); //将data添加到数组的末尾
        this.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
        resolve(formId)
      } else {
        reject('添加失败,formid为pc端虚拟id')
      }
    })
  },
  
  globalData: {
    checkUser: true,
    userInfo: false,
  }
})