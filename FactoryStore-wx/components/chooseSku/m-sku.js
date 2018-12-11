// components/m-filter.js
//获取应用实例
const app = getApp()
Component({
    /**
     * 组件的属性列表
     * havImage:是否有顶部图片
     * marginTop:模块距离上方模块距离。
     */
    properties: {
        list: {
            type: Object
        },
        id: {
            type: String
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的生命周期
     */
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function() {

            const list = this.data.list.values
            let defaultSelectArr = list.filter(this.filter(1))
            let defaultSeclect = {}
            defaultSelectArr.forEach(item => defaultSeclect[this.data.list.name] = item.value)

            this.triggerEvent('default', defaultSeclect)
        },
        moved: function() {},
        detached: function() {},
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /***
         * 过滤函数
         */
        filter: function(select) {
            return character => character.select == select
        },
        /**
         * 在每一项上点击
         */
        tapOnItem: function() {
            this.triggerEvent('closeFunc')
        },
        /**
         * 单选框点击事件
         */
        radioChange: function(e) {
            const that = this
            const name = e.currentTarget.dataset.name
            const this_checked = e.detail.value
            let parameterList = this.data.list.values //获取Json数组
            for (var i = 0; i < parameterList.length; i++) {
                if (parameterList[i].value == this_checked) {
                    parameterList[i].select = 1; //当前点击的位置为true即选中
                } else {
                    parameterList[i].select = 2; //其他的位置为false
                }
            }
            const list = this.data.list
            list.values = parameterList
            that.setData({
                list
            })
            // 将选中的参数发给父组件m-specification
            const parsum = this.data.parsum || {}
            parsum[name] = this_checked
            this.triggerEvent('skuList', parsum)
        }
    }
})