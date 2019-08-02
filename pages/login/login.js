let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Phone: "",
    maxlengthPhone:11
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getPhoneInput(e){
    console.log("e",e.detail)
    let _this = this;
    _this.setData({
      Phone: e.detail
    })
  },
  /**
   * 授权登录
   */
  authorLogin: function (e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    console.log('_this.data.Phone', _this.data.Phone)
    if (!(/^1[34578]\d{9}$/.test(_this.data.Phone))) {
      wx.showToast({
        title: '请先填写正确的手机号',
        duration: 2000,
        icon: 'none'
      });
      return;
    }
    // if (App.isNull(_this.data.Phone)){
    //   App.showToast("请先填写正确的手机号")
    //   return;
    // }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        console.log('res', res)
        let prams = {
          code: res.code,
          user_info: e.detail.rawData,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          signature: e.detail.signature
        }
        console.log('prams',prams)
        wx.hideLoading();
        let p = JSON.parse(prams.user_info);
        p.OpenId = App.globalData.openid;
        p.Phone = _this.data.Phone;
        console.log('p',p)
        App._post_form('api/visitors/addWXUserInfo', p, function (res) {
          console.log('res',res)
          let result = JSON.parse(res)
          if(result.code==1){
            _this.navigateBack();
          }else{
            console.log('msg', result.msg)
            App.showToast(result.msg)
          }
        });
      }
    });
  },
  /**
     * 获取当前用户信息
     */
  // getUserDetail: function () {
  //   let _this = this;
  //   App._get('user.index/detail', {}, function (result) {
  //     App.globalData.userInfo = result.data.userInfo
  //     App.globalData.orderCount = result.data.orderCount
  //     console.log(App.globalData.userInfo, "App.globalData.userInfo")
  //     if (App.globalData.userInfo.store_cert == 1) {
  //       App.globalData.tab_bar[2].is_show = true
  //     }
  //   });
  // },
  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})