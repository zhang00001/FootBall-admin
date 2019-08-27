import axios from 'axios'

import store from '../store'
import router from './../router'
import qs from "qs"
import { Message, Modal } from "iview"
// 创建axios实例
import global_ from '../Global.vue'
const service = axios.create({
    baseURL: global_.BASE_URL, // api的base_url
    // baseURL: "http://192.168.1.12",
    timeout: 1500, // 请求超时时间,
    // withCredentials: true,
    changeOrigin: true,
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    //     'Content-Type': 'application/json; charset=UTF-8',

    // }
})

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// request拦截器
service.interceptors.request.use(config => {

    if (localStorage.getItem("token")) {
        let token = localStorage.getItem("token")
        config.data.token = token;
    }

    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }

    return config
}, error => {


    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(

    response => {

        /**
         * code为非0是抛错 可结合自己业务进行修改
         */

        const res = response.data

        // console.log(res);
        // return false;
        if (response.status !== 200) {

            Message({
                message: res.msg,
                type: 'error',
                duration: 3 * 1000
            })

            // 401:未登录;
            if (res.code === 401 || res.code === 403) {
                MessageBox.alert('登录过期，请重新登录', {
                    confirmButtonText: '重新登录',
                    type: 'warning'
                }).then(() => {

                    window.location = '/login';
                    localStorage.clear();
                    location.reload()

                })
            }
            return Promise.reject('error')
        } else {
            // debugger
            if (response.data.code == 401) {
                Modal.confirm({
                    title: '登录已过期，请重新登录',

                    onOk: () => {
                        window.location = '/login';
                        localStorage.clear();
                        location.reload()
                    },

                });
                return
            } else {

                return response.data


            }
            // 

        }

    },
    error => {



    }
)

export default service