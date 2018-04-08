module.exports = {
    button: [{
        name: '权利游戏',
        sub_button: [{
            name: '啥？',
            type: 'click',
            key: 'miniprogram'
        }, {
            name: '勾搭我',
            type: 'click',
            key: 'contact'
        }, {
            name: '手办',
            type: 'click',
            key: 'gift'
        }, {
            name: '拍照',
            type: 'pic_sysphoto',
            key: 'pic_sysphoto'
        }]
    }, {
        name: '冰火家族',
        type: 'view',
        url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdb0b987716f5cc54&redirect_uri=http://csq.weixin.caishangqing.com/api/weixin/redirect&response_type=code&scope=snsapi_userinfo&state=12345678#wechat_redirect'
    }, {
        name: '最新资源',
        type: 'location_select',
        key: 'location'
    }]
}