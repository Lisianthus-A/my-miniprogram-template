const app = getApp()

Page({
  data: {
    callbackKey: null
  },
  onLoad() {
    //监听全局数据改变
    const callbackKey = app.addGlobalListener(this.handleGlobalChange.bind(this));
    this.setData({ callbackKey });
  },
  onUnload() {
    //移除监听
    const { callbackKey } = this.data;
    app.removeGlobalListener(callbackKey);
  },
  handleGlobalChange() {  //全局数据改变时调用
    console.log('global change');
  }
})
