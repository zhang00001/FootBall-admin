<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
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
        <Form-item label="排序" prop="order">
          <Input v-model="formItem.order" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="图片" prop="img">
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
        <Form-item label="跳转链接" prop="url">
          <Input v-model="formItem.url" placeholder="请输入"></Input>
        </Form-item>
        <Form-item label="状态" prop="status">
          <Radio-group v-model="formItem.status">
            <Radio label="1">启用</Radio>
            <Radio label="0">关闭</Radio>
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
      uploadData: {
        upload_img: "upload_img",
        type: "1"
      }, //上传参数
      upload_img: "upload_img", //文件上传名字
      cb_img: {}, //上传成功回调
      formItem: {
        status: "",
        url: "",
        img: "",
        title: "",
        order: ""
      },
      ruleValidate: {
        status: [{ required: true, message: "必填", trigger: "blur" }],
        url: [{ required: true, message: "必填", trigger: "blur" }],

        img: [{ required: true, message: "必填", trigger: "blur" }],
        title: [{ required: true, message: "必填", trigger: "blur" }],
        order: [{ required: true, message: "必填", trigger: "blur" }]
      },
      select: [],
      isAdd: false,
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      tabTitle: [
        {
          title: "Id",
          key: "id",
          width: "65",
          align: "center"
        },
         {
          title: "排序",
          key: "order",
          width: "65",
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "图片",
          key: "img",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: params.row.img
                },
                style: {
                  width: "120px",
                  height: "60px"
                }
              })
            ]);
          }
        },
        {
          title: "跳转链接",
          key: "url",
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
          width: 270,
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
                        this.formItem = {
                          status:
                            params.row.status == "启用"
                              ? (params.row.status = "1")
                              : (params.row.status = "0"),
                          url: params.row.url,
                          img: params.row.img.split(
                            params.row.img.split("/upload")[0]
                          )[1],
                          title: params.row.title,
                          order: params.row.order.toString(),

                          id: params.row.id
                        };
                      });

                      this.imageUrl = params.row.img;

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
                            .post("admin/operate/banner_del", {
                              id: params.row.id
                            })
                            .then(res => {
                              if (res.code == 200) {
                                this.$message.success(res.msg);
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
    // 保存
    saveSp() {
       
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          http.post("admin/operate/banner", this.formItem).then(res => {
            if (res.code==200) {
              this.$Message.success(res.msg);
              this.isAdd = false;
              this.getList(1);
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
      this.getList(0, this.type, this.name);
    },
    // 新增
    addBtn() {
      this.isAdd = true;
      (this.imageUrl = ""),
        (this.title = "新增"),
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
    uploadFile(item) {
      const formdata = new FormData();
      formdata.append("upload_img", item.file);
      formdata.append("type", 4);
      axios
        .post(global_.BASE_URL + "index/base/upload", formdata)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.imageUrl = res.data.data.http_image;
            this.$nextTick(() => {
              this.formItem.img = res.data.data.image;
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {});
    },
    // 列表
    getList(page) {
      http
        .post("admin/operate/banner_list", {
          page: page,
          limit: 10
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.dataCount = res.data.count;
            this.tabdata.forEach(val => {
              //  val.status==1? val.status='启用':val.status='禁用'
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

