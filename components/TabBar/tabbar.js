let App = getApp();
let form_ids = [];
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
    collectFormIds(formId) {
      form_ids=[];
      form_ids.push(formId);
    },
    formSubmit(e) {
      let _this = this;
      let formId = e.detail.formId;
      _this.collectFormIds(formId);
      console.log('========form_id============', e.detail.formId)
      if (form_ids[0] != 'the formId is a mock one') {
        App.globalData.formIds = form_ids;
        let prams = {
          Form_ids: App.globalData.formIds,
          SubDate: App.getDate(new Date().getTime() - 24 * 60 * 60 * 1000 * 6),
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
    onChange(event) {
      console.log(event.detail,"active");
      let active = event.detail;
      let url = ''
      //console.log(App.globalData.userInfo.store_cert,"App.globalData.userInfo.store_cert")
      if (App.globalData.tab_bar_type=='家长'){
        switch (active) {
          case 0:
            url = "/pages/attendance/child"
            break;
          // case 1:
          //   url = "/pages/history/index"
          //   break;
          case 1:
            url = "/pages/user/index"
            break;
          default:
            //App.globalData.is_pifa_selected = false
            url = "/pages/index/index"
        }
      }
      if (App.globalData.tab_bar_type == '教师') {
        switch (active) {
          case 0:
            url = "/pages/attendance/index"
            break;
          // case 1:
          //   url = "/pages/history/index"
          //   break;
          case 1:
            url = "/pages/user/index"
            break;
          default:
            //App.globalData.is_pifa_selected = false
            url = "/pages/index/index"
        }
      }
      if (App.globalData.tab_bar_type == '管理员') {
        switch (active) {
          case 0:
            url = "/pages/managementInfo/index"
            break;
          // case 1:
          //   url = "/pages/history/index"
          //   break;
          case 1:
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