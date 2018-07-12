// pages/checkin/checkin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    desc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: '活动签到',
    // })
    // console.log(options)
    const { name, comp } = app.globalData.bindInfo
    if (options.res == 'true') {
      this.setData({
        type: 'success',
        desc: '签到成功',
        subdesc: `${name} ${comp}`
      })
    } else {
      this.setData({
        type: 'warn',
        desc: '签到失败',
        subdesc: '请尝试重新签到或咨询工作人员'
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
  backToHome: function (e) {
    wx.navigateBack()
  },
})