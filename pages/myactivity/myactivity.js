// pages/myactivity/myactivity.js
const sliderWidth = 96
const { getBindInfoPromise } = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs: ['全部活动', '已报名', '审核中', '已结束'],
    tabs: ['已报名', '已结束'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    appliedAct: [],
    endAct: [],
  },

  // {
  //   address: "上海陆家嘴Latina餐厅（陆家嘴环路165号，国金中心旁）",
  //   end: "2018-04-17",
  //   id: "719",
  //   location: "上海陆家嘴Latina餐厅（陆家嘴环路165号，国金中心旁）",
  //   name: "【东方沙龙】小米生态链之创米",
  //   start: "2018-04-17",
  //   status: 1
  // }, {
  //   address: "上海陆家嘴Latina餐厅（陆家嘴环路165号，国金中心旁）",
  //   end: "2018-04-17",
  //   id: "720",
  //   location: "上海陆家嘴Latina餐厅（陆家嘴环路165号，国金中心旁）",
  //   name: "【东方沙龙】小米生态链之创米",
  //   start: "2018-04-17",
  //   status: 1
  // }

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
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
    const that = this
    wx.showLoading({
      title: '加载中...',
    })
    getBindInfoPromise().then(info => {
      wx.request({
        url: `https://qy.mtouyan.cn/activity/API/getMyActivities.php?userId=${info.userId}`,
        success: function (res) {
          // console.log(res)
          const data = res.data
          if (data && data.length) {
            that.setData({
              appliedAct: data.filter(act => {
                return +act.status === 1
              }),
              endAct: data.filter(act => {
                return +act.status === 2
              }),
            })
          }
          wx.hideLoading()
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  }
})