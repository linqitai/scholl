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
    maxlengthIdentityNumber:18,
    Id:"",
    SName:"",
    SInitialPassword:"",
    NewPassword:"",
    SurePassword:"",
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
    console.log('App.globalData.userInfo',App.globalData.userInfo)
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      Id:App.globalData.userInfo.Id,
      SName: App.globalData.userInfo.SName
    })
    console.log('Id',_this.data.Id)
    console.log('SName', _this.data.SName)
  },
  formSubmit(e) {
    let _this = this;
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value
    });
    let Id = _this.data.Id;
    let SMPhone = App.globalData.userInfo.SMPhone;
    let SInitialPassword = e.detail.value.SInitialPassword;
    let NewPassword = e.detail.value.NewPassword;
    let SurePassword = e.detail.value.SurePassword;

    console.log('form', _this.data.form)
    if (App.isNull(SInitialPassword)) {
      App.showToast("旧密码不可为空"); return;
    }
    if (App.isNull(NewPassword)) {
      App.showToast("新密码不可为空"); return;
    }
    if (NewPassword != SurePassword){
      App.showToast("新密码和确认密码不一致"); return;
    }
    let prams = {
      Id:Id,
      SMPhone: SMPhone,
      SInitialPassword: SInitialPassword,
      NewPassword: NewPassword
    }
    console.log('prams',prams)
    App.showModel("您确定要修改密码吗？", function (e) {
      console.log('e',e);
      // 下面调用接口
      App._post_form("api/visitors/updatePassword", prams , function (res) {
        console.log("res", res)
        let result = JSON.parse(res)
        if (result.code == 1) {
          App.showToast("操作成功");
          setTimeout(function(){
            wx.navigateTo({
              url: "../user/index"
            });
          },1000)
        } else {
          console.log("msg", result.msg)
          App.showToast(result.msg);
        }
      })
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