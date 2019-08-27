<template v-for="(item,index) in showList">
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Input search placeholder="手机号" style="width: auto" v-model="searchText_phone" />
        <Input search placeholder="昵称" style="width: auto" v-model="searchText_nick" />
        <Button @click="searchBtn">搜索</Button>
      </div>
      <div class="header_right">
        <Button @click="addMemberBtn">添加会员</Button>
      </div>
    </div>
    <!-- 表格 -->
    <Table border :columns="tabTitle" :data="showList" class="table"></Table>
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
    <Modal
      v-model="isAddMember"
      class-name="vertical-center-modal"
      :closable="false"
      :title="title"
    >
      <Form :model="oneData" :label-width="80" ref="oneData" :rules="ruleValidate">
        <FormItem label="手机号" prop="mobile">
          <Input v-model="oneData.mobile" placeholder></Input>
        </FormItem>
        <FormItem label="昵称" prop="nick">
          <Input v-model="oneData.nick" placeholder></Input>
        </FormItem>
        <FormItem label="头像" prop="avatar">
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
        </FormItem>

        <FormItem label="姓名" prop="name">
          <Input v-model="oneData.name" placeholder></Input>
        </FormItem>
        <FormItem label="身份证号" prop="card">
          <Input v-model="oneData.card" placeholder></Input>
        </FormItem>

        <FormItem label="钻石" prop="money">
          <Input v-model="oneData.money" placeholder></Input>
        </FormItem>
        <FormItem label="累计充值" prop="recharge_total">
          <Input v-model="oneData.recharge_total" placeholder></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="oneData.status">
            <Radio label="启用"></Radio>
            <Radio label="冻结"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" class="user_btn">
        <Button @click="addPreserve" class="btn">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import http from "@/utils/request";
import axios from "axios";
import { formatDate } from "@/utils/date";
import global_ from "../Global.vue";
export default {
  name: "memberlist",
  data() {
    return {
      title: "新增会员",
      imageUrl: "",
      fileLists: [],
      searchText_phone: "", //搜索手机
      searchText_nick: "", //搜索昵称
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      isUserJurisdiction: false, //is弹出层
      state: "", //状态
      id: "",
      oneData: {
        mobile: "",
        nick: "",
        avatar: "",
        name: "",
        card: "",
        addtime: "",
        money: "",
        recharge_total: "",
        status: ""
      },
      isAddMember: false, //is新增遮早
      isChange: "",
      ruleValidate: {
        mobile: [
          { required: true, trigger: "blur", message: "手机号必填" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        nick: [{ required: true, trigger: "blur", message: "昵称必填" }],
        avatar: [{ required: true, trigger: "blur", message: "请上传头像" }],
        name: [{ required: true, trigger: "blur", message: "必填字段" }],
        card: [{ required: true, trigger: "blur", message: "必填字段" }],
        money: [{ required: true, trigger: "blur", message: "必填字段" }],
        recharge_total: [
          { required: true, trigger: "blur", message: "必填字段" }
        ],
        status: [{ required: true, trigger: "blur", message: "必填字段" }]
      },
      tabTitle: [
        { title: "序号", key: "id", width: "70", align: "center" },
        { title: "手机号", key: "mobile", align: "center", width: "150" },
        { title: "昵称", key: "nick", align: "center", width: "100" },
        {
          title: "头像",
          key: "avatar",
          width: "100",
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
        { title: "姓名", key: "name", align: "center", width: "100" },
        { title: "身份证号", key: "card", align: "center", width: "200" },
        { title: "注册时间", key: "addtime", align: "center", width: "200" },
        { title: "钻石", key: "money", align: "center", width: "100" },
        {
          title: "累计充值",
          key: "recharge_total",
          align: "center",
          width: "100"
        },
        { title: "优惠卷", key: "coupon", align: "center", width: "100" },
        { title: "状态", key: "status", align: "center", width: "100" },
        {
          title: "操作",
          key: "operation",
          align: "center",
          width: 200,
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
                      this.show(params);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      menberList: [],
      showList: []
    };
  },
  created() {
    this.getMemberList(1, this.searchText_phone, this.searchText_nick);
  },
  methods: {
    // 页码改变
    changPage(index) {
      this.getList(index, this.searchText_phone, this.searchText_nick);
    },
    //模糊查找
    searchBtn() {
      this.getMemberList(1, this.searchText_phone, this.searchText_nick);
    },
    // click编辑
    show(e) {
      this.isAddMember = true;
      this.title = "编辑";
 
      this.$nextTick(() => {
         this.$refs["oneData"].resetFields();
        this.oneData = {
          mobile: e.row.mobile,
          nick: e.row.nick,
          avatar: e.row.avatar.split(e.row.avatar.split("/upload")[0])[1]?e.row.avatar.split(e.row.avatar.split("/upload")[0])[1]:e.row.avatar.split(e.row.avatar.split("/static")[0])[1],
          name: e.row.name,
          card: e.row.card,
          addtime: e.row.addtime,
          money: e.row.money,
          recharge_total: e.row.recharge_total,
          status: e.row.status
        };
        this.imageUrl = e.row.avatar;
        this.oneData.id = e.row.id;
      });
    },

    uploadFile(item) {
      const formdata = new FormData();
      formdata.append("upload_img", item.file);
      formdata.append("type", 1);
      axios
        .post(global_.BASE_URL + "index/base/upload", formdata)
        .then(res => {
          if (res.data.code == 200) {
        
            this.$message.success(res.data.msg);
            this.imageUrl = res.data.data.http_image;
            this.$nextTick(() => {
              this.oneData.avatar = res.data.data.image;
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {});
    },
    // 新增保存
    addPreserve() {
   
      this.$refs["oneData"].validate(valid => {
        if (valid) {
          http.post("admin/user/user", this.oneData).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.msg);
              this.isAddMember = false;
              this.getMemberList(
                1,
                this.searchText_phone,
                this.searchText_nick
              );
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      });
    },
    // 新增会员
    addMemberBtn() {
      this.isAddMember = true;
      this.title = "新增会员";
      this.$nextTick(() => {
        this.imageUrl = "";
        this.$refs["oneData"].resetFields();
      });
    },
    // 获取会员列表
    getMemberList(page, mobile, nick) {
      http
        .post("admin/user/user_list", {
          page: page,
          limit: 10,
          mobile: mobile,
          nick: nick
        })
        .then(res => {
          if (res.code==200) {
            this.showList=[]
            this.showList = res.data;
            this.dataCount = res.count;
            this.showList.forEach(val => {
              val.addtime = formatDate(val.addtime);
              val.status == "1" ? (val.status = "启用") : (val.status = "冻结");
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.content >>> .header {
  display: flex;
  margin-bottom: 18px;
}
.content >>> .header_left {
  flex: 2;
  display: flex;
  justify-content: space-between;
}
.content >>> .header_right {
  flex: 4;
  display: flex;
  justify-content: flex-end;
}
.content >>> .ivu-table-cell img {
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
}
.ivu-table-wrapper {
  min-height: 750px;
}
.pageSorter {
  margin-top: 20px;
  margin-bottom: 20px;
}
.user_info_jdt {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.user_info_jdt input {
  margin: 10px;
  height: 30px;
}
.user_info_jdt_item_img {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  height: 100%;
}
.user_info_jdt_item_img img {
  width: 80px;
  height: 81px;
}
.content >>> .ivu-radio-group {
  margin-left: 201px;
  margin-right: 92px;
}
.user_btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  width: 200px;
}
.content >>> .table table {
  /* table-layout: auto;  */
  width: 100% !important;
}
.up_data {
  padding: 0;
  border: none;
  height: 81px;
}
.user_info_jdt_item {
  display: flex;
  justify-content: space-between;
}
.user_info_jdt_item >>> .ivu-radio-wrapper {
  margin-left: 10px;
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