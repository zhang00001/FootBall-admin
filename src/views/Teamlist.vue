<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Select v-model="type" style="width:200px" placeholder="分类">
          <Option value>全部</Option>
          <Option value="1">足球</Option>
          <Option value="2">篮球</Option>
        </Select>
        <Input search placeholder="名称" style="width: auto" v-model="name" />

        <Button @click="searchBtn">搜索</Button>
        <Button @click="addBtn">新增</Button>
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
        <Form-item label="分类" prop="type">
          <Select v-model="formItem.type" placeholder="请选择">
            <Option value="1">足球</Option>
            <Option value="2">篮球</Option>
          </Select>
        </Form-item>
        <Form-item label="名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="略缩图" prop="thumbnail">
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
        <Form-item label="状态" prop="status">
          <Radio-group v-model="formItem.status">
            <Radio label="1">启用</Radio>
            <Radio label="2">关闭</Radio>
          </Radio-group>
        </Form-item>
      </Form>
      <div slot="footer" class="user_btn">
        <Button @click="saveSp">确定</Button>
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
      type: "",
      name: "",
      model1: "",
      title: "新增",

      formItem: {
        type: "",
        name: "",
        thumbnail: "",
        status: ""
      },
      ruleValidate: {
        type: [{ required: true, message: "必填", trigger: "blur" }],
        name: [{ required: true, message: "必填", trigger: "blur" }],
        thumbnail: [{ required: true, message: "必填", trigger: "blur" }],
        status: [{ required: true, message: "必填", trigger: "blur" }]
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
          title: "分类",
          key: "type",
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "略缩图",
          key: "thumbnail",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.thumbnail
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
                    marginRight: "50px"
                  },
                  on: {
                    click: () => {
                      http
                        .post("admin/match/team_find", { id: params.row.id })
                        .then(res => {
                          this.$nextTick(() => {
                            this.title = "编辑";
                            this.$refs["formItem"].resetFields();
                            this.formItem = {
                              type: res.data.type.toString(),
                              name: res.data.name,
                              status: res.data.status.toString(),
                              id: params.row.id,
                              thumbnail: params.row.thumbnail.split(
                                params.row.thumbnail.split("/upload")[0]
                              )[1]
                            };
                          });
                        });

                      this.imageUrl = params.row.thumbnail;

                      this.isAdd = true;
                    }
                  }
                },
                "编辑"
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
    uploadFile(item) {
      const formdata = new FormData();
      formdata.append("upload_img", item.file);
      formdata.append("type", 3);
      axios
        .post(global_.BASE_URL + "index/base/upload", formdata)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.imageUrl = res.data.data.http_image;
            this.$nextTick(() => {
              this.formItem.thumbnail = res.data.data.image;
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {});
    },

    // 保存
    saveSp() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/match/team", this.formItem).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.msg);
              this.isAdd = false;
              this.getList(1, this.type, this.name);
              this.$nextTick(() => {
                this.$refs["formItem"].resetFields();
              });
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    cancel() {},
    //  搜索
    searchBtn() {
      this.getList(0, this.type, this.name);
    },
    // 新增
    addBtn() {
      this.$nextTick(() => {
        this.$refs["formItem"].resetFields();
        (this.imageUrl = ""), (this.title = "新增"), (this.isAdd = true);
      });
    },
    //  翻页
    changPage(index) {
      this.getList(index, this.searchText_phone);
    },

    // 列表
    getList(page, type, name) {
      http
        .post("admin/match/team_list", {
          page: page,
          limit: 10,
          type: type,
          name: name
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata = [];
            this.tabdata = res.data;
            this.dataCount = res.data.count;
            this.tabdata.forEach(val => {
              val.type == 1 ? (val.type = "足球") : (val.type = "篮球");
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
  /* justify-content: space-between; */
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
