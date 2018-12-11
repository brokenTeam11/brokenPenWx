const URI = 'https://kpzuan.com/api'
import dateForm from './getdate.js'
import md5 from './md5.js'
/**
 * 钻界商城-接口请求
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @param  {String} token  令牌
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function(path, params, token) {
  let date = new Date().Format("yyyyMMdd");
  let sign = md5(params !== '' ? JSON.stringify(params) + date + "$2018%^zjxm" + token : date + "$2018%^zjxm" + token)
  let data = {
    date: date,
    sign: sign,
    token: token,
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${URI}/${path}`,
      data: params !== '' ? Object.assign(data, {
        param: JSON.stringify(params)
      }) : data,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }

    })
  })
}