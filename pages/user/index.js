let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderCount: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(App.globalData.tab_bar_type,"App.globalData.tab_bar_type")
    console.log('userInfo', App.globalData.userInfo)
    this.setData({
      active: 2, 
      tab_bar: App.getTab_bar(App.globalData.tab_bar_type),
      userInfo: App.globalData.userInfo
    })
    console.log('userInfo', this.data.userInfo)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    //_this.getUserDetail();
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail: function () {
    let _this = this;
    App._get('user.index/detail', {}, function (result) {
      _this.setData(result.data);
      App.globalData.userInfo = result.data.userInfo
      App.globalData.orderCount = result.data.orderCount
      if (App.globalData.userInfo.store_cert == 1) {
        App.globalData.tab_bar[2].is_show = true
      }
    });
  },
  logout(){
    App.globalData.userInfo = {}
    wx.navigateTo({
      url: '../firstPage/firstPage',
    })
  },
  updatePassword(){
    console.log("到修改密码页面")
    wx.navigateTo({
      url: '../updatePassword/index',
    })
  }
})