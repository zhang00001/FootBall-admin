<template>
  <div style="width:400px;">
    <Form :model="formItem" :label-width="80" ref="formItem">
      <Form-item label="标题" prop="title">
        <Input v-model="formItem.title" placeholder="请输入"></Input>
      </Form-item>
      <Form-item label="内容" prop="content">
        <Input v-model="formItem.content" placeholder="请输入"></Input>
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
        content: "",
        title: ""
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      http.post("admin/operate/notice_find", {}).then(res => {
        this.formItem = res.data;
      });
    },
    save() {
      http.post("admin/operate/notice", this.formItem).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.msg);
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
