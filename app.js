//app.js
const serverUrl = 'http://192.168.32.133';  //服务器地址
const baseParams = {  //请求基础参数
  method: 'GET',
  header: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, */*'
  },
  data: null
};
const baseUrl = `${serverUrl}/api/file`;

const callbacks = {};  //全局数据改变时执行的回调

App({
  globalData: {
    userData: {}
  },

  onLaunch() {
    this.globalData.isWx = !wx.getSystemInfoSync().environment;  //判断是否微信
    this.globalData = new Proxy(this.globalData, {  //创建全局数据的代理
      get(target, prop) {
        return target[prop];
      },
      set(target, prop, value) {
        target[prop] = value;
        Object.values(callbacks).forEach(fn => {  //执行回调
          fn();
        });
        return true;
      }
    })
  },

  async ajax(url, params = {}) {  //请求调用函数  params.url优先级比url高
    const result = await new Promise(resolve => {
      wx.request({
        url: baseUrl + url,
        ...baseParams,
        ...params,
        complete: res => resolve(res.data)
      });
    });
    return result;
  },

  login() {  //登录
    return new Promise(resolve => {
      const self = this;

      //微信/企业微信login的complete回调
      const handleComplete = async (res) => {
        if (!res.code) {  //无code
          resolve(res.errMsg);
          return;
        }

        let params = {};

        //设置请求url与params
        if (self.globalData.isWx) {  //微信
          params = {
            url: `${serverUrl}/api/login/minifile/init`,
            method: 'POST',
            data: { code: res.code }
          };
        } else {  //企业微信
          params = {
            url: `${serverUrl}/api/login/file/${res.code}/init`
          };
        }

        const result = await self.ajax('', params);

        if (!result || result.res !== 'succ') {  //登录失败
          resolve('fail');
          return;
        }

        baseParams.header.Authorization = result.data.token;  //请求携带token
        self.globalData.userData = result.data;  //保存用户信息到app全局数据
        resolve('succ');
      }

      if (self.globalData.isWx) {  //运行环境为微信
        wx.login({ complete: handleComplete });
      } else {  //企业微信
        wx.qy.login({ complete: handleComplete });
      }
    })

  },
  addGlobalListener(fn) {  //添加全局数据改变时执行的回调
    const key = Date.now().toString(36);
    callbacks[key] = fn;
    return key;
  },
  removeGlobalListener(key) {  //移除回调
    if (callbacks[key]) {
      delete callbacks[key];
    }
  },
  alert(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    });
  },
  getBaseParams() {
    return baseParams;
  },
  getBaseUrl() {
    return baseUrl;
  }
});