<template>
  <div class="content">
    <ul class="home_box f24">
      <li class="home_item">
        <div class="home_item_user">
          <p>今日新增用户</p>
          <p class="f14">(新注册用户)</p>
        </div>
        <p>{{user_today}}人</p>
      </li>
      <li class="home_item">
        <div class="home_item_user">
          <p>累计注册用户</p>
          <p class="f14">(所有用户)</p>
        </div>
        <p>{{user_total}}人</p>
      </li>
    </ul>
    <ul class="home_box f24">
      <li class="home_item">
        <p>今日充值金额</p>
        <p>¥{{money_today}}</p>
      </li>
      <li class="home_item">
        <p>累计充值金额</p>
        <p>¥{{money_total}}</p>
      </li>
    </ul>
    <ul class="home_box f24">
      <li class="home_item">
        <p>今日成交方案</p>
        <p>10</p>
      </li>
      <li class="home_item">
        <p>累计成交方案</p>
        <p>10</p>
      </li>
    </ul>
  </div>
</template>

<script>
import http from "@/utils/request";
export default {
  name: "home",
  data() {
    return {
      user_today: "", //今日新增用户
      user_total: "", //累计注册用户
      money_total: "", //累计充值金额
      money_today: "" //今日充值金额
    };
  },
  created() {
    http.post("admin/base/base", {}).then(res => {
      if (res) {
        this.user_today = res.data.money_today;
        this.user_total = res.data.user_total;
        this.money_total = res.data.money_total;
        this.money_today = res.data.money_today;
      }
    });
  }
};
</script>

<style scoped>
.contrnt {
  display: flex;
  align-items: center;
}
.home_box {
  display: flex;
  justify-content: space-around;
  /* padding-left: 100px;
        padding-right: 100px; */
}
.home_item_user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.f24 {
  font-size: 24px;
}
.f14 {
  font-size: 14px;
}
.home_item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 400px;
  height: 200px;
  /* margin: 42px 42px 42px 0; */
  margin-bottom: 42px;
  border: 1px solid #ccc;
}
</style>