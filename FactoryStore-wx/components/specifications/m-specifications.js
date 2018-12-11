// components/specifications/m-specifications.js
// components/loadmore.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     * isShow:是否显示组件
     * btnValue:1:加入购物车 2：立即购买
     * sku：规格数据 如 { goods：{...}，list：{...} }
     * handinch：手寸数据
     * gid：商品id
     * chooseSkuList：总的规格数据
     */
    properties: {
        isShow: {
            type: Boolean,
            value: false
        },
        btnValue: {
            type: String
        },
        sku: {
            type: Object,
            value: {}
        },
        handinch: {
            type: Object,
            value: {}
        },
        gid: {
            type: String
        },
        chooseSkuList: {
            type: Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        current: -1,
        mcurrent: -1,
        scurrent: -1,
        diamondList: ["30分 D色", "30分 D色", "30分 D色", "1克拉 D色 Sl1净 GD切", "30分 D色"],
        materialList: ["白18K金", "99银"],
        disabled: false,
        isClick: true
    },
    attached() {
        // 当组件被挂载到页面上的时候，读取父组件传来的一整个规格数据对象
        const {
            chooseSkuList
        } = this.data
        // 判断传过来的是否有手寸
        if (chooseSkuList.handinch.values) {
            // 如果有手寸的话，遍历手寸的values数组，判断遍历的每个对象的select属性是否为1，为1 就是当前值为选中，然后将选中的大小记录在size中，有找到select的值为1返回true,否则返回false
            const bool = chooseSkuList.handinch.values.some((item) => {
                this.setData({
                    size: item.select == 1 ? item.value : ""
                })
                this.triggerEvent('skuFunc', {
                    norms: "手寸:" + item.value
                })
                return item.select == 1
            })
            this.setData({
                [chooseSkuList.handinch.name]: bool,
                disabled: !bool
            })
            // 如果没有找到，就表示没有选中一个手寸，totast提示为选择手寸
            if (!bool) {
                wx.showToast({
                    title: '请选择手寸',
                    icon: 'none'
                })
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 从子组件传过来的默认值
         */
        default: function(e) {
            // 获取从子组件传过来的默认选中的值
            const defaultSelect = e.detail
            // 创建默认选中对象，如果已经有了用data里面的，没有新建一个空对象
            const defaultSelectObj = this.data.defaultSelectObj || {}
            // 遍历从子组件传过来的defaultSelect,将子组件传过来的值赋值给defaultSelectObj
            for (const key in defaultSelect) {
                defaultSelectObj[key] = defaultSelect[key]
            }
            this.setData({
                defaultSelectObj,
                defaultSelect
            })
        },
        /**
         * 在加入购物车或者立即购买按钮上点击
         */
        tapOnBtn: function(e) {
            let isClick = this.data.isClick
            if (isClick) { // 防止多次点击
                this.setData({
                    isClick: false
                })
                const current = e.currentTarget.dataset.current
                this.triggerEvent('btnFunc', {
                    current
                })
                setTimeout(() => {
                    this.setData({
                        isClick: true
                    })
                }, 1000)
            }
        },
        /**
         * 关闭按钮上的点击事件
         */
        closeTap: function() {
            // 触发父组件对象
            this.triggerEvent('closeSku')
        },
        // 获取子组件传过来的数据
        skuFunc: function(e) {
            // 获取子组件传过来的数据
            const skuData = e.detail
            // 获取商品的id
            const id = this.data.gid
            // 创建默认选中对象，如果data里面已经有了用data里面的,没有的话，新建一个对象
            let defaultSelectObj = this.data.defaultSelectObj || {}
            // 遍历从子组件传过来的数据，将子组件传过来的值赋值给defaultSelectObj
            for (const key in e.detail) {
                defaultSelectObj[key] = e.detail[key]
            }
            this.setData({
                defaultSelectObj
            })
            // 访问规格选择接口，请求数据
            app.req('goods/choosesku', {
                    id,
                    keyname: defaultSelectObj
                })
                .then(res => {
                    if (res.flag == "0") {
                        //  将请求回来的数据重新传给sku,handich,chooseSkuList等，重新渲染列表
                        this.setData({
                            sku: {
                                good: res.data.goods,
                                list: res.data.list
                            },
                            handinch: res.data.handinch,
                            chooseSkuList: res.data
                        })
                        // 如果有手寸的话，获取手寸的值
                        let values = res.data.handinch.values
                        // 如果size有值，表示有默认选中的size的值，
                        if (this.data.size) {
                            // 获取这个已经选中的size的值
                            const size = this.data.size
                            // 遍历手寸values数组，找出values数组中的哪个值和size的值一致，如何一致，将这个值新增一个属性select，属性的值为1,表示选中这个值
                            values.reduce((acc, item) => {
                                return item.value == size ? item['select'] = 1 : acc
                            }, [])
                            // 再讲修改后的对象重新赋值给handinch
                            this.setData({
                                handinch: res.data.handinch
                            })
                            this.triggerEvent('skuFunc', {
                                norms: "手寸:" + size
                            })
                        }
                        // 如果没有手寸
                        if (!res.data.handinch.values) {
                            // 触发父组件的skuFunc函数，将规格的norms参数传给父组件的
                            this.triggerEvent('skuFunc', {
                                norms: ""
                            })
                        }
                        // 触发父组件的getPrevInfo函数，将刚才接口返回的数据传给父组件
                        this.triggerEvent('getPrevInfo', {
                            list: res.data
                        })
                        // 触发父组件的规格id nid函数，将刚刚获取到的新的规格id传给父组件
                        this.triggerEvent('nid', {
                            nid: res.data.goods.id
                        })
                    }
                })
        },
        handinchFunc: function(e) {
            // 获取从子组件传来的手寸的值
            // 获取规格列表
            const {
                chooseSkuList
            } = this.data
            // 获取从子组件传来的手寸的大小
            const size = e.detail['手寸']
            // 获取规格列表中的手寸的values数组
            let values = chooseSkuList.handinch.values
            // 对values数组进行遍历，如果找到对象的value属性的值和size的值一致的时候，将这个对象新增一个select属性，并且值为1
            // for(let i = 0 ;i<values.length;i++){
            //   console.log(values[i])
            //   values[i].select=2
            // }
            // values.reduce((acc, item) => {
            //   return item.value == size ? item['select'] = 1 : acc
            // }, [])
            let newValues = values.map((item, index) => {
                if (item.value == size) {
                    item.select = 1
                } else {
                    item.select = 2
                }
                return item
            })
            // 重新设置size的值，将按钮取消禁用
            this.setData({
                size,
                disabled: false
            })
            // 将norms的值设置为手寸的值
            const norms = '手寸:' + size
            // 触发父组件的getPrevInfo函数，将刚才修改过手寸的chooseSkuList的返回给父组件
            this.triggerEvent('getPrevInfo', {
                list: this.data.chooseSkuList
            })
            // 触发父组件的skuFunc函数，norms值为刚才手寸的值
            this.triggerEvent('skuFunc', {
                norms
            })
        }
    }
})