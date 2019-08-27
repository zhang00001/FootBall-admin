<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Input search placeholder="手机号" style="width: auto" v-model="mobie" />

        <Button @click="searchBtn">搜索</Button>
        <Button @click="add">新增</Button>
      </div>
    </div>
    <Table border :columns="tabTitle" :data="tabdata"></Table>
    <!-- 分页器 -->
    <Page
      :total="dataCount"
      :page-size="pageSize"
      show-elevator
      show-total
      @on-change="changPage"
      class-name="pageSorter"
    />
    <!-- 弹出层 -->
    <Modal :title="title" v-model="addmodel" class-name="vertical-center-modal" :closable="false">
      <Form :model="formItem" :label-width="80" ref="formItem" :rules="ruleValidate">
        <Form-item label="类型" prop="type">
          <Select v-model="formItem.type" placeholder="请选择" @on-change="change">
            <Option value="1">优惠券-体验</Option>
            <Option value="2">优惠券-满减</Option>
            <Option value="3">优惠券-返还</Option>
          </Select>
        </Form-item>
        <Form-item label="名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="说明" prop="explain">
          <Input v-model="formItem.explain" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="有效期" prop="term_of_validity">
          <Input v-model="formItem.term_of_validity" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="满金额" prop="full_money">
          <Input v-model="formItem.full_money" placeholder="请输入" :disabled="isfull_money"></Input>
        </Form-item>
        <Form-item label="减金额" prop="reduce_money">
          <Input v-model="formItem.reduce_money" placeholder="请输入" :disabled="isreduce_money"></Input>
        </Form-item>
        <Form-item label="返还" prop="returns">
          <Input v-model="formItem.returns" placeholder="请输入" :disabled="isreturn"></Input>
        </Form-item>
        <Form-item label="状态" prop="status">
          <Radio-group v-model="formItem.status">
            <Radio label="1">启用</Radio>
            <Radio label="0">关闭</Radio>
          </Radio-group>
        </Form-item>
      </Form>
      <div slot="footer" class="user_btn">
        <Button @click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import http from "@/utils/request";
import { formatDate } from "@/utils/date";

export default {
  name: "specialist",
  data() {
    return {
      orderNo: "",
      mobie: "",
      status: "",
      isfull_money: false,
      isreduce_money: false,
      isreturn: false,
      addmodel: false,
      title: "新增",
      formItem: {
        status: "",
        name: "",
        type: "",
        title: "",
        explain: "",
        term_of_validity: "",
        full_money: "",
        reduce_money: "",
        returns: ""
      },
      ruleValidate: {
        type: [{ required: true, message: "必填", trigger: "blur" }],
        name: [{ required: true, message: "必填", trigger: "blur" }],

        status: [{ required: true, message: "必填", trigger: "blur" }],
        title: [{ required: true, message: "必填", trigger: "blur" }],
        explain: [{ required: true, message: "必填", trigger: "blur" }],
        term_of_validity: [{ required: true, message: "必填", trigger: "blur" }]
      },
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      tabTitle: [
        {
          title: "序号",
          key: "id",
          width: "65",
          align: "center"
        },
        {
          title: "类型",
          key: "name",
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          align: "center",
          width: 150
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "说明",
          key: "explain",

          align: "center"
        },
        {
          title: "创建时间",
          key: "addtime",
          width: "200px",
          align: "center"
        },
        {
          title: "有效期",
          key: "term_of_validity",

          align: "center"
        },
        {
          title: "满金额",
          key: "full_money",

          align: "center"
        },
        {
          title: "减金额",
          key: "reduce_money",

          align: "center"
        },
        {
          title: "返还",
          key: "return",

          align: "center"
        },
        {
          title: "状态",
          key: "status",

          align: "center"
        },
        {
          title: "操作",
          key: "operation",
          width: 170,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$nextTick(() => {
                        this.$refs["formItem"].resetFields();
                      });
                      http
                        .post("admin/money/coupon_find", { id: params.row.id })
                        .then(res => {
                          this.formItem = res.data;
                          this.formItem.type = res.data.type.toString();
                          this.change(this.formItem.type);
                          this.formItem.status = res.data.status.toString();
                          this.addmodel = true;
                        });
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确认删除",

                        onOk: () => {
                          http
                            .post("admin/money/coupon_del", {
                              id: params.row.id
                            })
                            .then(res => {
                              if (res.code == 200) {
                                this.$Message.success(res.msg);
                                this.getList(1);
                              } else {
                                this.$Message.error(res.msg);
                              }
                            });
                        },
                        onCancel: () => {}
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tabdata: []
    };
  },
  filters: {},
  created() {
    this.getList(1);
  },
  methods: {
    save() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/money/coupon", this.formItem).then(res => {
            if (res.code == 200) {
              this.addmodel = false;

              this.$Message.success(res.msg);
              this.getList(1);
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    change(e) {
      if (e == "1") {
        (this.isfull_money = true),
          (this.isreduce_money = true),
          (this.isreturn = true);
      }
      if (e == "2") {
        this.isreturn = true;
        (this.isfull_money = false), (this.isreduce_money = true);
      }
      if (e == "3") {
        this.isreturn = false;
        (this.isfull_money = true), (this.isreduce_money = true);
      }
    },

    add() {
      this.addmodel = true;
      this.$nextTick(() => {
        this.$refs["formItem"].resetFields();
      });
    },
    cancel() {},
    //  搜索
    searchBtn() {
      this.getList(0, this.mobie);
    },

    //  翻页
    changPage(index) {
      this.getList(index, this.mobie);
    },

    // 列表
    getList(page, mobie) {
      http
        .post("admin/money/coupon_list", {
          page: page,
          limit: 10,
          mobie: mobie
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.dataCount = res.data.count;
            this.tabdata.forEach(val => {
              val.addtime = formatDate(val.addtime);
              val.status == "1" ? (val.status = "启用") : (val.status = "禁用");
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.content .header {
  display: flex;
  margin-bottom: 18px;
}
.content .header_left {
  flex: 1;
  display: flex;
  /* justify-content: space-between; */
}
.content .header_right {
  flex: 4;
  display: flex;
  justify-content: flex-end;
}
</style>
