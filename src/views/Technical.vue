<template>
  <div class="cardDiv">
    <Card class="card">
      <div style="padding:30px;">
        <p>技术支持：武汉创鱼科技有限公司</p>
        <p>联系方式：132456</p>
        <p>商务合作：132456</p>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: "technical",
  data() {
    return {};
  }
};
</script>

<style scoped>
.cardDiv {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}
.card {
}
.card p {
  font-family: "微软雅黑";
  line-height: 36px;
}
</style>
