<template>
  <div class="login-vue" :style="bg">
    <div class="container">
      <p class="title">大神推球后台管理</p>
      <div class="input-c">
        <Input
          prefix="ios-contact"
          v-model="account"
          placeholder="用户名"
          clearable
          @on-blur="verifyAccount"
           @keyup.enter.native='submit'
        />
        <p class="error">{{accountError}}</p>
      </div>
      <div class="input-c">
        <Input
          type="password"
          v-model="pwd"
          prefix="md-lock"
          placeholder="密码"
          clearable
          @on-blur="verifyPwd" @keyup.enter.native='submit'
        />
        <p class="error">{{pwdError}}</p>
      </div>
      <Button :loading="isShowLoading" class="submit" type="primary" @click="submit" >登陆</Button>
      <!-- <span class="account"><span @click="register">注册账号</span> | <span @click="forgetPwd">忘记密码</span></p> -->
    </div>
  </div>
</template>

<script>
import http from "@/utils/request";
export default {
  name: "login",
  data() {
    return {
      account: "",
      pwd: "",
      accountError: "",
      pwdError: "",
      isShowLoading: false,
      bg: {}
    };
  },
  created() {
    // this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')'
    this.bg.backgroundColor = "#20222A";
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    verifyAccount(e) {
      if (this.account == "") {
        this.accountError = "账号为不能为空";
      } else {
        this.accountError = "";
      }
    },
    verifyPwd(e) {
      if (this.pwd == "") {
        this.pwdError = "密码不能为空";
      } else {
        this.pwdError = "";
      }
    },
    register() {
      console.log("注册账号");
    },
    forgetPwd() {
      console.log("忘记密码");
    },
    submit() {
      if (this.account !== "" || this.pwd !== "") {
        http
          .post("admin/base/login", {
            username: this.account,
            password: this.pwd
          })
          .then(res => {
            if (res.code == 200) {
              this.isShowLoading = true;
              localStorage.setItem("user", JSON.stringify(res.data.data));
              // 登陆成功 设置用户信息
              localStorage.setItem(
                "userImg",
                "https://avatars3.githubusercontent.com/u/22117876?s=460&v=4"
              );
              // localStorage.setItem('userName', '小明')
              // 登陆成功 假设这里是后台返回的 token
              localStorage.setItem("token", res.data.token);
              // localStorage.setItem('token','i_am_token')
              this.$router.push({ path: this.redirect || "/" });
            } else {
              this.isShowLoading = false;
              this.$Message.error(res.msg);
            }
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        this.$Message.error("账号密码不能为空");
      }
    }
  }
};
</script>

<style>
.login-vue {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.login-vue .container {
  background: rgba(255, 255, 255, 0.3);
  width: 600px;
  text-align: center;
  border-radius: 10px;
  padding: 30px;
}
.login-vue .ivu-input {
  background-color: transparent;
  color: #fff;
  outline: #fff;
  border-color: #fff;
}
.login-vue ::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: rgba(255, 255, 255, 0.8);
}
.login-vue .title {
  font-size: 20px;
  margin-bottom: 20px;
}
.login-vue .input-c {
  margin: auto;
  width: 300px;
}
.login-vue .error {
  color: red;
  text-align: left;
  margin: 5px auto;
  font-size: 12px;
  padding-left: 30px;
  height: 20px;
}
.login-vue .submit {
  width: 200px;
}
.login-vue .account {
  margin-top: 30px;
}
.login-vue .account span {
  cursor: pointer;
}
.login-vue .ivu-icon {
  color: #eee;
}
.login-vue .ivu-icon-ios-close-circle {
  color: #777;
}
</style>


