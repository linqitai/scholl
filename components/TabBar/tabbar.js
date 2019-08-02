let App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: 0
    },
    tab_bar: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // icon : {
    //   home: "home",
    //   category: 'category',
    //   shopcart: 'shopcart',
    //   person: "person"
    // }
  },
  /***
   * 不能使用setData
   */
  created: function() {
  },
  attached: function() {},
  ready: function() {},
  moved: function() {},
  detached: function() {},
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log(event.detail,"active");
      let active = event.detail;
      let url = ''
      //console.log(App.globalData.userInfo.store_cert,"App.globalData.userInfo.store_cert")
      if (App.globalData.tab_bar_type=='in'){
        switch (active) {
          case 0:
            url = "/pages/index/index"
            break;
          case 1:
            url = "/pages/history/index"
            break;
          case 2:
            url = "/pages/user/index"
            break;
          default:
            //App.globalData.is_pifa_selected = false
            url = "/pages/index/index"
        }
      }
      if (App.globalData.tab_bar_type == 'out') {
        switch (active) {
          case 0:
            url = "/pages/date/index"
            break;
          case 1:
            url = "/pages/history/index"
            break;
          case 2:
            url = "/pages/user/index"
            break;
          default:
            //App.globalData.is_pifa_selected = false
            url = "/pages/index/index"
        }
      }
      if (App.globalData.tab_bar_type == 'check') {
        switch (active) {
          case 0:
            url = "/pages/check/index"
            break;
          case 1:
            url = "/pages/checked/index"
            break;
          case 2:
            url = "/pages/user/index"
            break;
          default:
            //App.globalData.is_pifa_selected = false
            url = "/pages/index/index"
        }
      }
      wx.redirectTo({
        url: url
      })
    }
  }
})