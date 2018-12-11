// components/m-filter-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {   //排序条件数据
      type: Array,
      value: [{
        name: '人气',
        id: '1',
        dir: "desc"
      }, {
        name: '新品',
        id: '2',
        dir: ""
      }, {
        name: '价格',
        id: '3',
        dir: ""
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击排序方式事件
     * @param {Object} e 操作对象
     * e.currentTarget.dataset.id 为对象id,在wxml传入
     */
    onTap: function(e) {
      let list = this.data.list
      let order
      for (let key in list) {
        if (e.currentTarget.dataset.id == list[key].id) {
          if (list[key].dir === "desc") { //已被选中情况下排序方式互换
            list[key].dir = 'asc'
          } else if (list[key].dir === "asc") { //已被选中情况下排序方式互换
            list[key].dir = "desc"
          } else { //未被选中情况下，初始排序为desc
            list[key].dir = "desc"
          }
          order = {order:list[key].id,dir:list[key].dir}
        } else {
          list[key].dir = ""
        }
      }
      this.setData({
        list: list
      })
      var filterDetail = {
        order: order
      } // detail对象，提供给事件监听函数
      var filterOption = {} // 触发事件的选项
      this.triggerEvent('filter', filterDetail, filterOption)
    },

    clickScreen: function() {
      var filterDetail = {} // detail对象，提供给事件监听函数
      var filterOption = {} // 触发事件的选项
      this.triggerEvent('clickScreen', filterDetail, filterOption)
    }
  }
})