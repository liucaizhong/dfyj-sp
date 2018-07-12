// pages/bindinfo/bindinfo.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    update: false,
    firstUpdate: false,
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: '',
    comp: '',
    title: '',
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const update = options.update
    if (update) {
      wx.setNavigationBarTitle({
        title: '报名必须绑定个人信息',
      })
      this.setData({
        update,
        firstUpdate: true
      })
    }

    if (app.globalData.loginParams) {
      const { openid, sessionKey } = app.globalData.loginParams
      this.setData({
        openid,
        sessionKey,
      })
    } else {
      app.loginParamsReadyCallback = res => {
        // console.log(res)
        const { openid, sessionKey } = res
        this.setData({
          openid,
          sessionKey,
        })
      }
    }

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

    if (app.globalData.bindInfo) {
      const { name, comp, title, phone } = app.globalData.bindInfo
      // console.log(app.globalData.bindInfo)
      this.setData({
        name: name || '',
        comp: comp || '',
        title: title || '',
        phone: phone || '',
      })
    }
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
  
  },
  updateInfo: function () {
    this.setData({
      update: true
    })
  },
  submitInfo: function (e) {
    const that = this
    wx.showModal({
      title: '提交',
      content: '确认提交新的个人信息？',
      success: function (res) {
        if (res.confirm) {
          // console.log('submit info', e)
          wx.showLoading({
            title: '保存中...',
            mask: true
          })
          // 检测是否有空
          const { name, comp, title, phone } = e.detail.value
          if (!name || !comp || !title || !phone) {
            wx.showToast({
              title: '请完善信息',
              icon: 'none',
              duration: 2000,
              mask: true
            })
            return false
          }
          // const regPhone = /^(13|15|17|18)[0-9]{9}$/
          // if (!regPhone.test(phone)) {
          //   wx.showToast({
          //     title: '手机号格式错误',
          //     icon: 'none',
          //     duration: 2000,
          //     mask: true
          //   })
          //   return false
          // }

          // if (!this.data.hasUserInfo) {
          //   wx.showToast({
          //     title: '请授权用户信息',
          //     icon: 'none',
          //     duration: 2000,
          //     mask: true
          //   })
          //   return false
          // }

          // 返回userId放进缓存
          // 提交修改，set status=1待审核
          // console.log(that.data)
          wx.request({
            url: 'https://qy.mtouyan.cn/activity/API/registUser.php',
            data: {
              openid: that.data.openid,
              info: e.detail.value,
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              const { code, userId, status } = res.data
              if (!code) {
                const bindInfo = Object.assign({
                  userId,
                  status: +status,
                }, e.detail.value)
                wx.setStorage({
                  key: 'bindInfo',
                  data: JSON.stringify(bindInfo),
                  success: function () {
                    app.globalData.bindInfo = bindInfo
                    if (that.data.firstUpdate) {
                      // wx.navigateBack()
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    } else {
                      wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true
                      })
                      that.setData({
                        update: false
                      })
                    }
                  }
                })
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  resetInfo: function () {
    const that = this
    wx.showModal({
      title: '取消',
      content: '确认取消此次更改？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.firstUpdate) {
            wx.navigateBack()
          } else {
            that.setData({
              update: false
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // getUserInfo: function (e) {
  //   if (e.detail.userInfo) {
  //     app.globalData.userInfo = e.detail.userInfo
  //     this.setData({
  //       hasUserInfo: true
  //     })
  //   }
  // },
  getPhoneNumber: function (e) {
    // console.log('phone', e)
    const { encryptedData, iv } = e.detail
    const that = this
    const { sessionKey } = this.data
    
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: 'https://qy.mtouyan.cn/activity/API/getPhoneNumber.php',
          data: {
            sessionKey,
            encryptedData,
            iv,
          },
          method: 'POST',
          success: function (res) {
            const { phoneNumber } = JSON.parse(res.data)
            that.setData({
              phone: phoneNumber,
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
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
              success: function (d) {
                console.log(d.data)
                app.globalData.loginParams = {
                  ...d.data,
                }

                wx.request({
                  url: 'https://qy.mtouyan.cn/activity/API/getPhoneNumber.php',
                  data: {
                    sessionKey,
                    encryptedData,
                    iv,
                  },
                  method: 'POST',
                  success: function (res) {
                    const { phoneNumber } = JSON.parse(res.data)
                    that.setData({
                      phone: phoneNumber,
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})