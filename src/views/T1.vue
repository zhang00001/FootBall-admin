<template>
  <div class="T1">
    <div class="query-c">
      <Button @click="add">添加管理员</Button>
    </div>
    <Table border :columns="tabTitle" :data="searchData.length > 0 ? searchData : dataList"></Table>
    <Modal
      v-model="addManage"
      class-name="vertical-center-modal"
      :closable="false"
      :title="title"
      :loading="loading"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="用户名" prop="username">
          <Input v-model="formValidate.username" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="昵称" prop="nick">
          <Input v-model="formValidate.nick" placeholder="请输入"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="submitFP">取消</Button>
        <Button type="primary" size="large" @click="save">确定</Button>
      </div>
    </Modal>

    <Modal v-model="isJurisdiction" class-name="vertical-center-modal" :closable="false">
      <div class="user_info">
        权限设置
        <div class="jurisdiction_box">
          <!-- <CheckboxGroup v-model="jurisdictionList"> -->
          <Checkbox v-model="jurisdictionList.power_user">会员管理</Checkbox>
          <Checkbox v-model="jurisdictionList.power_expert">专家管理</Checkbox>
          <Checkbox v-model="jurisdictionList.power_match">赛事管理</Checkbox>
          <Checkbox v-model="jurisdictionList.power_money">财务管理</Checkbox>
          <Checkbox v-model="jurisdictionList.power_operate">运营管理</Checkbox>
          <Checkbox v-model="jurisdictionList.power_system">系统设置</Checkbox>
          <!-- </CheckboxGroup> -->
        </div>
      </div>
      <div slot="footer" class="user_btn">
        <Button @click="jurisdiction" :id="id">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import http from "@/utils/request";
import { formatDate } from "@/utils/date";
export default {
  name: "t1",
  data() {
    return {
      formValidate: {
        username: "", //手机
        password: "", //密码
        nick: "" //昵称
      },

      loading: true,
      title: "新增",
      addManage: false, //is管理

      OneData: {},
      isOneData: false,
      id: "",
      idTwo: "",
      ruleValidate: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        nick: [{ required: true, message: "昵称不能为空", trigger: "blur" }]
      },
      isJurisdiction: false, //权限
      jurisdictionList: [],
      // 表格title
      tabTitle: [
        {
          title: "序号",
          key: "id",
          width: "65",
          align: "center"
        },
        {
          title: "手机号",
          key: "username",
          align: "center"
        },
        {
          title: "昵称",
          key: "nick",
          align: "center"
        },
        {
          title: "创建时间",
          key: "addtime",
          align: "center"
        },
        {
          title: "操作",
          key: "operation",
          width: 270,
          align: "center",
          render: (h, params) => {
            let isuser = h(
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
                      this.$refs["formValidate"].resetFields();
                      this.addManage = true;
                      this.title = "编辑";
                      this.formValidate = {
                        username: params.row.username,
                        password: "",
                        nick: params.row.nick,
                        id: params.row.id
                      };
                    });
                  }
                }
              },
              "编辑"
            );

            if (JSON.parse(localStorage.getItem("user")).id == 1) {
              return h("div", [
                isuser,
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.index);
                      }
                    }
                  },
                  "权限"
                )
              ]);
            } else {
              return isuser;
            }
          }
        }
      ],
      // 表格数据
      dataList: [],
      searchData: []
    };
  },
  methods: {
    //   取消
    submitFP() {
      this.$nextTick(() => {
        this.addManage = false;
        this.$refs["formValidate"].resetFields();
      });
    },
    add() {
      (this.title = "新增"), (this.addManage = true);
    },
    show(index) {
      this.isOneData = true;
      let id = this.dataList[index].id;
      this.id = id;
      this.getOneData(id);
    },
    remove(index) {
      this.isJurisdiction = true;
      let id = this.dataList[index].id;
      this.idTwo = id;
      http.post("admin/user/admin_power_get", { id: id }).then(res => {
        if (res) {
          let obj = res.data;
          for (let key in obj) {
            if (obj[key] == 1) {
              obj[key] = true;
            } else if (obj[key] == null) {
              obj[key] = false;
            }
          }
          this.jurisdictionList = obj;
        }
      });
    },
    C_search() {},
    save() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          http.post("admin/user/admin", this.formValidate).then(res => {
            if (res.code == 200) {
              this.getList();
              this.$Message.success(res.msg);
              this.addManage = false;
              this.$nextTick(() => {
                this.$refs["formValidate"].resetFields();
              });
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },

    // 获取管理列表
    getList(page) {
      http
        .post("admin/user/admin_list", { page: page, limit: 10 })
        .then(res => {
          if (res.code==200) {
            this.dataList=[]
            this.dataList = res.data;
            this.dataList.forEach(val => {
              val.addtime = formatDate(val.addtime);
            });
          }
        });
    },
    //  权限
    jurisdiction() {
      this.isJurisdiction = false;
      let jurisdictionObj = Object.assign({}, this.jurisdictionList);
      for (let key in jurisdictionObj) {
        if (jurisdictionObj[key] == true) {
          jurisdictionObj[key] = 1;
        } else if (jurisdictionObj[key] == false) {
          jurisdictionObj[key] = 0;
        }
      }
      http.post("admin/user/admin_power", jurisdictionObj).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    }
  },
  created() {
    this.getList(1);
  },
  watch: {}
};
</script>

<style  scoped>
.T1 >>> .ivu-table th {
  background-color: transparent;
}
.query-c {
  display: flex;
  margin-bottom: 18px;
}
.query-c-firstBox {
  flex: 1;
  display: flex;
  justify-content: space-between;
}
.query-c-twoBox {
  flex: 4;
  display: flex;
  justify-content: flex-end;
}
.T1 >>> .vertical-center-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.T1 >>> .vertical-center-modal .ivu-modal {
  top: 0;
}
.user_info {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.user_info input {
  margin-top: 5px;
  margin-bottom: 20px;
  height: 30px;
}
.user_btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user_btn button {
  width: 200px;
}
.jurisdiction_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.jurisdiction_box >>> .ivu-checkbox-inner {
  border-radius: 50%;
}
.ivu-checkbox-wrapper {
  margin: 10px;
  margin-left: 50px;
}
</style>