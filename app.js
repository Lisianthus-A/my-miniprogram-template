const callbacks = {};  //全局数据改变时执行的回调

App({
    globalData: {
        serverUrl: 'http://localhost',  //服务器地址,
        token: null
    },
    onLaunch() {
        this.globalData = new Proxy(this.globalData, {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                target[prop] = value;
                Object.getOwnPropertySymbols(callbacks).forEach(symbol => {  //执行所有回调
                    const fn = callbacks[symbol];
                    fn();
                });
                return true;
            }
        })
    },
    addGlobalListener(fn) {  //添加全局数据改变时执行的回调
        const key = Symbol();  //生成唯一key
        callbacks[key] = fn;
        return key;
    },
    removeGlobalListener(key) {  //移除回调
        delete callbacks[key];
    }
});