//index.js
//获取应用实例
const app = getApp()
const { getBindInfoPromise } = require('../../utils/util.js')
const unitLen = 10

Page({
  data: {
    showSearch: false,
    loadmore: true,
    activities: []
  },
  onLoad: function () {
    // getBindInfoPromise().then(info => {
    //   console.log(info)
    //   const that = this
    //   wx.request({
    //     url: `https://qy.mtouyan.cn/activity/API/getActivities.php?userId=${info.userId}`,
    //     success: function (res) {
    //       app.globalData.activities = [...res.data]
    //       that.setData({
    //         activities: res.data.slice(0, unitLen)
    //       })
    //     },
    //     fail: function (err) {
    //       console.log(err)
    //     }
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
  },
  onShow: function () {
    const that = this
    getBindInfoPromise().then(info => {
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivities.php?userId=${info.userId}`,
        success: function (res) {
          app.globalData.activities = [...res.data]

          that.setData({
            activities: res.data.slice(0, unitLen),
            loadmore: res.data.length >= unitLen,
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }).catch(err => {
      console.log(err)
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivities.php`,
        success: function (res) {
          app.globalData.activities = [...res.data]
          that.setData({
            activities: res.data.slice(0, unitLen),
            loadmore: res.data.length >= unitLen,
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })
  },
  onHide: function () {
    wx.hideLoading()
  },
  // scan qr code
  scanCode: function(e) {
    wx.showLoading({
      title: '正在签到...',
      mask: true
    })
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        console.log(res)
        const result = res.result
        let eventId = ''
        if (result) {
          let start = result.indexOf('id=')
          if (start !== -1) {
            let end = result.indexOf(start, '&')
            if (end == -1) {
              end = result.length
            }
            eventId = result.substring(start, end)
          }
        }
        if (eventId) {
          getBindInfoPromise().then(info => {
            wx.request({
              url: `https://qy.mtouyan.cn/activity/API/attendEvent.php`,
              data: {
                userId: info.userId,
                id: eventId.split('=')[1],
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                if (!res.data.statusCode) {
                  wx.navigateTo({
                    url: '../checkin/checkin?res=true',
                  })
                } else {
                  wx.navigateTo({
                    url: '../checkin/checkin?res=false',
                  })
                }
              },
              fail: function (err) {
                console.log(err)
                wx.navigateTo({
                  url: '../checkin/checkin?res=false',
                })
              }
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.navigateTo({
            url: '../checkin/checkin?res=false',
          })
        }
      }
    })
  },
  // focus searchbar
  focusSearch: function(e) {
    this.setData({
      showSearch: !this.showSearch
    }, wx.hideTabBar)
  },
  cancelSearch: function(e) {
    this.setData({
      showSearch: !this.data.showSearch
    }, wx.showTabBar)
  },
  addActivity: function(e) {
    console.log('add activity')
  },
  onPullDownRefresh: function() {
    const that = this
    getBindInfoPromise().then(info => {
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivities.php?userId=${info.userId}`,
        success: function (res) {
          // console.log(res)
          app.globalData.activities = [...res.data]

          that.setData({
            activities: res.data.slice(0, unitLen),
            loadmore: res.data.length >= unitLen,
          })
          wx.stopPullDownRefresh()
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }).catch(err => {
      console.log(err)
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getActivities.php`,
        success: function (res) {
          app.globalData.activities = [...res.data]
          that.setData({
            activities: res.data.slice(0, unitLen),
            loadmore: res.data.length >= unitLen,
          })
          wx.stopPullDownRefresh()
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })
  },
  onReachBottom: function() {
    const curLen = this.data.activities.length
    const totalLen = app.globalData.activities.length

    if (curLen !== totalLen && !this.data.showSearch) {
      const activities = this.data.activities.concat(app.globalData.activities.slice(curLen, curLen + unitLen))
      this.setData({
        loadmore: curLen + unitLen < totalLen,
        activities,
      })
    } else {
      this.setData({
        loadmore: false
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '东方研究活动平台',
      path: '/pages/index/index'
    }
  },
})
