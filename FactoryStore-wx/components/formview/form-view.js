// components/form-view.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit:function(e){
      let formId = e.detail.formId;
      app.dealFormIds(formId);
    }
  }
})
