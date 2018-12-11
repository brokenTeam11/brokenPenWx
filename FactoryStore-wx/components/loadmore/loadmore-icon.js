// components/loadmore-icon.js
var _animation = wx.createAnimation({
  duration: _ANIMATION_TIME,
  timingFunction: 'linear',
  delay: 0,
  transformOrigin: '50% 50% 0'
});
var _animationIntervalId;
var _loadImagePathIndex = 0;
const _ANIMATION_TIME = 500;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: String,
      value: "40rpx"
    }
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
    
  }
})