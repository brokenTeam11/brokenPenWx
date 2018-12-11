// pages/address/addAddress/index.js
const app = getApp()
var QQMapWX = require('../../../static/libs/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
    key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4'
});
var strategies = { //表单验证策略组
    isNonEmpty: function(value, errorMsg) {
        if (value === '' || value === null) {
            return errorMsg;
        }
    },
    isToLong: function(value, erroMsg) {
        if (value.length > 10) {
            return erroMsg
        }
    },
    isMobile: function(value, errorMsg) { // 手机号码格式
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addrdetail: { //地址数据
            id: '',
            name: '',
            sex: 1,
            phone: '',
            address: [],
            addressdetail: '',
            isdefault: 2,
        },
        adcode: '', //区域代码
        showModal: false, //模态框显示状态
        submitOver: true, //提交是否完成
        isEdit: false, //是否是修改地址操作
    },


    /**
     * 生命周期函数--监听页面加载
     * 
     */
    onLoad: function(options) {
        let that = this
        if (options.id === '' || !options.id) { //判断是否有id,有为修改地址，没有则为新增地址
            wx.setNavigationBarTitle({
                title: '新增地址',
            })
            that.setData({
                isEdit: false
            })
        } else {
            wx.setNavigationBarTitle({
                title: '修改地址',
            })
            that.setData({
                isEdit: true
            })
            wx.showLoading({
                title: '',
                mask: true
            })
            app.req('my/addrdetail', { //获取地址详情
                    id: options.id
                })
                .then(res => {
                    let address = that.data.addrdetail
                    address.id = res.data.id
                    address.name = res.data.name
                    address.sex = res.data.sex
                    address.phone = res.data.phone
                    address.address = [res.data.province, res.data.city, res.data.district]
                    address.addressdetail = res.data.address
                    address.isdefault = res.data.isdefault
                    that.setData({
                        addrdetail: address,
                        adcode: res.data.core
                    })
                    wx.hideLoading()
                })
                .catch(res => {
                    wx.hideLoading()
                })
        }
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
     * 姓名输入监听
     */
    bindinputName: function(e) {
        let addressDetail = this.data.addrdetail
        let name = e.detail.value
        addressDetail.name = name
        this.setData({
            addrdetail: addressDetail
        })
    },

    /**
     * 手机输入监听
     */
    bindinputPhone: function(e) {
        let addressDetail = this.data.addrdetail
        let phone = e.detail.value
        addressDetail.phone = phone
        this.setData({
            addrdetail: addressDetail
        })
    },

    /**
     * 详细地址输入监听
     */
    bindinputAddress: function(e) {
        let addressDetail = this.data.addrdetail
        let addressdetail = e.detail.value
        addressDetail.addressdetail = addressdetail
        this.setData({
            addrdetail: addressDetail
        })
    },

    /**
     * 性别选择监听
     */
    bindchangeRadio: function(e) {
        let addressDetail = this.data.addrdetail
        let sex = Number(e.detail.value)
        addressDetail.sex = sex
        this.setData({
            addrdetail: addressDetail
        })
    },


    /**
     * 地区选择事件
     */
    bindRegionChange: function(e) {
        let that = this
        let addressDetail = that.data.addrdetail
        addressDetail.address = e.detail.value
        let adcode = ''
        if (e.detail.code) { //判断adcode是否存在，小程序低版本基础库中选择组件不会返回adcode，需要手动获取
            adcode = e.detail.code[e.detail.code.length - 1]
            that.setData({
                addrdetail: addressDetail,
                adcode: adcode
            })
        } else { //不存在则需要通过关键词手动获取地区经纬度，再通过经纬度手动获取地区code
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
            qqmapsdk.geocoder({
                address: e.detail.value.join(""),
                success: e => {
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: e.result.location.lat,
                            longitude: e.result.location.lng
                        },
                        coord_type: 4,
                        success: function(res) {
                            wx.hideLoading()
                            adcode = res.result.ad_info.adcode
                            that.setData({
                                addrdetail: addressDetail,
                                adcode: adcode
                            })
                        }
                    })
                }
            })
        }

    },


    /**
     * 监听是否设置为默认地址选择框
     */
    setDefault: function() {
        let addressDetail = this.data.addrdetail
        if (addressDetail.isdefault === 1) {
            addressDetail.isdefault = 2
        } else if (addressDetail.isdefault === 2) {
            addressDetail.isdefault = 1
        }
        this.setData({
            addrdetail: addressDetail
        })
    },

    /**
     * 地图选点事件
     * 点击地区输入框旁地图图标执行该事件
     */
    choosLocation: function() {
        let that = this
        let addressDetail = that.data.addrdetail
        wx.chooseLocation({ //小程序地图选点接口,返回经纬度
            success: function(res) {
                let name = res.name
                qqmapsdk.reverseGeocoder({ //使用经纬度通过腾讯地图接口获取地址详细信息
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    coord_type: 4,
                    success: function(res) {
                        let address = res.result.address_component
                        if (res.status === 0) {
                            if (address.nation === "中国" && (address.province !== "香港特别行政区" && address.province !== "澳门特别行政区" && address.province !== "台湾省")) {
                                addressDetail.address = [address.province, address.city, address.district]
                                addressDetail.addressdetail = address.street_number + " " + name
                                that.setData({
                                    addrdetail: addressDetail,
                                    adcode: res.result.ad_info.adcode
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '抱歉，暂不支持中国大陆以外的地址',
                                    showCancel: false
                                })
                            }
                        } else {
                            wx.showToast({
                                title: '发生了未知错误，请稍后再试',
                            })
                        }
                    },
                    fail: function(res) {
                        console.log(res);
                    }
                })
            },
            fail: function(res) {
                wx.getSetting({
                    success: res => {
                        if (!res.authSetting['scope.userLocation']) {
                            that.setData({
                                showModal: true
                            })
                        }
                    }
                })
            }
        })
    },
    onCancel: function() {
        this.setData({
            showModal: false
        })
    },
    onConfirm: function() {
        this.setData({
            showModal: false
        })
    },
    /**
     * 保存地址
     */
    submitAddress: function() {
        let that = this;
        let addrdetail = that.data.addrdetail
        let nameisNonEmpty = strategies.isNonEmpty(addrdetail.name, '联系人不能为空')
        let nameisToLong = strategies.isToLong(addrdetail.name, '联系人姓名不能超过10个字符')
        let phoneisNonEmpty = strategies.isNonEmpty(addrdetail.phone, '电话不能为空')
        let phoneisMobile = strategies.isMobile(addrdetail.phone, '手机号码格式错误')
        let addressisNonEmpty = strategies.isNonEmpty(addrdetail.address, '地址不能为空')
        let addressdetailisNonEmpty = strategies.isNonEmpty(addrdetail.addressdetail, '详细地址不能为空')
        let erroMsg = nameisNonEmpty || phoneisNonEmpty || phoneisMobile || addressisNonEmpty || addressdetailisNonEmpty || nameisToLong

        if (erroMsg) { //未通过验证则提示
            wx.showToast({
                title: erroMsg,
                icon: 'none',
                mask: true
            })
        } else {
            if (!that.data.submitOver) {
                return false
            }
            that.setData({
                submitOver: false
            })
            wx.showLoading({
                title: '正在保存',
                mask: true,
            })
            let reqURL = 'my/addaddress'
            let title = '添加成功'
            if (that.data.isEdit) { //判断是新增地址还是修改地址
                reqURL = 'my/editaddress'
                title = '修改成功'
            }
            if (that.data.adcode !== '') {
                addrdetail.address.push(that.data.adcode)
            }
            app.req(reqURL, {
                    id: addrdetail.id,
                    name: addrdetail.name,
                    sex: addrdetail.sex,
                    phone: addrdetail.phone,
                    address: addrdetail.address,
                    addressdetail: addrdetail.addressdetail,
                    isdefault: addrdetail.isdefault
                })
                .then(res => {
                    if (res.flag == '0') {
                        wx.hideLoading()
                        wx.showToast({
                            title: title,
                            icon: 'none',
                            image: '',
                            mask: true,
                            success: function(res) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            },
                        })
                    } else {
                        wx.hideLoading()
                    }
                    that.setData({
                        submitOver: true
                    })
                })
                .catch(res => {
                    that.setData({
                        submitOver: true
                    })
                    wx.hideLoading()
                })
        }
    }
})