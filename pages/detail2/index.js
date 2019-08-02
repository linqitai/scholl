let App = getApp();

var QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'

var qrcode;

// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(500)

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
    Type:"",
    Id:"",
    CreateTime: "",
    Name: "",
    Sex: "",
    Phone: "",
    IdentityNumber: "",
    Reason: "",
    Number: "",
    PlateNumber: "",
    Unit: "",
    DateTime: "",
    Remark: "",
    InvitorName: "",
    InvitorDep: "",
    CheckStatus: "",
    Checker: "",
    CheckDate: "",
    EnterCode: "",
    RefuseReason: "",
    form:{
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
      Remark:""
    },
    qrcodeWidth: qrcodeWidth,
    show: false,
    inputAlign: 'center'
  },
  searchInfo() {
    let _this = this;
    console.log("searchInfo")
    let enterCode = this.data.EnterCode;
    let url = "api/visitors/getInfoByEnterCode";
    let prams = {
      EnterCode: _this.data.EnterCode
    }
    App._post_form(url, prams, function (res) {
      console.log("res", res)
      let result = JSON.parse(res)
      if (result.code == 1) {
        _this.setData(result.data[0])
        console.log("_this.data",_this.data)
        _this.setData({
          Sex: App.globalData.sex_array[result.data[0].Sex],
          Reason: App.globalData.reason_array[result.data[0].Reason],
          Number: App.globalData.number_array[result.data[0].Number],
          Remark: App.isNullReturnLine(result.data[0].Remark),
          SMPhone: App.isNullReturnLine(result.data[0].SMPhone)
        })
      }
    });
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // App._get("api/visitors/testLink",{},function(res){
    //   console.log('res',res)
    // })
    //this.searchInfo();
  },
  onLoad: function (options) {
    let _this = this;
    this.setData({
      EnterCode: options.EnterCode
    })
    _this.searchInfo();
    qrcode = new QRCode('canvas', {
      usingIn: this,
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      image: '/images/logo.png',
      width: qrcodeWidth,
      height: qrcodeWidth,
      // width: 150,
      // height: 150,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(_this.data.EnterCode)
  },
  
  handleClose() {
    this.setData({ show: false });
  },
  refuseSubmit(e) {
    let _this = this;
    App.globalData.formId = e.detail.formId;
    _this.setData({show:true})
  },
  // 长按保存
  save: function () {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path
            })
          })
        }
      }
    })
  },
  nullToLine: function (value) {
    if (value == "" || value == null) {
      return "--";
    }
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
    console.log('number', e.detail.value)
    console.log('detail', e.detail)
    console.log('e', e)
    this.setData({
      'form.number': e.detail.value
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