import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 左侧菜单栏数据
        menuItems: [{
                name: 'home', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '首页', // 文本内容
                mate: { isShow: true, power: 1 }
            },
            {
                name: 'changePass', // 要跳转的路由名称 不是路径
                text: '修改密码',
                mate: { isShow: false, },
            },
            {
                text: '用户管理',
                type: 'md-people',
                mate: { isShow: true, power: 'power_user' },
                children: [{
                        name: 't1',
                        text: '管理员列表'
                    },
                    {
                        name: 'memberlist',
                        text: '会员列表'
                    },

                ]
            },
            {
                text: '专家管理',
                type: 'ios-school',
                mate: { isShow: true, power: 'power_expert' },
                children: [{
                        name: 'specialist',
                        text: '专家列表'
                    },

                    {
                        name: 'expertlist',
                        text: '方案列表'
                    }
                ]
            },
            {
                text: '赛事管理',
                mate: { isShow: true, power: 'power_match' },
                type: 'md-trophy',
                children: [{
                        name: 'competitionlist',
                        text: '赛事列表'
                    },
                    {
                        name: 'teamlist',
                        text: '球队列表'
                    },

                ]
            },
            {
                text: '财务管理',
                type: 'logo-yen',
                mate: { isShow: true, power: 'power_money' },
                children: [{
                        name: 'topuplist',
                        text: '充值列表'
                    },
                    {
                        name: 'topuprule',
                        text: '充值规则'
                    },
                    {
                        name: 'coupon',
                        text: '优惠券管理'
                    },

                ]
            },
            {
                text: '运营管理',
                type: 'md-trending-up',
                mate: { isShow: true, power: 'power_operate' },
                children: [{
                        name: 'banner',
                        text: 'banner'
                    },
                    {
                        name: 'headlines',
                        text: '头条'
                    },

                    {
                        name: 'service',
                        text: '客服管理'
                    },
                    {
                        name: 'instation',
                        text: '站内管理'
                    },

                ]
            },
            {
                text: '系统设置',
                type: 'md-build',
                mate: { isShow: true, power: 'power_operate' },
                children: [{
                        name: 'databackup',
                        text: '数据备份'
                    },
                    {
                        name: 'msg',
                        text: '消息推送'
                    },
                    {
                        name: 'technical',
                        text: '技术支持'
                    }
                ]
            }
        ],
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
    }
})

export default store