<template>
  <Form ref="formDynamic" :model="formDynamic" :label-width="80">
    <Form-item v-for="(item, index) in formDynamic.rule" :key="index" :label="'充值金额' + (index + 1)">
      <!-- :prop="'items.' + index + '.name'"
      :rules="{required: true, message: '充值金额' + (index + 1) +'不能为空', trigger: 'blur'}"-->
      <Row>
        <Col span="3">
          <Input type="number" v-model="item.name" placeholder="请输入..."></Input>
        </Col>
        <Col span="1">&nbsp;&nbsp; 元&nbsp;=</Col>
        <Col span="3">
          <Input type="number" v-model="item.money" placeholder="请输入..."></Input>
        </Col>
        <Col span="1">&nbsp;&nbsp; 钻&nbsp;</Col>
        <Col span="1">
          <Button type="primary" @click="handleRemove(index)">删除</Button>
        </Col>
      </Row>
    </Form-item>
    <FormItem label="充值说明" style="width:970px">
      <Row>
        <Col span="16">
          <Input v-model="formDynamic.msg" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </Col>
      </Row>
    </FormItem>
    <Form-item>
      <Row>
        <Col span="9">
          <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
        </Col>
      </Row>
    </Form-item>
    <Form-item>
      <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
    </Form-item>
  </Form>
</template>
<script>
import http from "@/utils/request";
export default {
  data() {
    return {
      formDynamic: {
        rule: [
          {
            name: "",
            money: ""
          }
        ],
        msg: ""
      }
    };
  },
  created() {
    this.getRule();
  },
  methods: {
    getRule() {
      http.post("admin/money/rule_find", {}).then(res => {
        {
          this.formDynamic.msg = res.data.msg;
          this.formDynamic.rule = JSON.parse(res.data.rule);
        }
      });
    },
    handleSubmit(name) {
      http.post("admin/money/rule", this.formDynamic).then(res => {
        if (res) {
          this.$Message.success(res.msg);
          this.$refs["formDynamic"].resetFields();
        } else {
          this.$Message.error(res.msg);
        }
      });

      console.log(this.formDynamic);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleAdd() {
      this.formDynamic.rule.push({
        name: "",
        money: ""
      });
    },
    handleRemove(index) {
      this.formDynamic.rule.splice(index, 1);
    }
  }
};
</script>
