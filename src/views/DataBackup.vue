<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Button @click="sava">备份</Button>
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
  </div>
</template>

<script>
import http from "@/utils/request";
export default {
  name: "specialist",
  data() {
    return {
      select: [],
      isAdd: false,
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      tabTitle: [
        {
          title: "名称",
          key: "name",

          align: "center"
        },
        {
          title: "时间",
          key: "time",
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
                      this.$Modal.confirm({
                        title: "确认还原",

                        onOk: () => {
                          http
                            .post("admin/system/restore", {
                              name: params.row.name
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
                "还原"
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
                            .post("admin/system/del_sql", {
                              name: params.row.name
                            })
                            .then(res => {
                              if (res.code == 200) {
                                this.$Message.success(res.msg);
                                this.getList(1);
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
    cancel() {},
     changPage(index) {
      this.getList(index);
    },

    sava() {
      this.$Modal.confirm({
        title: "确认备份",

        onOk: () => {
          http.post("admin/system/backup", {}).then(res => {
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
    },
    // 列表
    getList(page) {
      http
        .post("admin/system/data_sql", {
          page: page,
          limit: 10
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata = [];
            this.dataCount=res.count
            res.data.forEach(val => {
              let time = val.split(".")[0];
              this.tabdata.push({
                name: val,
                time:
                  time.slice(0, 4) +
                  "-" +
                  time.slice(4, 6) +
                  "-" +
                  time.slice(6, 8) +
                  ":" +
                  time.slice(8, 10)
              });
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
