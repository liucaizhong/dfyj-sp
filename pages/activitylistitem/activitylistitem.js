// pages/activitylistitem/activitylistitem.js
const app = getApp()
const formatDateStr = require('../../utils/util.js').formatDateStr

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusDesc: app.globalData.activityStatus,
    oneDay: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToDetail: function (e) {
      // console.log('navigate to detail', this)
      wx.navigateTo({
        url: `../activity/activity?id=${this.data.item.id}`,
      })
    },
    showQRCode: function (e) {
      console.log('show qrcode')
    },
  }, 
  attached: function () {
    const { start, end } = this.data.item
    // const newStart = formatDateStr(start, '-')
    // const newEnd = formatDateStr(end, '-')
    this.setData({
      item: Object.assign({}, this.data.item, {
        start,
        end,
      }),
      oneDay: start === end
    })
  }
})
