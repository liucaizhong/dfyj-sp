// pages/search/search.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // store in wxstorage
    searchHistory: [],
    searchResult: [],
    showSearchHistory: true,
    searchVal: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel: function(e) {
      this.triggerEvent('cancel')
    },
    clear: function(e) {
      this.setData({
        searchHistory: []
      })
    },
    confirm: function (e) {
      // console.log(e)
      if (e.detail.value) {
        const val = e.detail.value
        const searchResult = this.filterActivity(val)
        const searchHistory = this.data.searchHistory
        if (searchHistory.length < 6) {
          searchHistory.push({
            content: val,
          })
        } else {
          searchHistory.shift()
          searchHistory.push({
            content: val,
          })
        }
        this.setData({
          searchResult,
          searchHistory,
        })

        wx.setStorage({
          key: 'searchHistory',
          data: JSON.stringify(searchHistory),
        })
      } else {
        this.setData({
          searchResult: [],
        })
      }
    },
    change: function (e) {
      const that = this

      that.setData({
        searchVal: e.detail.value,
        showSearchHistory: !e.detail.value.length,
        searchResult: that.filterActivity(e.detail.value)
      })
    },
    tapSearchHistoryItem: function (e) {
      const that = this
      const searchVal = e.currentTarget.dataset.item

      that.setData({
        searchVal,
        showSearchHistory: false,
        searchResult: that.filterActivity(searchVal),
      })
    },
    filterActivity: function (val) {
      const allActivity = app.globalData.activities

      return val && allActivity.filter(obj => {
        return obj.name.includes(val)
          || obj.address.includes(val)
          || obj.start.includes(val)
          || obj.end.includes(val)
      })
    },
    navToActivity: function (e) {
      const id = e.target.dataset.id
      wx.navigateTo({
        url: `../activity/activity?id=${id}`,
      })
    },
  },
  attached: function () {
    const that = this
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          searchHistory: JSON.parse(res.data),
        })
      }
    })
  }
})
