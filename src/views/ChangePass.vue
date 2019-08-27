<template>
  <div style="width:400px;">
    <Form :model="formItem" :label-width="80">
      <Form-item label="原始密码">
        <Input v-model="formItem.password_old" type="password" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="新的密码">
        <Input v-model="formItem.password_new" type="password" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="确认密码">
        <Input v-model="formItem.password_new_re" type="password" placeholder="请输入"></Input>
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
  created() {},
  methods: {
    save() {
      http.post("admin/base/reset", this.formItem).then(res => {
        if (res.code == 405) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  }
};
</script>

 
