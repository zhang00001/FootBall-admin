<template>
  <div style="width:400px;">
    <Form :model="formItem" :label-width="80">
      <Form-item label="微信">
        <Input v-model="formItem.wechat" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="QQ">
        <Input v-model="formItem.qq" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="手机号">
        <Input v-model="formItem.mobile" placeholder="请输入"></Input>
      </Form-item>

      <Button type="primary" @click="save">保存</Button>
    </Form>
  </div>
</template>

<script>
import http from "@/utils/request";
export default {
  name: "service",
  data() {
    return {
      formItem: {
        mobile: "",
        wechat: "",
        qq: ""
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      http.post("admin/operate/service_find", {}).then(res => {
        this.formItem = res.data;
      });
    },

    save() {
      http.post("admin/operate/service", this.formItem).then(res => {
        if (res.code == 200) {
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
