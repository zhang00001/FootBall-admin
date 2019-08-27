<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Input search placeholder="订单号" style="width: auto" v-model="orderNo" />
        <Input search placeholder="手机号" style="width: auto" v-model="mobie" />

        <Select v-model="status" style="width:200px" placeholder="状态">
          <Option value>全部</Option>
          <Option value="1">已支付</Option>
          <Option value="0">待支付</Option>
        </Select>

        <Button @click="searchBtn">搜索</Button>
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
          title: "订单号",
          key: "order_sn",
          align: "center"
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          width: 150
        },
        {
          title: "昵称",
          key: "nick",
          align: "center"
        },
        {
          title: "充值方式",
          key: "recharge_type",

          align: "center"
        },
        {
          title: "充值金额",
          key: "money",

          align: "center"
        },
        {
          title: "充值时间",
          key: "addtime",

          align: "center"
        },
        {
          title: "状态",
          key: "status",

          align: "center"
        }

        // {
        //   title: "操作",
        //   key: "operation",
        //   width: 170,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [

        //     ]);
        //   }
        // }
      ],
      tabdata: []
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    //   猜中或者猜错
    changeStatus(is_true, id) {
      http
        .post("admin/expert/programme_is_true", {
          is_true: is_true,
          id: id
        })
        .then(res => {
          if (res) {
            this.$Message.success(res.data.msg);
            this.getList(0);
          }
        });
    },
    //新增上传回调
    addMemberHeader(res) {
      if (res.code == 200) {
        this.$refs.placeholder.src = res.data.http_image;
        this.formItem.avatar = res.data.image;
      }
    },
    // 保存专家
    saveSp() {
      if (this.title !== "新增专家") {
      }
      http.post("admin/expert/expert", this.formItem).then(res => {
        if (res.code == 200) {
          this.$Message.success(res.msg);
          this.isAdd = false;
          this.getList(1);
        } else {
          this.$Message.success(res.msg);
        }
      });
    },
    cancel() {},
    //  搜索
    searchBtn() {
      this.getList(0, this.orderNo, this.mobie, this.status);
    },
    // 新增会员
    addBtn() {
      this.isAdd = true;
    },
    //  翻页
    changPage(index) {
      this.getList(index, this.searchText_phone);
    },

    remove(index) {
      this.data6.splice(index, 1);
    },
    // 列表
    getList(page, order_sn, mobile, status) {
      http
        .post("admin/money/money_list", {
          page: page,
          limit: 10,
          order_sn: order_sn,
          mobile: mobile,
          status: status
        })
        .then(res => {
          if (res.code==200) {
this.tabdata=[]
this.tabdata = res.data;
            this.dataCount = res.data.count;
            this.tabdata.forEach(val => {
              val.status == 1
                ? (val.status = "待支付")
                : (val.status = "已支付");
              val.addtime = formatDate(val.addtime);
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
