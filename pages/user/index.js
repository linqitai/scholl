let App = getApp();
let form_ids = [];
let count = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    type_text:"",
    userInfo: {}, 
    showPop: false,
    form:{
      name:"",
      sex:"",
      phone:"",
      address:"",
      className:""
    },
    list: [],
    SubDate:"",
    Role_array: [],
    Role_index: 0,
    showSwitchPop:false,
    maxlengthPhone: 11,
    Phone:"",
    Role:"家长",
    flag: "务必填写与孩子身份绑定的家长手机号"
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.get_access_token();
    _this.login();
    
    let subDate = App.getDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 6)
    _this.setData({
      SubDate:subDate,
      Role_array: App.globalData.Role_array
    })
    _this.deletePastTimeForm_id();
  },
  getPhoneInput(e) {
    console.log("e", e.detail)
    let _this = this;
    _this.setData({
      Phone: e.detail
    })
  },
  bindRolePickerChange(e) {
    let _this = this;
    let index = e.detail.value;
    console.log('Role_index', index)
    this.setData({
      'Role_index': index,
      'Role': _this.data.Role_array[index]
    });
    console.log('====Role==========', _this.data.Role)
    if (index == 1) {
      _this.setData({
        flag: "务必填写已经在后台登记的教师手机号"
      })
    }else if(index==2){
      _this.setData({
        flag: "务必填写已经在后台登记的管理员手机号"
      })
    }
  },
  deletePastTimeForm_id() {
    let _this = this;
    let prams = {
      SubDate:_this.data.SubDate
    }
    console.log("into deletePastTimeForm_id")
    App._post_form('api/XXYXT/deletePastTimeForm_id', prams, function (res) {
      console.log("intod deletePastTimeForm_id")
      // let result = JSON.parse(res);
      console.log('deletePastTimeForm_id——Result', res)
    })
  },
  get_access_token(){
    let _this = this;

    if (App.globalData.access_token == "") {
      let d = {
        appid: App.globalData.appid,
        secret: App.globalData.secret,
        grant_type: "client_credential"
      }
      let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + d.appid + "&secret=" + d.secret;
      wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
        success: function (res) {
          console.log('res', res)
          App.globalData.access_token = res.data.access_token;
        }
      });
    }
  },

  authorLogin(e) {
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
    // let formId = e.detail.formId;
    // _this.collectFormIds(formId);
    // console.log('form_id', e.detail.formId)
    App.globalData.tab_bar_type = _this.data.Role;
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
        console.log('prams', prams)
        wx.hideLoading();
        let p = JSON.parse(prams.user_info);
        p.OpenId = App.globalData.openid;
        p.Phone = _this.data.Phone;
        p.Role = _this.data.Role;
        console.log('p', p)
        let prams2 = {
          OpenId: App.globalData.openid,
          Role: App.globalData.tab_bar_type
        }
        console.log("prams2", prams2)
        App._post_form('api/XXYXT/updateWXUserInfo', prams2, function (res) {
          console.log("intod updateWXUserInfo")
          let result = JSON.parse(res);
          console.log('updateWXUserInfo_result', result)
          if(result.code==1){
            _this.setData({
              showSwitchPop: false
            });
            wx.reLaunch({
              url: '../user/index'
            })
          }
        })
      }
    });
  },
  login(){
    let _this = this;
    wx.login({
      success: function (res) {
        console.log('res', res)
        if (res.code) {
          //发起网络请求
          // let code = res.code;
          //把code传给接口
          let d = {
            appid: App.globalData.appid,
            secret: App.globalData.secret,
            js_code: res.code,
            grant_type: "authorization_code"
          }
          let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            // header: {}, // 设置请求的 header  
            success: function (res) {
              console.log('res', res)
              App.globalData.openid = res.data.openid;
              wx.setStorageSync('openid', res.data.openid)
              console.log('App.globalData.openid', App.globalData.openid)
              let prams = {
                OpenId: App.globalData.openid,
                Role: App.globalData.tab_bar_type||""
              }
              console.log("====into haveUserInfo prams====", prams)
              App._post_form('api/XXYXT/haveUserInfo', prams, function (res) {
                let result = JSON.parse(res);
                console.log('haveUserInfo', result)
                if (result.code == 0) {
                  wx.navigateTo({
                    url: '../login/login',
                  })
                } else if (result.code == 1) {
                  console.log("data", result.data[0])
                  App.globalData.tab_bar_type = result.msg
                  _this.setData({
                    type: result.msg,
                    userInfo: result.data[0],
                    list: result.data,
                    active: 1,
                    tab_bar: App.getTab_bar(result.msg),
                    showPop: true
                  })
                  App.globalData.childList = result.data;
                  App.globalData.userInfo = _this.data.userInfo;
                  console.log('App.globalData.userInfo', App.globalData.userInfo)
                  if (App.globalData.tab_bar_type == "家长") {
                    _this.setData({
                      'form.name': _this.data.userInfo.PUPName,
                      'form.sex': _this.data.userInfo.PUPSex,
                      'form.phone': _this.data.userInfo.PUPPhone,
                      'form.address': _this.data.userInfo.SDetailName,
                      isShow: true
                    })
                    //_this.getForm_id();
                  } else if (App.globalData.tab_bar_type == '教师') {
                    _this.setData({
                      'form.name': _this.data.userInfo.SName,
                      'form.sex': _this.data.userInfo.SSex,
                      'form.phone': _this.data.userInfo.SMPhone,
                      'form.address': "",
                      'form.className': _this.data.userInfo.SDDetailName,
                      isShow: true
                    })
                  } else if (App.globalData.tab_bar_type == '管理员') {
                    console.log("_this.data.userInfo",_this.data.userInfo)
                    _this.setData({
                      'form.name': _this.data.userInfo.Name,
                      'form.sex': _this.data.userInfo.Sex,
                      'form.phone': _this.data.userInfo.Phone,
                      'form.address': "",
                      'form.className': "",
                      isShow: true
                    })
                  }
                }
              })
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getForm_id(){
    console.log("into getForm_id")
    App._post_form('api/XXYXT/getForm_id', null, function (res) {
      console.log("intod getForm_id")
      let result = JSON.parse(res);
      console.log('getForm_result', result)
    })
  },
  eventFix(){
    console.log("eventFix")
  },
  switch_account_btn() {
    console.log("switch_account");
    let _this = this;
    _this.setData({
      showSwitchPop: true
    });
  },
  close_switch_account(){
    let _this = this;
    _this.setData({ showSwitchPop: false });
  },
  closePop() {
    let _this = this;
    console.log("close")
    if (_this.data.showSwitchPop){
      _this.setData({ showSwitchPop: false });
    }else{
      _this.setData({ showPop: false });
    }
    
    if (form_ids[0] !='the formId is a mock one'){
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
  collectFormIds(formId){
    form_ids=[];
    form_ids.push(formId);
  },
  formSubmit(e){
    let _this = this;
    let formId = e.detail.formId;
    _this.collectFormIds(formId);
    console.log('form_id', e.detail.formId)
    _this.closePop();
  },
  saveFormId(e) {
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
  sendMassage(){
    let _this = this;
    App.globalData.formId = "4147b857df614598bf02461352e397fa";
    let _access_token = App.globalData.access_token;
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
    let _jsonData = {
      access_token: _access_token,
      touser: App.globalData.openid,
      template_id: 'prRoMpM93vYcp06nwoEgHcT3gcfIa9KElWKuT5hguiM',//来访申请提醒模板
      form_id: App.globalData.formId,
      page: "pages/attendance/childDetail",
      data: {
        "keyword1": { "value": "1", "color": "#173177" },
        "keyword2": { "value": "2", "color": "#173177" },
        "keyword3": { "value": "3", "color": "#173177" }
      }
    }
    console.log('_jsonData', _jsonData)
    wx.request({
      url: url,
      data: _jsonData,
      method: 'POST',
      success: function (res) {
        console.log('消息发送成功', res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!", res);
      }
    })
  },
  onClose() {
    this.setData({ showPop: false });
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