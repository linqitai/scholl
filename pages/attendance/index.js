let App = getApp();
let dataList = [];
let dataListResult = [];
let accessList = [];
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
    maxlengthIndentityNumber:18,
    form:{
      StartDate:"",
      EndDate: "",
      OpenId4In:""
    },
    type: '',
    count:0,
    accessCount:0,
    dataList:[],
    accessList: [],
    sex_array: ['男', '女'],
    reason_array: ['个人来访', '公务往来', '会议', '快递', '面试','其他'],
    number_array: ['1', '2', '3', '4', '5', '6','多于6人'],
    ClassName: "",
    shidao:0,
    weidao:0
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // wx.setNavigationBarTitle({
    //   title: ''
    // })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: "#228B22" // 传递的颜色值
    // })
  },
  onLoad: function (options) {
    let _this = this;
    console.log(App.globalData.tab_bar_type, "App.globalData.tab_bar_type")
    console.log("App.globalData.userInfo", App.globalData.userInfo)
    this.setData({
      active: 0,
      tab_bar: App.getTab_bar(App.globalData.tab_bar_type),
      type: App.globalData.tab_bar_type,
      ClassName: App.globalData.userInfo.SDDetailName
    })
    console.log("history")
    console.log('type', _this.data.type)
    this.setData({ 'form.StartDate': App.getDate(new Date().getTime()) })
    this.setData({ 'form.EndDate': App.getDate(new Date().getTime()) })

    if (App.globalData.tab_bar_type=="教师"){
      _this.getStudentListByClassName()
    }else{
      _this.getChildListByDateAndSActualNo()
    }
    
  },
  bindStartDateChange: function (e) {
    let _this = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.StartDate': e.detail.value
    });
    _this.getStudentListByClassName();
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.EndDate': e.detail.value
    });
  },
  getList(e){
    let _this = this;
    let status = e.target.dataset.status;
    console.log('status',status)
    if(status == 'shidao') {
      dataListResult = dataList.filter(function (item, index, array) {
        return (item.EnterDoorDT != "")
      });
    }else if(status == 'weidao'){
      dataListResult = dataList.filter(function (item, index, array) {
        return (item.EnterDoorDT == "")
      });
    }else if(status == 'yingdao'){
      dataListResult = dataList;
    }
    console.log("dataListResult", dataListResult);
    _this.setData({
      dataList: dataListResult
    })
  },
  getChildListByDateAndSActualNo(){
    let _this = this;
    let url = "api/XXYXT/getChildListByDateAndSActualNo";
    let prams = {
      CreateDate: _this.data.form.StartDate,
      SActualNo: App.globalData.userInfo.SActualNo
    }
    App._post_form(url, prams, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        _this.setData({
          count: result.count,
          dataList: result.data
        })
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  getStudentListByClassName(){
    let _this = this;
    let url = "api/XXYXT/getStudentListByClassName";
    let prams = {
      ClassName: App.globalData.userInfo.SDDetailName
    }
    App._post_form(url, prams, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        _this.setData({
          count: result.count,
          dataList: result.data
        })
        dataList = result.data;
        console.log('dataList', dataList)
        _this.getAccessListByDateAndClassName();
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  getAccessListByDateAndClassName() {
    let _this = this;
    let url = "api/XXYXT/getAccessListByDateAndClassName";
    let prams = {
      ClassName: App.globalData.userInfo.SDDetailName,
      CreateDate: _this.data.form.StartDate,
      ReadHeadNote:"进门"
    }
    App._post_form(url, prams, function (res) {
      let result = JSON.parse(res)
      console.log("result", result)
      if (result.code == 1) {
        _this.setData({
          accessCount: result.count,
          accessList: result.data
        })
        accessList = result.data;
        console.log('accessList', accessList)
        if (result.count==0){
          for (let i = 0; i < _this.data.count; i++) {
            dataList[i].EnterDoorDT = ""
          }
          _this.setData({
            dataList: dataList,
            shidao:0,
            weidao:_this.data.count
          })
        }else{
          for (let i = 0; i < _this.data.count; i++) {
            for (let j = 0; j < _this.data.accessCount; j++) {
              console.log('dataList[i].SActualNo', dataList[i].SActualNo)
              console.log('accessList[j].SActualNo', accessList[j].SActualNo)
              if (dataList[i].SActualNo == accessList[j].SActualNo) {
                dataList[i].EnterDoorDT = accessList[j].RecordDT
                _this.setData({
                  dataList: dataList
                })
              }
            }
          }
          let weidao=0;
          for (let i = 0; i < dataList.length;i++){
            if (dataList[i].EnterDoorDT == ""){
              weidao++;
            }
          }
          _this.setData({
            shidao: _this.data.count - weidao,
            weidao: weidao
          })
        }
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  formSubmit(e){
    let _this = this;
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value
    });
    console.log('App.globalData.tab_bar_type', App.globalData.tab_bar_type)
    
    console.log('form', _this.data.form)
    let url = "";
    if (App.globalData.tab_bar_type=="in"){
      url = "api/visitors/getListByTimeAndOpenId4In"
      _this.setData({
        'form.OpenId4In': wx.getStorageSync('openid')
      });
    }else{
      url = "api/visitors/getListByTimeAndOpenId4Out"
      _this.setData({
        'form.OpenId4Out': wx.getStorageSync('openid')
      });
    }
    // if (_this.data.form.Phone == "" || _this.data.form.Phone == null){
    //   url ="api/visitors/getListByTime";
    // }else{
    //   url = "api/visitors/getListByTimeAndOpenId"
    // }
    App._post_form(url, _this.data.form, function (res) {
      // console.log("res", res)
      let result = JSON.parse(res)
      if (result.code == 1) {
        //console.log("data", result.data)
        if (result.count==0){
          App.showToast("暂无记录")
        }
        _this.setData({
          count:result.count,
          dataList:result.data
        })
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
    //wx.hideNavigationBarLoading()
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