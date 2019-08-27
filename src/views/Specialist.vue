<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Input search placeholder="手机号" style="width: auto" v-model="searchText_phone" />

        <Button @click="searchBtn">搜索</Button>
      </div>
      <div class="header_right">
        <Button @click="addBtn">添加</Button>
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
    <Modal v-model="isAdd" :title="title" class-name="vertical-center-modal" :closable="false">
      <Form :model="formItem" :label-width="80" ref="formItem" :rules="ruleValidate">
        <Form-item label="手机号" prop="mobile">
          <Input v-model="formItem.mobile" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="formItem.password" type="password" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="昵称" prop="nick">
          <Input v-model="formItem.nick" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :http-request="uploadFile"
          
            action
            :show-file-list="false"
            :file-list="fileLists"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </Form-item>

        <Form-item label="个人介绍" prop="synopsis">
          <Input v-model="formItem.synopsis" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="战绩" prop="record">
          <Input v-model="formItem.record" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="推荐" prop="recommend">
          <Select v-model="formItem.recommend" placeholder="请选择">
            <Option value="0">否</Option>
            <Option value="1">是</Option>
          </Select>
        </Form-item>
        <Form-item label="命中率" prop="hit_rate">
          <Input v-model="formItem.hit_rate" type="number" placeholder="请输入"></Input>
        </Form-item>
      </Form>

      <div slot="footer">
        <Button type="text" size="large" @click="submitFP">取消</Button>
        <Button type="primary" size="large" @click="saveSp">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import http from "@/utils/request";
import axios from "axios";
import global_ from "../Global.vue";
export default {
  name: "specialist",
  data() {
    return {
      imageUrl: "",
      fileLists: [],
      title: "新增专家",
      uploadData: {
        upload_img: "upload_img",
        type: "1"
      }, //上传参数
      upload_img: "upload_img", //文件上传名字
      cb_img: {}, //上传成功回调
      formItem: {
        mobile: "",
        password: "",
        nick: "",
        avatar: "",
        synopsis: "",
        record: "",
        recommend: "",
        hit_rate: ""
      },
      ruleValidate: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        nick: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
        synopsis: [{ required: true, message: "必填字段", trigger: "blur" }],
        record: [{ required: true, message: "必填字段", trigger: "blur" }],
        recommend: [{ required: true, message: "必填字段", trigger: "blur" }],
        hit_rate: [{ required: true, message: "必填字段", trigger: "blur" }]
      },
      select: [],
      isAdd: false,
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
          title: "手机号",
          key: "mobile",
          align: "center"
        },

        {
          title: "昵称",
          key: "nick",
          align: "center"
        },
        {
          title: "头像",
          key: "avatar",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.avatar
                },
                style: {
                  width: "60px",
                  height: "60px"
                }
              })
            ]);
          }
        },
        {
          title: "创建时间",
          key: "addtime",
          align: "center"
        },
        {
          title: "个人介绍",
          key: "synopsis",
          align: "center",
          width: 300
        },
        {
          title: "战绩",
          key: "record",
          align: "center",
          width: 80
        },
        {
          title: "推荐",
          key: "result",
          align: "center",
          width: 80
        },
        {
          title: "命中率",
          key: "hit_rate",
          align: "center",
          width: 80
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
                    marginRight: "50px"
                  },
                  on: {
                    click: () => {
                      this.title = "编辑";
                      this.$nextTick(() => {
                          this.$refs["formItem"].resetFields();
                        this.formItem = {
                          mobile: params.row.mobile,
                          password: "",
                          nick: params.row.nick,
                          avatar: params.row.avatar.split(
                            params.row.avatar.split("/upload")[0]
                          )[1],
                          synopsis: params.row.synopsis,
                          record: params.row.record,
                          recommend: params.row.recommend.toString(),
                          hit_rate: params.row.hit_rate,
                          id: params.row.id
                        };
                      });

                      this.imageUrl = params.row.avatar;

                      this.isAdd = true;
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "确认删除",

                        onOk: () => {
                          http
                            .post("admin/expert/expert_del", {
                              id: params.row.id
                            })
                            .then(res => {
                              if (res.code == 200) {
                                this.$Message.success(res.msg);
                                this.getList(1);
                              } else {
                                this.$message.error(res.msg);
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
  created() {
    this.getList(1);
  },
  methods: {
    submitFP() {
      this.$nextTick(() => {
        this.isAdd = false;
        this.$refs["formItem"].resetFields();
      });
    },
    uploadFile(item) {
      const formdata = new FormData();
      formdata.append("upload_img", item.file);
      formdata.append("type", 2);
      axios
        .post(global_.BASE_URL + "index/base/upload", formdata)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.imageUrl = res.data.data.http_image;
            this.$nextTick(() => {
              this.formItem.avatar = res.data.data.image;
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {});
    },

    // 保存专家
    saveSp() {
      if (this.title !== "新增专家") {
        if (this.formItem.password == "") {
          this.$Message.error("请输入密码");
          setTimeout(() => {
            this.$nextTick(() => {
              this.isAdd = true;
            });
          }, 0);
        } else {
          this.saveHttp();
        }
      } else {
        this.saveHttp();
      }
    },
    saveHttp() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/expert/expert", this.formItem).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.msg);
              this.isAdd = false;
              this.getList(1);
              this.$refs["formItem"].resetFields();
            } else {
              this.$Message.success(res.msg);
            }
          });
        }
      });
    },
    cancel() {},
    //  搜索
    searchBtn() {
      this.getList(0, this.searchText_phone);
    },
    // 新增会员
    addBtn() {
      (this.imageUrl = ""), (this.isAdd = true);
      (this.title = "新增专家"),
        this.$nextTick(() => {
          this.$refs["formItem"].resetFields();
        });
    },
    //  翻页
    changPage(index) {
      this.getList(index, this.searchText_phone);
    },

    remove(index) {
      this.data6.splice(index, 1);
    },
    // 专家列表
    getList(page, mobie) {
      http
        .post("admin/expert/expert_list", {
          page: page,
          limit: 10,
          mobile: mobie
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.dataCount = res.count;
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
}
.content .header_right {
  flex: 4;
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
