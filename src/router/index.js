import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('../components/Login.vue')
    },

    { path: '/', redirect: '/home' },
]

// 需要通过后台数据来生成的组件
export const asyncRoutes = {
    'home': {
        path: 'home',
        name: 'home',
        component: () =>
            import ('../views/Home.vue')
    },
    'changePass': {
        path: 'changePass',
        name: 'changePass',
        component: () =>
            import ('../views/ChangePass.vue')
    },
    't1': {
        path: 't1',
        name: 't1',
        component: () =>
            import ('../views/T1.vue')
    },
    'memberlist': {
        path: 'memberlist',
        name: 'memberlist',
        component: () =>
            import ('../views/Memberlist.vue')
    },
    'specialist': {
        path: 'specialist',
        name: 'specialist',
        component: () =>
            import ('../views/Specialist.vue')
    },
    'scheme': {
        path: 'scheme',
        name: 'scheme',
        component: () =>
            import ('../views/Scheme.vue')
    },
    'expertlist': {
        path: 'expertlist',
        name: 'expertlist',
        component: () =>
            import ('../views/Expertlist.vue')
    },
    'competitionlist': {
        path: 'competitionlist',
        name: 'competitionlist',
        component: () =>
            import ('../views/Competitionlist.vue')
    },
    'teamlist': {
        path: 'teamlist',
        name: 'teamlist',
        component: () =>
            import ('../views/Teamlist.vue')
    },
    'headlines': {
        path: 'headlines',
        name: 'headlines',
        component: () =>
            import ('../views/Headlines.vue')
    },
    'topuplist': {
        path: 'topuplist',
        name: 'topuplist',
        component: () =>
            import ('../views/Topuplist.vue')
    },
    'topuprule': {
        path: 'topuprule',
        name: 'topuprule',
        component: () =>
            import ('../views/Topuprule.vue')
    },
    'coupon': {
        path: 'coupon',
        name: 'coupon',
        component: () =>
            import ('../views/Coupon.vue')
    },
    'banner': {
        path: 'banner',
        name: 'banner',
        component: () =>
            import ('../views/Banner.vue')
    },
    'service': {
        path: 'service',
        name: 'service',
        component: () =>
            import ('../views/Service.vue')
    },
    'instation': {
        path: 'instation',
        name: 'instation',
        component: () =>
            import ('../views/Instation.vue')
    },
    'databackup': {
        path: 'databackup',
        name: 'databackup',
        component: () =>
            import ('../views/DataBackup.vue')
    },
    'technical': {
        path: 'technical',
        name: 'technical',
        component: () =>
            import ('../views/Technical.vue')
    },
    'msg': {
        path: 'msg',
        name: 'msg',
        component: () =>
            import ('../views/Msg.vue')
    }
}



const createRouter = () => new Router({
    routes: commonRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router