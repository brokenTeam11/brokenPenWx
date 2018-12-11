// components/m-filter-kind.js
Component({
  /**
   * 组件的属性列表
   * havImage:是否有顶部图片
   * marginTop:模块距离上方模块距离。
   */
  properties: {
    kindItem:{
      type: Object,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:'',
    kindId:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange:function (e) {
      let checkedArr = e.detail.value
      const id = e.currentTarget.dataset.id
      console.log(e.detail.value)
      console.log(this.data.kindItem)
      let items = this.data.kindItem.values
      items.forEach((ele,index)=>{
        if (checkedArr.indexOf((ele.id).toString()) !== -1){
          console.log(3)
          items[index].checked = true
        }else{
          items[index].checked = false
        }
      })
      const kindItem = this.data.kindItem
      kindItem.values = items
      this.setData({
        kindItem
      });
      const kindId = this.data.kindId || []
      kindId[id] = e.detail.value
      this.setData({
        kindId
      })
      this.triggerEvent('getKind', kindId)
    }
  }
})