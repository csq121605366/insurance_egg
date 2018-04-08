// 微信接口说明

const baseUrl = "https://api.weixin.qq.com/cgi-bin/";
const oautUrl = "https://api.weixin.qq.com/sns/";
module.exports = {
  common: {
    name: "公共接口",
    children: {
      getAccessToken: {
        name: "获取接口token",
        path: baseUrl + "token?grant_type=client_credential",
        amount: 2000
      },
      clearQuota: {
        name: "接口频率清零",
        path: baseUrl + "clear_quota?",
        amount: 10
      }
    }
  },
  menu: {
    name: "菜单",
    children: {
      create: {
        name: "自定义菜单创建",
        path: baseUrl + "menu/create?",
        amount: 1000
      },
      get: {
        name: "自定义菜单查询",
        path: baseUrl + "menu/get?",
        amount: 10000
      },
      del: {
        name: "自定义菜单删除",
        path: baseUrl + "menu/delete?",
        amount: 1000
      },
      addCondition: {
        name: "个性化菜单创建",
        path: baseUrl + "menu/addconditional?",
        amount: 1000
      },
      delCondition: {
        name: "个性化菜单删除",
        path: baseUrl + "menu/delconditional?",
        amount: 1000
      },
      tryCatch: {
        name: "测试个性化菜单匹配结果",
        path: baseUrl + "menu/trymatch?",
        amount: -1
      },
      getCurrentMenuInfo: {
        name: "获取自定义菜单配置接口",
        path: baseUrl + "get_current_selfmenu_info?",
        amount: 10000
      }
    }
  },
  temporary: {
    name: "临时素材",
    children: {
      upload: {
        name: "新增临时素材",
        path: baseUrl + "media/upload?",
        amount: 5000
      },
      fetch: {
        name: "获取临时素材",
        path: baseUrl + "media/get?",
        amount: 10000
      }
    }
  },
  permanent: {
    name: "永久素材",
    children: {
      upload: {
        name: "新增其他类型永久素材",
        path: baseUrl + "material/add_material?",
        amount: 1000
      },
      uploadNews: {
        name: "新增永久图文素材",
        path: baseUrl + "material/add_news?",
        amount: 1000
      },
      uploadNewsPic: {
        name: "上传图文消息内的图片获取URL",
        path: baseUrl + "media/uploadimg?",
        amount: 1000
      },
      fetch: {
        name: "获取永久素材",
        path: baseUrl + "material/get_material?",
        amount: 1000
      },
      del: {
        name: "删除永久素材",
        path: baseUrl + "material/del_material?",
        amount: 1000
      },
      update: {
        name: "修改永久图文素材",
        path: baseUrl + "material/update_news?",
        amount: 1000
      },
      count: {
        name: " 获取素材总数",
        path: baseUrl + "material/get_materialcount?",
        amount: 1000
      },
      batch: {
        name: "获取素材列表",
        path: baseUrl + "material/batchget_material?",
        amount: 1000
      }
    }
  },
  customservice: {
    name: "客服消息",
    children: {
      kfaccountAdd: {
        name: "添加客服帐号",
        path: "https://api.weixin.qq.com/customservice/kfaccount/add?",
        amount: 500
      },
      kfaccountUpdate: {
        name: "修改客服帐号",
        path: "https://api.weixin.qq.com/customservice/kfaccount/update?",
        amount: 500
      },
      kfaccountDel: {
        name: "删除客服帐号",
        path: "https://api.weixin.qq.com/customservice/kfaccount/del?",
        amount: 500
      },
      kfaccountAvatar: {
        name: "设置客服帐号的头像",
        path: "http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?",
        amount: 500
      },
      kfaccountList: {
        name: "获取所有客服账号",
        path: "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?",
        amount: 500000
      },
      kfmessageSend: {
        name: "客服发消息",
        path: "https://api.weixin.qq.com/cgi-bin/message/custom/send?",
        amount: 500000
      },
      kfmessageTyping: {
        name: "客服输入状态",
        path: "https://api.weixin.qq.com/cgi-bin/message/custom/typing?",
        amount: 500000
      }
    }
  },
  comment: {
    name: "图文消息留言",
    children: {
      uploadNews: {
        name: "新增永久图文素材-图文消息留言",
        path: baseUrl + "material/add_news?",
        amount: -1
      },
      fetch: {
        name: "获取永久素材-图文消息留言",
        path: baseUrl + "material/get_material?",
        amount: -1
      },
      update: {
        name: "修改永久图文素材-图文消息留言",
        path: baseUrl + "material/update_news?",
        amount: -1
      },
      batch: {
        name: "获取素材列表-图文消息留言",
        path: baseUrl + "material/batchget_material?",
        amount: -1
      },
      commentOpen: {
        name: "打开已群发文章评论-图文消息留言",
        path: baseUrl + "comment/open?",
        amount: -1
      },
      commentClose: {
        name: "关闭已群发文章评论-图文消息留言",
        path: baseUrl + "comment/close?",
        amount: -1
      },
      commentList: {
        name: "查看指定文章的评论数据-图文消息留言",
        path: baseUrl + "comment/list?",
        amount: -1
      },
      commentMarkelect: {
        name: "将评论标记精选-图文消息留言",
        path: baseUrl + "comment/markelect?",
        amount: -1
      },
      commentUnMarkelect: {
        name: "将评论取消精选-图文消息留言",
        path: baseUrl + "comment/unmarkelect?",
        amount: -1
      },
      commentDelect: {
        name: "删除评论-图文消息留言",
        path: baseUrl + "comment/delete?",
        amount: -1
      },
      commentReplyAdd: {
        name: "回复评论-图文消息留言",
        path: baseUrl + "comment/reply/add?",
        amount: -1
      },
      commentReplyDelete: {
        name: "删除回复-图文消息留言",
        path: baseUrl + "comment/reply/delete?",
        amount: -1
      }
    }
  },
  tags: {
    name: "标签",
    children: {
      create: {
        name: "创建标签",
        path: baseUrl + "tags/create?",
        amount: 1000
      },
      fetch: {
        name: "获取公众号已创建的标签",
        path: baseUrl + "tags/get?",
        amount: 1000
      },
      update: {
        name: "编辑标签",
        path: baseUrl + "tags/update?",
        amount: 1000
      },
      del: {
        name: "删除标签",
        path: baseUrl + "tags/delete?",
        amount: 1000
      },
      fetchUsers: {
        name: "获取标签下粉丝列表",
        path: baseUrl + "user/tag/get?",
        amount: 10000
      },
      batchTag: {
        name: "批量为用户打标签",
        path: baseUrl + "tags/members/batchtagging?",
        amount: 100000
      },
      batchUnTag: {
        name: "批量为用户取消标签",
        path: baseUrl + "tags/members/batchuntagging?",
        amount: 100000
      },
      getTagList: {
        name: "获取用户身上的标签列表",
        path: baseUrl + "tags/getidlist?",
        amount: 10000
      }
    }
  },
  user: {
    name: "用户",
    children: {
      remark: {
        name: "设置用户备注名",
        path: baseUrl + "user/info/updateremark?",
        amount: 10000
      },
      info: {
        name: "获取用户基本信息（包括UnionID机制）",
        path: baseUrl + "user/info?",
        amount: 500000
      },
      batchInfo: {
        name: "批量获取用户基本信息",
        path: baseUrl + "user/info/batchget?",
        amount: 500000
      },
      fetchUserList: {
        name: "获取用户列表",
        path: baseUrl + "user/get?",
        amount: 500
      },
      getBlackList: {
        name: "获取公众号的黑名单列表",
        path: baseUrl + "tags/members/getblacklist?",
        amount: 500000
      },
      batchBlackUsers: {
        name: "批量拉黑用户",
        path: baseUrl + "tags/members/batchblacklist?",
        amount: 500000
      },
      batchUnBlackUsers: {
        name: "批量取消拉黑用户",
        path: baseUrl + "tags/members/batchunblacklist?",
        amount: 500000
      }
    }
  },
  account: {
    name: "账户",
    children: {
      creater: {
        name: "创建二维码(临时，永久)",
        path: baseUrl + "qrcode/create?",
        amount: 100000
      },
      shorturl: {
        name: "长链接转短链接接口",
        path: baseUrl + "shorturl?",
        amount: 1000
      }
    }
  },
  analysis: {
    name: "数据分析",
    children: {
      userSum: {
        name: "获取用户增减数据",
        path: "https://api.weixin.qq.com/datacube/getusersummary?",
        amount: -1
      },
      userCum: {
        name: "获取累计用户数据",
        path: "https://api.weixin.qq.com/datacube/getusercumulate?",
        amount: -1
      },
      articleSum: {
        name: "获取图文群发总数据",
        path: "https://api.weixin.qq.com/datacube/getarticlesummary?",
        amount: -1
      },
      articleTotal: {
        name: "获取图文群发每日数据",
        path: "	https://api.weixin.qq.com/datacube/getarticletotal?",
        amount: -1
      },
      userRead: {
        name: "获取图文统计数据",
        path: "https://api.weixin.qq.com/datacube/getuserread?",
        amount: -1
      },
      userReadHour: {
        name: "获取图文统计分时数据",
        path: "https://api.weixin.qq.com/datacube/getuserreadhour?",
        amount: -1
      },
      userShare: {
        name: "获取图文统计分时数据",
        path: "https://api.weixin.qq.com/datacube/getusershare?",
        amount: -1
      },
      userShareHour: {
        name: "获取图文分享转发分时数据",
        path: "https://api.weixin.qq.com/datacube/getusersharehour?",
        amount: -1
      },
      upstreamMsg: {
        name: "获取消息发送概况数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsg?",
        amount: -1
      },
      upstreamMsgHour: {
        name: "获取消息分送分时数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsghour?",
        amount: -1
      },
      upstreamMsgWeek: {
        name: "获取消息发送周数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsgweek?",
        amount: -1
      },
      upstreamMsgMonth: {
        name: "获取消息发送月数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsgmonth?",
        amount: -1
      },
      upstreamMsgDist: {
        name: "获取消息发送分布数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsgdist?",
        amount: -1
      },
      upstreamMsgDistWeek: {
        name: "获取消息发送分布周数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsgdistweek?",
        amount: -1
      },
      upstreamMsgDistMonth: {
        name: "获取消息发送分布月数据",
        path: "https://api.weixin.qq.com/datacube/getupstreammsgdistmonth?",
        amount: -1
      },
      interfaceSum: {
        name: "获取接口分析数据",
        path: "https://api.weixin.qq.com/datacube/getinterfacesummary?",
        amount: -1
      },
      interfaceSumHour: {
        name: "获取接口分析分时数据",
        path: "https://api.weixin.qq.com/datacube/getinterfacesummaryhour?",
        amount: -1
      }
    }
  },
  ticket: {
    name: "微信jsapi_ticket",
    children: {
      get: {
        name: "获取ticket",
        path: baseUrl + "ticket/getticket?",
        amount: -1
      }
    }
  },
  oauth: {
    name: "网页授权oauth认证",
    children: {
      authorize: {
        name: "鉴权地址",
        path: "https://open.weixin.qq.com/connect/oauth2/authorize?",
        amount: -1
      },
      accessToken: {
        name: "获取oauth认证token",
        path: oautUrl + "oauth2/access_token?",
        amount: -1
      },
      userInfo: {
        name: "获取用户信息",
        path: oautUrl + "userinfo?",
        amount: -1
      }
    }
  }
};
