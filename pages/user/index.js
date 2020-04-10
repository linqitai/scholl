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
    Role:"",
    flag: "务必填写与孩子身份绑定的家长手机号",
    studentName:"",
    isReciewInfo:false,
    isReciewInfoValue: '0',
    reciewCount:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let subDate = App.getDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 6)
    _this.setData({
      SubDate: subDate,
      Role_array: App.globalData.Role_array,
      studentName:options.studentName||""
    })
    _this.get_access_token();
    _this.login();
    if (!App.globalData.openid){
      _this.deletePastTimeForm_id();
    }
  },
  checkboxChange: function (e) {
    let _this = this
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    let result = e.detail.value
    if(result&&result[0]==1){
      _this.setData({
        isReciewInfoValue: '1'
      })
    }else{
      _this.setData({
        isReciewInfoValue: '0'
      })
    }
    console.log('isReciewInfoValue', _this.data.isReciewInfoValue)
    //这里请求接口
    let prams = {
      SActualNo: App.globalData.userInfo.SActualNo,
      IsRecived: _this.data.isReciewInfoValue||'0'
    }
    console.log("prams", prams)
    App._post_form('api/XXYXT/isRecieveInfo', prams, function (res) {
      console.log("res", res)
      let result = JSON.parse(res);
      if (result.code == 1) {
        App.showToast(result.msg)
      } else if (result.code == 0){
        App.showToast(result.msg)
      }
    })
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
      let prams = {
        appid: App.globalData.appid,
        secret: App.globalData.secret
      }
      App._post_form('api/XXYXT/getAccess_token', prams, function (res) {
        // let result = JSON.parse(res);
        console.log('res', res)
        App.globalData.access_token = res;
      })
      // let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + d.appid + "&secret=" + d.secret;
      // wx.request({
      //   url: url,
      //   data: {},
      //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      //   // header: {}, // 设置请求的 header  
      //   success: function (res) {
      //     console.log('res', res)
      //     App.globalData.access_token = res.data.access_token;
      //   }
      // });
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
        //这里应当先判断当前手机号的身份是否存在
        //......
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
  getForm_idCount(){
    let _this = this;
    let prams2 = {
      OpenId: App.globalData.openid
    }
    App._post_form('api/XXYXT/getForm_idByOpenId', prams2, function (res) {
      let result = JSON.parse(res);
      console.log('form_id_list', result)
      if (result.code == 1) {
        _this.setData({
          reciewCount: result.count
        })
      }
    })
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
          App._post_form('api/XXYXT/getOpenId', d, function (res) {
            // let result = JSON.parse(res);
            console.log('res', res)
            _this.setData({
              showPop: App.globalData.openid ? false : true
            })
            App.globalData.openid = res;
            wx.setStorageSync('openid', res)
            console.log('App.globalData.openid', App.globalData.openid)
            _this.getForm_idCount();
            let prams = {
              OpenId: App.globalData.openid,
              Role: _this.data.Role || ""
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
                  Role: result.msg,
                  userInfo: result.data?result.data[0]:{},
                  list: result.data,
                  active: 1,
                  tab_bar: App.getTab_bar(result.msg),
                })
                if (result.data[0]){
                  _this.setData({
                    isReciewInfo: result.data[0].IsRecived == 0 ? false : true,
                    isReciewInfoValue: result.data[0].IsRecived == 0 ? '0' : '1'
                  })
                }else{
                  _this.setData({
                    isReciewInfo: false,
                    isReciewInfoValue: '0'
                  })
                }
                // App.globalData.childList = result.data;
                App.globalData.userInfo = result.data[0];
                console.log('App.globalData.userInfo', App.globalData.userInfo)
                let phone = _this.data.userInfo?_this.data.userInfo.SurrogateMPhone : '';
                if (App.globalData.tab_bar_type == "家长") {
                  _this.setData({
                    'form.name': _this.data.userInfo ? _this.data.userInfo.SurrogateName:'测试',
                    'form.relation': _this.data.userInfo ? _this.data.userInfo.Relation :'测试',
                    'form.sex': "",
                    'form.phone': phone,
                    'form.address': "",
                    isShow: true
                  })
                  //获取孩子列表 getMyChildBySurrogateMPhone
                  _this.getMyChildBySurrogateMPhone(phone)
                } else if (App.globalData.tab_bar_type == '教师') {
                  let name = "";
                  let phone = "";
                  if (result.tearch == 1) {
                    name = _this.data.userInfo.STeacher1;
                    phone = _this.data.userInfo.SMPhone1;
                  } else if (result.tearch == 2) {
                    name = _this.data.userInfo.STeacher2;
                    phone = _this.data.userInfo.SMPhone2;
                  }
                  _this.setData({
                    'form.name': name,
                    'form.sex': "",
                    'form.phone': phone,
                    'form.address': "",
                    'form.className': _this.data.userInfo.SDetailName,
                    isShow: true
                  })
                } else if (App.globalData.tab_bar_type == '管理员') {
                  console.log("_this.data.userInfo", _this.data.userInfo)
                  _this.setData({
                    'form.name': _this.data.userInfo.OName,
                    'form.sex': _this.data.userInfo.OSex,
                    'form.phone': _this.data.userInfo.OPhone,
                    'form.address': "",
                    'form.className': "",
                    isShow: true
                  })
                }
              }
            })
          })
          
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getMyChildBySurrogateMPhone(phone) {
    let _this = this;
    let url = "api/XXYXT/getMyChildBySurrogateMPhone";
    let prams = {
      SurrogateMPhone: phone
    }
    App._post_form(url, prams, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        App.globalData.childList = result.data;
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
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
      showSwitchPop: true,
      Role:"家长"
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
        _this.getForm_idCount();
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