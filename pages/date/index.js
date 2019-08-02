let App = getApp();

Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针
    test:'/pages/category/index?category_id=29',
    // 页面元素
    scrollTop: 0,
    top: '',
    left: '',
    windowWidth: '',
    windowHeight: '',
    maxlengthPhome: 11,
    maxlengthIdentityNumber: 18,
    SNo: "", //员工编号
    form:{
      SName:"",
      Name: "",
      Sex: 0,
      Phone: "",
      IdentityNumber:"",
      Reason:0,
      Number:0,
      PlateNumber:"",
      Unit:"",
      Date:"",
      StartTime:"",
      EndTime: "",
      Remark:"",
      SMPhone:"",
      SDDetailName:""
    },
    show:false,
    radio:'',
    title:"请选择被访人",
    visitorList:[],
    sex_array: App.globalData.sex_array,
    reason_array: App.globalData.reason_array,
    number_array: App.globalData.number_array
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // App._get("api/visitors/testLink",{},function(res){
    //   console.log('res',res)
    // })
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
  onLoad: function (options) {
    let _this = this;
    console.log(App.globalData.tab_bar_type, "App.globalData.tab_bar_type")
    _this.setData({
      active: 0,
      tab_bar: App.getTab_bar(App.globalData.tab_bar_type)
    })
    console.log('tab_bar', _this.data.tab_bar)
    this.setData({ 'form.Date': App.getDate(new Date().getTime() + 24 * 60 * 60 * 1000) })
    this.setData({ 'form.StartTime': '08:00' })
    this.setData({ 'form.EndTime': "17:00" })
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(e){
    let _this = this;
    console.log("e.detail", e.detail)
    let index = e.detail;
    let SNo = _this.data.visitorList[index].SNo;
    let SMPhone = _this.data.visitorList[index].SMPhone;
    let SDDetailName = _this.data.visitorList[index].SDDetailName;
    App.globalData.OpenId4In = _this.data.visitorList[index].OpenId4In;
    console.log('SNo', SNo)
    console.log('SMPhone', SMPhone)
    console.log('SDDetailName', SDDetailName)
    _this.setData({ 
      show: false,
      'SNo': SNo,
      'form.SMPhone': SMPhone,
      'form.SDDetailName': SDDetailName
    })
    console.log("form",_this.data.form)
  },
  getStaffInfoByPhone(e){
    let _this = this;
    console.log('e', e.detail.value)
    let prams = {
      SMPhone: e.detail.value
    }
    if (prams.SMPhone == "" || prams.SMPhone == null) {
      App.showToast("被访人手机号不得为空");
      return;
    }
    App._get("api/visitors/getStaffInfoByPhone", prams, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        console.log("data", result.data)
        _this.setData({
          visitorList: result.data
        })
        if (result.count > 1) {
          _this.setData({ show: true, title: "请确认被访人" })
        } else if (result.count == 1) {
          let index = 0;
          let SNo = _this.data.visitorList[index].SNo;
          let SName = _this.data.visitorList[index].SName;
          let SMPhone = _this.data.visitorList[index].SMPhone;
          let SDDetailName = _this.data.visitorList[index].SDDetailName;
          App.globalData.OpenId4In = _this.data.visitorList[index].OpenId4In;
          console.log('SNo', SNo)
          console.log('SMPhone', SMPhone)
          console.log('SDDetailName', SDDetailName)
          console.log('App.globalData.OpenId4In', App.globalData.OpenId4In)
          _this.setData({
            'SNo': SNo,
            'form.SName': SName,
            'form.SMPhone': SMPhone,
            'form.SDDetailName': SDDetailName
          })
        } else {
          App.showToast("未查到此人，确认后请直接电话联系");
        }
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  getStaffInfoByName(e){
    let _this = this;
    console.log('e', e.detail.value)
    let prams = {
      SName: e.detail.value
    }
    // if (prams.SName==""||prams.SName==null){
    //   App.showToast("被访人姓名不得为空");
    //   return;
    // }
    App._get("api/visitors/getStaffInfoByName", prams, function (res) {
      let result = JSON.parse(res)
      console.log("getStaffInfoByName result", result)
      if (result.code == 1) {
        console.log("data", result.data)
        _this.setData({
          visitorList: result.data
        })
        if(result.count>1){
          _this.setData({ show: true })
        }else if(result.count==1){
          let index = 0;
          let SNo = _this.data.visitorList[index].SNo;
          let SMPhone = _this.data.visitorList[index].SMPhone;
          let SDDetailName = _this.data.visitorList[index].SDDetailName;
          App.globalData.OpenId4In = _this.data.visitorList[index].OpenId4In;
          console.log('SNo', SNo)
          console.log('SDDetailName', SDDetailName)
          _this.setData({
            title: "请确认被访人",
            show: false,
            'SNo': SNo,
            'form.SMPhone': SMPhone,
            'form.SDDetailName': SDDetailName
          })
        }else{
          App.showToast("未查到此人，确认后请直接电话联系");
        }
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  formSubmit(e) {
    let _this = this;
    console.log('e', e)
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value,
      'form.SNo': _this.data.SNo,
      'form.OpenId4Out': wx.getStorageSync('openid'),
      'form.OpenId4In': App.globalData.OpenId4In
    });
    console.log('getOpenId', wx.getStorageSync('openid'))
    console.log('form', _this.data.form)
    if (App.isNull(_this.data.form.SName)) {
      App.showToast("被访人姓名不可为空"); return;
    }
    if (App.isNull(_this.data.form.Name)) {
      App.showToast("访客姓名不可为空"); return;
    }
    if (App.isNull(_this.data.form.Phone)) {
      App.showToast("手机号不可为空"); return;
    }
    if (App.isNull(_this.data.form.IdentityNumber)) {
      App.showToast("证件号不可为空"); return;
    }
    App.showModel("提交后不得修改，您确定要提交此访客单吗？", function () {
      console.log("确定");
      // 下面调用接口
      App._post_form("api/visitors/add4Out", _this.data.form, function (res) {
        console.log("res", res)
        let result = JSON.parse(res)
        if (result.code == 1) {
          App.showToast("数据提交成功");
          setTimeout(function () {
            wx.navigateTo({
              url: '../history/index',
            })
          }, 1000)
        } else {
          console.log("msg", result.msg)
          App.showToast(result.msg);
        }
      })
      if (App.globalData.OpenId4In != "") {
        App.globalData.formId = e.detail.formId;
        let _access_token = App.globalData.access_token;
        let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
        let _jsonData = {
          access_token: _access_token,
          touser: App.globalData.OpenId4In,
          template_id: 'KDwFmfR9VfOHl2ARYLEEsuc32WMm2vcAPwAveCXiWQY',//来访申请提醒模板
          form_id: e.detail.formId,
          page: "pages/firstPage/firstPage",
          data: {
            "keyword1": { "value": _this.data.form.Name, "color": "#173177" },
            "keyword2": { "value": _this.data.form.Phone, "color": "#173177" },
            "keyword3": { "value": _this.data.form.Date + " " + _this.data.form.StartTime, "color": "#173177" },
            "keyword4": { "value": _this.data.reason_array[_this.data.form.Reason] + " "+ _this.data.form.Remark, "color": "#173177" }
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
      } else {
        App.showError("被访人未用过此访客小程序，请电话联系对方登录此系统并审核确认");
      }
    })
  },
  bindStartTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.StartTime': e.detail.value
    });
  },
  bindEndTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.EndTime': e.detail.value
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.Date':e.detail.value
    });
  },
  bindSexPickerChange(e){
    console.log('sex', e.detail.value)
    this.setData({
      'form.Sex': e.detail.value
    });
  },
  bindReasonPickerChange(e) {
    console.log('reason', e.detail.value)
    this.setData({
      'form.Reason': e.detail.value
    });
  },
  bindNumberPickerChange(e){
    console.log('Number', e.detail.value)
    console.log('detail', e.detail)
    console.log('e', e)
    this.setData({
      'form.Number': e.detail.value
    });
  },
  to_shopcart_view(){
    wx.navigateTo({
      url: "../flow/index"
    });
  },
  // 拖动不超过规定范围
  setTouchMove: function (e) {
    e.preventDefault();
    console.log("---------------- e.touches[0].clientX----------------8==" + e.touches[0].clientX)
    console.log("---------------- e.touches[0].clientX----------------8=======" + e.touches[0].clientY)
    if (e.touches[0].clientX < 650 && e.touches[0].clientY < 1110 && e.touches[0].clientX > 0 && e.touches[0].clientY > 0) {
      this.setData({
        left: e.touches[0].clientX,
        top: e.touches[0].clientY
      })
    }else{
      this.setData({
        left: 650,
        top: 1110
      })
    }
  },
  //触摸开始
  handletouchstart: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function (event) {
    // console.log("触摸结束")
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function (event) {
    // console.log("触摸取消")
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function (event) {
    // console.log("页面滚动", event)
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    setTimeout(() => { this.refreshView.stopPullRefresh() }, 2000)
    // 获取首页数据
    // this.getIndexData();
    // this.getCateData();
    // this.getGoodsData();
    // this.getBestGoodsData();
  },
  _pullState: function(e) {
    console.log(e,"_pullState")
  },
  scroll: function(t) {
    this.setData({
      indexSearch: t.detail.scrollTop
    }), t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });
  }
});