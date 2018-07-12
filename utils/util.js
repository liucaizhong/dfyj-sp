const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDateStr = (date, s) => {
  const year = date.substr(0, 4)
  const month = date.substr(4, 2)
  const day = date.substr(6, 2)

  return [year, month, day].join(s)
}

const getBindInfoPromise = () => new Promise((resolve, reject) => {
  const { bindInfo } = getApp().globalData
  if (bindInfo) {
    resolve(bindInfo)
  } else {
    wx.getStorage({
      key: 'bindInfo',
      success: function(res) {
        const bindInfo = JSON.parse(res.data)
        if (bindInfo) {
          resolve(bindInfo)
        } else {
          reject({
            code: -1, // no data
          })
        }
      },
      fail: function(err) {
        reject({
          code: -1,
          err,
        })
      },
    })
  }
})

module.exports = {
  formatDateStr: formatDateStr,
  formatTime: formatTime,
  getBindInfoPromise: getBindInfoPromise,
}
