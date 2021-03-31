//提示
exports.alert = (msg) => {
    wx.showToast({
        title: msg,
        icon: 'none'
    });
}

//将时间转换成形如刚刚、x分钟前、x小时前、x天前、x月前、x年前的字符串
exports.convertDate = (date) => {
    const diff = Date.now() - new Date(date);
    const d = new Date(diff);
    if (diff <= 60000) {  //60秒内
        return '刚刚';
    } else if (diff <= 3600000) {  //60分钟内
        return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff <= 86400000) {  //24小时内
        return `${parseInt(diff / 3600000)}小时前`;
    } else if (d.getFullYear() > 1970) {
        return `${d.getFullYear() - 1970}年前`;
    } else if (d.getMonth()) {
        return `${d.getMonth()}个月前`;
    }
    return `${d.getDate() - 1}天前`;
}