const app = getApp();

const serverUrl = app.globalData.serverUrl;  //服务器地址
const baseParams = {  //请求基础参数
    method: 'GET',
    header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, */*'
    }
};

//请求函数
const ajax = (urlOrParams, params = {}) => {
    const options = typeof urlOrParams === 'object'
        ? { ...baseParams, ...urlOrParams, url: serverUrl + urlOrParams.url } //以 ajax(params) 形式调用
        : { ...baseParams, ...params, url: serverUrl + urlOrParams };  //以 ajax(url, params) 形式调用
    return new Promise(resolve => {
        wx.request({
            ...options,
            complete: res => resolve(res.data)
        });
    }).catch(err => console.log('Error:', err));
}

//登录
exports.login = () => {
    return new Promise(resolve => {
        if (baseParams.header.Authorization) {  //已经登录过了
            resolve(true);
            return;
        }

        wx.login({
            complete: async (res) => {
                if (!res.code) {  //无code
                    console.log(res.errMsg);
                    resolve(false);
                    return;
                }

                //设置请求 url 与 params
                const params = {
                    url: `/api/login?code=${res.code}`
                };

                const result = await ajax(params);

                if (!result || result.res !== 'succ') {  //登录失败
                    resolve(false);
                    return;
                }

                baseParams.header.Authorization = result.data.token;  //请求携带 token
                app.globalData.token = result.data.token;  //app 全局数据保存 token
                resolve(true);
            }
        });
    });
}

//上传文件
exports.uploadFile = async (tempPath) => {
    const result = await new Promise(resolve => {
        wx.uploadFile({
            filePath: tempPath,
            name: 'file',
            url: `${serverUrl}/api/uploadFile`,
            header: {
                "Content-Type": "multipart/form-data",
                'Accept': 'application/json',
                'Authorization': baseParams.header.Authorization
            },
            success(res) {
                const response = JSON.parse(res.data);
                resolve(response);
            }
        });
    })
    return result;
}