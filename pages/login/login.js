let App = getApp();
let form_ids = [];
let count = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Role:"家长",
    Phone: "",
    maxlengthPhone:11,
    Role_array:[],
    Role_index: 0,
    flag:"务必填写与孩子身份绑定的家长手机号"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      Role_array: App.globalData.Role_array
    })
  },
  collectFormIds(formId) {
    form_ids=[];
    form_ids.push(formId);
  },
  saveFormId(e){
    let _this = this;
    let formId = e.detail.formId;
    _this.collectFormIds(formId);
    console.log('form_id', e.detail.formId)
    if (form_ids[0] != 'the formId is a mock one') {
      App.globalData.formIds = form_ids;
      let prams = {
        Form_ids: App.globalData.formIds,
        SubDate: _this.data.SubDate,
        OpenId: App.globalData.openid
      }
      console.log('prams', prams)
      App._post_form('api/XXYXT/saveForm_id', prams, function (res) {
        console.log("intod getForm_id")
        //let result = JSON.parse(res);
        console.log('getForm_result', res)
      })
    }
  },
  bindRolePickerChange(e){
    let _this = this;
    let index = e.detail.value;
    console.log('Role_index', index)
    this.setData({
      'Role_index': index,
      'Role': _this.data.Role_array[index]
    });
    console.log('Role', _this.data.Role)
    if (index == 1){
      _this.setData({
        flag:"务必填写已经在后台登记的教师手机号"
      })
    } 
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
        p.Role = _this.data.Role;
        console.log('p',p)
        App._post_form('api/XXYXT/addWXUserInfo', p, function (res) {
          console.log('res',res)
          let result = JSON.parse(res)
          if(result.code==1){
            wx.redirectTo({
              url: "../user/index",
            })
          }else{
            console.log('msg', result.msg)
            App.showModel(result.msg)
          }
        });
      }
    });
  },
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