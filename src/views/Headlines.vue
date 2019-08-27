<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Button @click="add">新增</Button>
      </div>
    </div>
    <Table border :columns="tabTitle" :data="tabdata"></Table>
    <Page
      :total="dataCount"
      :page-size="pageSize"
      show-elevator
      show-total
      @on-change="changPage"
      class-name="pageSorter"
    />
    <Modal :title="title" v-model="addmodel" class-name="vertical-center-modal" :closable="false">
      <Form :model="formItem" :label-width="80" ref="formItem" :rules="ruleValidate">
        <Form-item label="标题" prop="order">
          <Input v-model="formItem.order" placeholder="请输入"></Input>
        </Form-item>

        <Form-item label="内容" prop="content">
          <Input type="textarea"   :autosize="{minRows: 2,maxRows: 5}" v-model="formItem.content" placeholder="请输入"></Input>
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
      select: [],
      isAdd: false,
      title: "新增",

      addmodel: false,
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      dataCount2: 0,

      formItem: {
        order: "",
        content: ""
      },
      ruleValidate: {
        content: [{ required: true, message: "必填", trigger: "blur" }],
        order: [{ required: true, message: "必填", trigger: "blur" }]
      },
      tabTitle: [
        {
          title: "Id",
          key: "id",

          align: "center"
        },
        {
          title: "排序",
          key: "order",
          align: "center"
        },
        {
          title: "内容",
          key: "content",
          align: "center"
        },
        {
          title: "时间",
          key: "addtime",
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
          width: 370,
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
                    marginRight: "50px"
                  },
                  on: {
                    click: () => {
                      http
                        .post("admin/headlines/headlines_find", {
                          id: params.row.id
                        })
                        .then(res => {
                          if (res) {
                            this.$nextTick(() => {
                              this.title = "编辑";
                              this.$refs["formItem"].resetFields();
                              this.formItem = {
                                order: res.order.toString(),
                                content: res.content,
                                id:res.id
                              };
                            });

                            this.addmodel = true;
                          } else {
                            this.$Message.error(res.msg);
                          }
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
                    marginRight: "50px"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确认删除",

                        onOk: () => {
                          http
                            .post("admin/headlines/headlines_del", {
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

      data1: [],
      tabdata: [],
      selectId: "",
      selectDate: []
    };
  },

  created() {
    this.getList(1);
  },
  methods: {
    //   获取选中的用户
    selectChange(e) {
      this.selectDate = e;
    },
    // 消息翻页
    changPage(index) {
      this.getList(index);
    },

    // 点击新增消息
    add() {
      this.addmodel = true;
      this.$nextTick(() => {
        this.title = "新增";
        this.$refs["formItem"].resetFields();
      });
    },
    // 保存消息
    save() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/headlines/headlines", this.formItem).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.msg);
              this.addmodel = false;
              this.getList(0);
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    cancel() {},

    // 列表
    getList(page) {
      http
        .post("admin/headlines/headlines_list", {
          page: page,
          limit: 10
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.tabdata.forEach(val => {
              val.addtime = formatDate(val.addtime);
              val.status == 1 ? (val.status = "启用") : (val.status = "禁用");
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
  justify-content: space-between;
}
.content .header_right {
  flex: 4;
  display: flex;
  justify-content: flex-end;
}
</style>
