// pages/evaluation/post/reviews/index.js
const app = getApp()
let isclick1 = true
let isclick3 = true
let newImgList = []
let num = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isanonymity: 2,
    tempImage: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      comid,
      goodsid,
      orderid
    } = options
    // 进入追评填写
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.req('my/enterappendcom', {
        orderid, // 订单id
        comid, // 评论id
        goodsid // 订单id
      })
      .then(res => {
        if (res.flag == "0") {
          this.setData({
            data: res.data,
            comid,
            goodsid,
            orderid
          })
          wx.hideLoading()
        }
      })
      .catch(res => {
        this.setData({
          comid,
          goodsid,
          orderid
        })
        wx.hideLoading()
      })
  },
  /**
   * 添加图片
   */
  addImg: function() {
    if (!isclick1) {
      return
    }
    isclick1 = false
    let that = this
    let count = that.data.tempImage.length
    wx.chooseImage({
      count: 6 - count, //最多可以选择的图片总数  
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        isclick1 = true
        let tempImage = that.data.tempImage
        for (let path of res.tempFilePaths) {
          tempImage = tempImage.concat({
            url: path,
            uploaded: false,
            uploadUrl: ''
          })
        }
        that.setData({
          tempImage: tempImage
        })
      }
    })
  },
  /**
   * 删除图片
   */
  deleteImg: function(e) {
    let index = e.currentTarget.dataset.index
    let tempImage = this.data.tempImage
    tempImage.splice(index, 1)
    this.setData({
      tempImage
    })
  },
  /**
   * 复选框是否匿名
   */
  checkboxChange: function(e) {
    let isanonymity = e.detail.value[0] ? 1 : 2
    this.setData({
      isanonymity
    })
  },
  /**
   * 评价框输入焦点事件
   */
  blurOnTextArea: function(e) {
    if (e.detail.value.length >= 500) {
      wx.showToast({
        title: '最多只能输入500个字',
        icon: "none"
      })
      return
    }
    this.setData({
      content: e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    })
    const content = e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    this.setData({
      content
    })
  },
  /**
   * 发表追评
   */
  submitReviews() {
    let that = this
    if (!isclick3) {
      return
    }
    isclick3 = false
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    for (var promiseArr = [], i = 0; i < that.data.tempImage.length; i++) {
      promiseArr.push(that.uploadImg(that.data.tempImage[i].url, that.data.tempImage[i].uploaded, that.data.tempImage[i].uploadUrl))
    }
    Promise.all(promiseArr)
      .then(() => {
        wx.hideLoading()
        if (num !== newImgList.length) {
          wx.showModal({
            title: '提示',
            content: `${newImgList.length-num}张图片过大，已为您删除，请重新上传后提交`,
            showCancel: false,
            confirmColor: '#62648a'
          })
          newImgList = newImgList.filter(list => list.uploaded == true) //清除上传失败的图片
          that.setData({
            tempImage: newImgList
          })
          newImgList = []
          num = 0
          isclick3 = true
        } else {
          wx.showLoading({
            title: '发布中...',
            mask: true
          })
          app.req('my/addappendcom', {
              comid: that.data.comid, // 评价id
              goodsid: that.data.goodsid, // 商品id
              img: newImgList.map(list => {
                return list.uploadUrl
              }), // 图片数组
              content: that.data.content, // 评价的内容
              isanonymity: that.data.isanonymity, // 是否匿名
              orderid: that.data.orderid // 订单id
            })
            .then(res => {
              if (res.flag == "0") {
                wx.hideLoading()
                wx.showToast({
                  title: '提交成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta:1
                  })
                  isclick3 = true
                }, 1000)
              }
            })
            .catch(res => {
              wx.hideLoading()
              wx.showToast({
                title: '提交失败',
              })
              isclick3 = true
              
            })
        }
      })

  },
  /**
   * 预览图片
   */
  previewImg(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.tempImage;
    wx.previewImage({
      current: imgArr[index].url, //当前图片地址
      urls: imgArr.map(list => {
        return list.url
      }), //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  uploadImg: function(url, uploaded, uploadUrl) {
    return new Promise((resolve, reject) => {
      if (uploaded) {
        num++
        newImgList = newImgList.concat({
          url: url,
          uploaded: uploaded,
          uploadUrl: uploadUrl
        })
        resolve()
      } else {
        wx.uploadFile({
          url: 'https://kpzuan.com/api/system/upload',
          filePath: url,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success(res) {
            if (res.statusCode === 200) {
              let data = JSON.parse(res.data)
              num++
              newImgList = newImgList.concat({
                url: url,
                uploaded: true,
                uploadUrl: data.data.url
              })
            } else {
              newImgList = newImgList.concat({
                url: url,
                uploaded: false,
                uploadUrl: uploadUrl
              })
            }
            resolve()
          },
          fail(error) {
            newImgList = newImgList.concat({
              url: url,
              uploaded: false,
              uploadUrl: uploadUrl
            })
            resolve()
          }
        })
      }

    })
  }

})