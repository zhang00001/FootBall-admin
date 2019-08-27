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
        <Form-item label="标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入"></Input>
        </Form-item>

        <Form-item label="推送内容" prop="message">
          <Input type="textarea"   :autosize="{minRows: 2,maxRows: 5}" v-model="formItem.message" placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer" class="user_btn">
        <Button @click="save">确定</Button>
      </div>
    </Modal>
    <Modal title="选择推送人" v-model="mode2" class-name="vertical-center-modal" :closable="false">
      <Table border :columns="columns4" :data="data1" @on-selection-change="selectChange"></Table>
      <Page
        :total="dataCount2"
        :page-size="pageSize"
        show-elevator
        show-total
        @on-change="changPage2"
        class-name="pageSorter"
      />
      <div slot="footer" class="user_btn">
        <Button @click="save2">发送</Button>
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
      mode2: false,
      addmodel: false,
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      dataCount2: 0,

      formItem: {
        title: "",
        message: ""
      },
      ruleValidate: {
        title: [{ required: true, message: "必填", trigger: "blur" }],
        message: [{ required: true, message: "必填", trigger: "blur" }]
      },
      tabTitle: [
        {
          title: "序号",
          key: "id",

          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "消息",
          key: "message",
          align: "center"
        },
        {
          title: "时间",
          key: "addtime",
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
                      this.$nextTick(() => {
                        this.title = "编辑";
                        this.$refs["formItem"].resetFields();
                        http
                          .post("admin/system/message_find", {
                            id: params.row.id
                          })
                          .then(res => {
                            if (res.code == 200) {
                              this.formItem = res.data;
                              this.addmodel = true;
                            } else {
                              this.$Message.error(res.msg);
                            }
                          });
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
                            .post("admin/system/message_del", {
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
                      this.mode2 = true;
                      this.selectId = params.row.id;
                      this.getList2(1);
                    }
                  }
                },
                "推送"
              )
            ]);
          }
        }
      ],
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "昵称",
          key: "nick"
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
    // 会员翻页
    changPage2(index) {
      this.getList2(index);
    },
    // 点击发送
    save2() {
      this.$Modal.confirm({
        title: "确认发送",

        onOk: () => {
          http
            .post("admin/system/message_push", {
              message_id: this.selectId,
              user_id: this.selectDate.map(val => val.id).toString()
            })
            .then(res => {
              if (res.code == 200) {
                this.$Message.success(res.msg);
                this.mode2 = false;
              } else {
                this.$Message.error(res.msg);
              }
            });
        },
        onCancel: () => {}
      });
    },
    // 点击新增消息
    add() {
      this.addmodel = true;
      this.$nextTick(() => {
        this.$refs["formItem"].resetFields();
      });
    },
    // 保存消息
    save() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/system/message", this.formItem).then(res => {
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
        .post("admin/system/message_list", {
          page: page,
          limit: 10
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.tabdata.forEach(val => {
              val.addtime = formatDate(val.addtime);
            });
          }
        });
    },
    // 获取会员列表
    getList2(page) {
      http.post("admin/user/user_list", { page: page, limit: 10 }).then(res => {
        this.data1 = res.data;
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
