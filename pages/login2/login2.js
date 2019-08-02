let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      SMPhone:"",
      SInitialPassword:"",
      OpenId:""
    },
    username:'13958776325',
    password:'888888'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // App._get('api/personInfo/testLink', {},
    //   function (res) {//成功
    //     console.log(res, "res")
    //   }
    // )
  },
  formSubmit(e){
    let _this = this;
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value
    });
    console.log('App.globalData.openid', App.globalData.openid)
    _this.setData({
      'form.OpenId4In': App.globalData.openid
    })
    console.log('form', _this.data.form)
    if (App.isNull(_this.data.form.SMPhone)) {
      App.showToast("用户名不可为空"); return;
    }
    if (App.isNull(_this.data.form.SInitialPassword)) {
      App.showToast("密码不可为空"); return;
    }
    App._get("api/visitors/login", _this.data.form, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        App.showToast("登录成功");
        App.globalData.userInfo=result.data[0];
        setTimeout(function(){
          if (App.globalData.tab_bar_type=='in'){
            wx.navigateTo({
              url: '../index/index',
            })
          } else if (App.globalData.tab_bar_type == 'check'){
            wx.navigateTo({
              url: '../check/index',
            })
          }
        },1000)
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})