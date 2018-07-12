//app.js
App({
  onLaunch: function () {
    const that = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        wx.request({
          url: 'https://qy.mtouyan.cn/activity/API/login.php',
          data: {
            code: res.code,
          },
          method: 'POST',
          success: function(d) {
            // console.log(d.data)
            that.globalData.loginParams = {
              ...d.data,
            }
            if (that.loginParamsReadyCallback) {
              that.loginParamsReadyCallback(d.data)
            }
          }
        })
      }
    })
    // wx.openSetting()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            },
            fail: () => {
              console.log('authorize fail')
            }
          })
        }
      }
    })
    // get personal info
    // 根据userId获取最新的个人信息
    wx.getStorage({
      key: 'bindInfo',
      success: (res) => {
        const userId = JSON.parse(res.data).userId
        wx.request({
          url: `https://qy.mtouyan.cn/activity/API/getUser.php?userId=${userId}`,
          success: (rsp) => {
            const { data } = rsp
            // console.log(data)
            if (data) {
              this.globalData.bindInfo = Object.assign({
                userId,
              }, data)
              if (this.bindInfoReadyCallback) {
                this.bindInfoReadyCallback(data)
              }
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })
  },
  globalData: {
    loginParams: null,
    userInfo: null,
    bindInfo: null,
     //0: 去参加 1：已报名 2：已结束 3：审核中
    activityStatus: ['去参加', '已报名', '已结束', '审核中'],
    activitySubmitStatus: ['立即报名', '取消报名', '已结束', '待审核'],
    personInfoStatus: ['未填写', '待审核', '已审核'],
    activities: [],
  }
})