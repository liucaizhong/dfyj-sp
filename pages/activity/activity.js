// pages/activity/activity.js
const app = getApp()
const activitySubmitStatus = app.globalData.activitySubmitStatus
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js')
var qqmapsdk
const { getBindInfoPromise } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    location: '',
    contact: '',
    address: '',
    start: '',
    end: "",
    enroll: "",
    status: 0,
    desc: "",
    content: null, //image format
    btnStatusDesc: '',
    infoStatus: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options
    const that = this

    getBindInfoPromise().then(info => {
      // console.log('info', info)
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivity.php?id=${id}&userId=${info.userId}`,
        success: function (res) {
          // console.log(res)
          that.setData({
            ...res.data,
            btnStatusDesc: activitySubmitStatus[+res.data.status || 0],
            infoStatus: info.status || 0
          })
          wx.setNavigationBarTitle({
            title: res.data.name,
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }).catch(err => {
      console.log(err)
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivity.php?id=${id}`,
        success: function (res) {
          // console.log(res)
          that.setData({
            ...res.data,
            btnStatusDesc: activitySubmitStatus[res.data.status || 0],
          })
          wx.setNavigationBarTitle({
            title: res.data.name,
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })

    qqmapsdk = new QQMapWX({
      key: '6JXBZ-ZW236-KGHSB-MHLYH-OFAX5-3XFMB'
    })
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
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
    return {
      title: this.data.name,
      path: `/pages/activity/activity?id=${this.data.id}`
    }
  },
  makeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.contact
    })
  },
  showMap: function (e) {
    const { id, location, address } = this.data
    wx.getStorage({
      key: `activity-${id}`,
      success: function (res) {
        // console.log(res.data)
        const { lat, lng } = JSON.parse(res.data)
        wx.openLocation({
          latitude: lat,
          longitude: lng,
          name: location,
          address
        })
      },
      fail: function (err) {
        console.log(err)
        qqmapsdk.geocoder({
          address,
          success: function (res) {
            const { lat, lng } = res.result.location
            wx.setStorage({
              key: `activity-${id}`,
              data: JSON.stringify({
                lat,
                lng,
              })
            })
            wx.openLocation({
              latitude: lat,
              longitude: lng,
              name: location,
              address
            })
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  apply: function (e) {
    // console.log('apply now', e.detail)
    // 立即报名，取消报名，已结束
    // 点击报名时检查信息是否绑定
    const that = this
    wx.showLoading({
      title: '正在处理...',
      mask: true
    })
    const cb = !this.data.status
      ? (info) => {
        wx.request({
          url: 'https://qy.mtouyan.cn/activity/API/applyActivity.php',
          data: {
            id: that.data.id,
            userId: info.userId,
            formId: e.detail.formId,
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            if (!res.data.statusCode) {
              that.setData({
                status: 1,
                btnStatusDesc: activitySubmitStatus[1],
              })
              wx.showToast({
                title: '报名成功',
                icon: 'success',
                duration: 2000,
                mask: true,
              })
            }
          },
          fail: function (err) {
            console.log(err)
            wx.showToast({
              title: '报名失败',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          }
        })
      }
      : (info) => {
        wx.request({
          url: 'https://qy.mtouyan.cn/activity/API/cancelActivity.php',
          data: {
            id: that.data.id,
            userId: info.userId,
          },
          method: 'POST',
          success: function (res) {
            if (!res.data.statusCode) {
              that.setData({
                status: 0,
                btnStatusDesc: activitySubmitStatus[0],
              })
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000,
                mask: true,
              })
            }
          },
          fail: function (err) {
            console.log(err)
            wx.showToast({
              title: '取消失败',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          }
        })
      }

    getBindInfoPromise().then(info => {
      console.log('activity is', info)
      cb(info)
    }).catch(({code, msg}) => {
      if (code === -1) {
        wx.navigateTo({
          url: '../bindinfo/bindinfo?update=true',
        })
      } else {
        console.log(msg)
      }
    })
  }
})