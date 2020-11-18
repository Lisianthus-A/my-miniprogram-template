Component({
  data: {
    showMask: false
  },
  properties: {
    mask: {  //显示遮罩
      type: Boolean,
      value: false
    }
  },
  lifetimes: {
    attached() {
      this.setData({ showMask: this.properties.mask })
    }
  }
})
