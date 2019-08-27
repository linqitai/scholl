let App = getApp();

var QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'

var qrcode;

// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(500)

Page({
  data: {
    
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // App._get("api/visitors/testLink",{},function(res){
    //   console.log('res',res)
    // })
  },
  onLoad: function (options) {
    let _this = this;
    let SActualNo = options.SActualNo;
    console.log("SActualNo", SActualNo)
    
  },
  makePhoneCall:function(e){
    let _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.PUPPhone,
      success:function(res){
        console.log('res', res)
      }
    })
  }
});