<template>
  <div class="content">
    <div class="header">
      <div class="header_left">
        <Select v-model="type" style="width:200px" placeholder="分类"  @on-change='change_status'>
          <Option value='0'>全部</Option>
          <Option value="1">足球</Option>
          <Option value="2">篮球</Option>
        </Select>
<Select v-model="matchId" style="width:200px" placeholder="赛事" clearable >
            <Option v-for="(item,index) in matchs" :value="item.id" :key="index">{{item.name}}</Option>
        </Select>


        <!-- <Input search placeholder="赛事" style="width: auto" v-model="match_id" /> -->

        <Select v-model="status" style="width:200px" placeholder="状态">
          <Option value>全部</Option>
          <Option value="1">进行中</Option>
          <Option value="2">已结束</Option>
        </Select>
        <Select v-model="is_true" style="width:200px" placeholder="猜中/猜错">
          <Option value>全部</Option>
          <Option value="1">猜中</Option>
          <Option value="2">猜错</Option>
        </Select>
        <Button @click="searchBtn">搜索</Button>
        <Button @click="addBtn">新增</Button>
      </div>
    </div>
    <Table style="width:1600px" border :columns="tabTitle" :data="tabdata"></Table>
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
      v-model="isAdd"
      :title="title"
      class-name="vertical-center-modal"
      :closable="false"
      width="960"
    >
      <Form
        :model="formItem"
        ref="formItem"
        :rules="ruleValidate"
        :label-width="100"
        label-position="right"
        style="width:660px;"
      >
        <FormItem label="分类" prop="type">
          <RadioGroup v-model="formItem.type" @on-change="changeOption">
            <Radio label="1" :disabled="isScore">足球</Radio>
            <Radio label="2" :disabled="isScore">篮球</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="单双料" prop="single_double">
          <RadioGroup v-model="formItem.single_double">
            <Radio label="1" :disabled="isScore">单料</Radio>
            <Radio label="2" :disabled="isScore">双料</Radio>
          </RadioGroup>
        </FormItem>

        <Row>
          <Col span="12">
            <FormItem prop="matchs1" label="赛事">
              <Select v-model="formItem.matchs1" style="width:200px" :disabled="isScore">
                <Option v-for="(item,index) in match" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12" v-if="formItem.single_double=='2'">
            <FormItem prop="matchs2">
              <Select v-model="formItem.matchs2" style="width:200px" :disabled="isScore">
                <Option v-for="(item,index) in match" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="球队">
          <Row>
            <Col span="12" style="display: flex;">
              <span>主队</span>
              <FormItem prop="team1">
                <Select v-model="formItem.team1" style="width:80px" :disabled="isScore">
                  <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>

              <span>vs</span>
              <span>客队</span>
              <FormItem prop="visiteam1">
                <Select v-model="formItem.visiteam1" style="width:80px" :disabled="isScore">
                  <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="formItem.single_double=='2'" style="display: flex;">
              <span class="team">主队</span>
              <FormItem prop="team2">
                <Select v-model="formItem.team2" style="width:80px" :disabled="isScore">
                  <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
              <span>vs</span>
              <span>客队</span>
              <FormItem prop="visiteam2">
                <Select v-model="formItem.visiteam2" style="width:80px" :disabled="isScore">
                  <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="比分" v-if="isScore">
          <Row>
            <Col span="12" style="display:flex">
              <span>主队</span>

              <Input v-model="home_vs1" placeholder="主队比分" style="width:70px;"></Input>

              <span>vs</span>
              <span>客队</span>
              <Input v-model="home_vs2" placeholder="主队比分" style="width:70px;"></Input>
            </Col>
            <Col span="12" style="display:flex" v-if="formItem.single_double=='2'">
              <span>主队</span>

              <Input v-model="home_vs3" placeholder="主队比分" style="width:70px;"></Input>

              <span>vs</span>
              <span>客队</span>
              <Input v-model="home_vs4" placeholder="主队比分" style="width:70px;"></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="比赛时间" prop="time1">
          <Row>
            <Col span="12">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="比赛时间"
                v-model="formItem.time1"
                :disabled="isScore"
              ></DatePicker>
            </Col>

            <Col span="12" v-if="formItem.single_double=='2'">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="比赛时间"
                v-model="formItem.time2"
                :disabled="isScore"
              ></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="赛事描述" style="width:970px" prop="describe">
          <Input
            v-model="formItem.describe"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="赛事描述"
            style="width:600px;"
            :disabled="isScore"
          ></Input>
        </FormItem>
        <FormItem label="方案金额" style="width:400px;" class="scheme_money" prop="money">
          <Row>
            <Col span="12">
              <Input
                v-model="formItem.money"
                placeholder="方案金额"
                class="scheme_money_inpt"
                type="number"
                :disabled="isScore"
              ></Input>
            </Col>
            <Col span="12">
              <span class="scheme_money_text" style="margin-left:10px;">钻</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="不中包退">
          <i-switch
            v-model="formItem.back"
            :true-value="1"
            :false-value="0"
            size="large"
            :disabled="isScore"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="专家选择" prop="expert_id">
          <Select v-model="formItem.expert_id" style="width:200px" :disabled="isScore">
            <Option v-for="(item,index) in expert" :value="item.id" :key="index">{{item.nick}}</Option>
          </Select>
        </FormItem>
        <FormItem label="推荐理由" style="width:980px" prop="reason">
          <Input
            v-model="formItem.reason"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="推荐理由"
            style="width:600px;"
            :disabled="isScore"
          ></Input>
        </FormItem>
        <FormItem label="支付查看">
          <i-switch
            v-model="formItem.pay"
            :true-value="1"
            :false-value="0"
            size="large"
            :disabled="isScore"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="售卖截止" prop="endtime">
          <DatePicker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="比赛时间"
            v-model="formItem.endtime"
            :disabled="isScore"
          ></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" v-if="!isScore" @click="save">确定</Button>
        <Button type="primary" v-if="isScore" @click="guessing('1')">猜中</Button>
        <Button type="primary" v-if="isScore" @click="guessing('2')">猜错</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import http from "@/utils/request";
import { formatDate } from "@/utils/date";
import { type } from "os";
export default {
  name: "specialist",
  data() {
    const validateExpert_id = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("专家不能为空"));
      } else {
        callback();
      }
    };
    const validateMatchs1 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("赛事不能为空"));
      } else {
        callback();
      }
    };
    const validateMatchs2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("赛事不能为空"));
      } else {
        callback();
      }
    };
    const validateTeam1 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("主队不能为空"));
      } else {
        callback();
      }
    };
    const validateVisiteam1 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("客队不能为空"));
      } else {
        if (value == this.formItem.team1) {
          callback(new Error("客队不能和主队相同"));
        } else {
          callback();
        }
      }
    };
    const validateTime1 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("比赛时间不能为空"));
      } else {
        callback();
      }
    };
    const validateTeam2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("主队不能为空"));
      } else {
        callback();
      }
    };
    const validateVisiteam2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("客队不能为空"));
      } else {
        callback();
      }
    };
    const validateTime2 = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("比赛时间不能为空"));
      } else {
        callback();
      }
    };
    const validateEndtime = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("截止时间不能为空"));
      } else {
        callback();
      }
    };
    return {
      model1: "",
      title: "新增",
      type: "",
      status: "",
      is_true: "",
      match_id: "",
      home_vs1: "",
      home_vs2: "",
      home_vs3: "",
      home_vs4: "",
      matchId:"",
      formItem: {
        type: "1", //分类
        single_double: "1", //单双料
        describe: "", //描述
        money: "", //方案金额
        back: 1,
        expert_id: "",
        reason: "",
        pay: 1,
        endtime: "",
        matchs1: "", //赛事1
        matchs2: "", //赛事2
        team1: "", //主队1
        visiteam1: "", //客队1
        team2: "", //主队2
        visiteam2: "", //客队2
        time1: "",
        time2: "",
        dataId1: "",
        dataId2: ""
      },
      matchs:[],
      ruleValidate: {
        describe: [
          { required: true, message: "描述不能为空", trigger: "blur" }
        ],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
        expert_id: [
          {
            validator: validateExpert_id,
            message: "专家不能为空",
            trigger: "change"
          }
        ],
        matchs1: [
          {
            validator: validateMatchs1,
            message: "赛事不能为空",
            trigger: "change"
          }
        ],
        matchs2: [
          {
            validator: validateMatchs2,
            message: "赛事不能为空",
            trigger: "change"
          }
        ],
        team1: [
          {
            validator: validateTeam1,
            message: "主队不能为空",
            trigger: "change"
          }
        ],
        visiteam1: [
          {
            validator: validateVisiteam1,
            message: "客队不能为空",
            trigger: "change"
          }
        ],
        time1: [
          {
            validator: validateTime1,
            message: "比赛时间不能为空",
            trigger: "change"
          }
        ],
        team2: [
          {
            validator: validateTeam2,
            message: "主队不能为空",
            trigger: "change"
          }
        ],
        visiteam2: [
          {
            validator: validateVisiteam2,
            message: "客队不能为空",
            trigger: "change"
          }
        ],
        time2: [
          {
            validator: validateTime2,
            message: "比赛时间不能为空",
            trigger: "change"
          }
        ],
        endtime: [
          {
            validator: validateEndtime,
            message: "时间不能为空",
            trigger: "change"
          }
        ]
      },
      isScore: false,
      expert: [], //专家列表
      Team: [], //球队列表
      match: [], //赛事列表
      select: [],
      isAdd: false,
      selectDateId: "",
      dataCount: 0, //所有条数
      pageSize: 10, //每页显示条数
      searchText_phone: "",
      tabTitle: [
        {
          title: "序号",
          key: "id",
          width: "65",
          align: "center",
          fixed: "left"
        },
        {
          title: "分类",
          key: "type",
          align: "center",
          width: "65"
        },
        {
          title: "单双料",
          key: "single_double",
          align: "center",
          width: 80
        },
        {
          title: "赛事1",
          key: "matchs1",
          align: "center",
          width: "90"
        },
        {
          title: "球队1",
          key: "team1",
          width: 220,
          align: "center"
        },
        {
          title: "比分1",
          key: "score1",
          width: 80,
          align: "center"
        },
        {
          title: "赛事2",
          key: "matchs2",
          width: 80,
          align: "center"
        },
        {
          title: "球队2",
          key: "team2",

          align: "center",
          width: 220
        },
        {
          title: "比分2",
          key: "score2",

          align: "center",
          width: 80
        },
        {
          title: "赛事描述",
          key: "describe",

          align: "center",
          width: 120
        },
        {
          title: "方案金额",
          key: "money",
          align: "center",
          width: 120
        },
        {
          title: "不中包退",
          key: "back",
          align: "center",

          width: 120
        },
        {
          title: "推荐专家",
          key: "expert_id",
          align: "center",
          width: 120
        },
        {
          title: "推荐理由",
          key: "reason",
          align: "center",
          width: 120
        },
        {
          title: "支付查看",
          key: "pay",
          align: "center",
          width: 120
        },
        {
          title: "售卖截止",
          key: "endtime",
          align: "center",
          width: 120
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 100
        },
        {
          title: "操作",
          key: "operation",
          width: 200,
          align: "center",
          fixed: "right",
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
                      this.isScore = false;
                      this.selectDateId = params.row.id;
                      this.title = "编辑";
                      this.getSingleDate(params.row.id);
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
                      this.selectDateId = params.row.id;
                      this.title = "猜比分";
                      this.getSingleDate(params.row.id);
                      this.isScore = true;
                    }
                  }
                },
                "猜比分"
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
    this.getMatchs(0)
    this.getSelectData(this.formItem.type);
  },
  methods: {
    change_status(e){
 
this.getMatchs(e)
    },
   getMatchs(select){
http.post("admin/expert/data_list",{
  type:1,
select:select
}).then(res=>{
 
this.matchs=res.data
})
   },
    guessing(e) {
      http
        .post("admin/expert/programme_is_true", {
          is_true: e,
          id: this.selectDateId,

          data_one_vs: {
            id: this.formItem.dataId1,
            status: this.formItem.dataOneStatus,
            vs: {
              home_vs: this.home_vs1,
              visiting_vs: this.home_vs2
            }
          },
          data_two_vs: {
            id: this.formItem.dataId2,
            status: this.formItem.dataTwoStatus,
            vs: {
              home_vs: this.home_vs3,
              visiting_vs: this.home_vs4
            }
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.$Message.success(res.msg);
          }
        });
    },
    save() {
      if (this.formItem.single_double == "2") {
      }
      this.$refs["formItem"].validate(valid => {
        if (valid) {
        
          let data = {
            type: this.formItem.type,
            single_double: this.formItem.single_double,
            describe: this.formItem.describe,
            money: this.formItem.money,
            back: this.formItem.back,
            expert_id: this.formItem.expert_id,
            reason: this.formItem.reason,
            pay: this.formItem.pay,
            endtime: new Date(this.formItem.endtime).getTime() / 1000,
            data_one: {
              id: this.formItem.dataId1,
              data: {
                match_id: this.formItem.matchs1,
                team: {
                  home_team_id: this.formItem.team1,
                  visiting_team_id: this.formItem.visiteam1
                },
                time: new Date(this.formItem.time1).getTime() / 1000
              }
            },
            data_two: {
              id: this.formItem.dataId2,
              data: {
                match_id: this.formItem.matchs2,
                team: {
                  home_team_id: this.formItem.team2,
                  visiting_team_id: this.formItem.visiteam2
                },
                time: this.formItem.time2
                  ? new Date(this.formItem.time2).getTime() / 1000
                  : ""
              }
            }
          };

          if (this.title == "编辑") {
            data.id = this.selectDateId;
            if (data.single_double == "1") {
              (data.data_two.data.match_id = ""),
                (data.data_two.data.team.home_team_id = ""),
                (data.data_two.data.team.visiting_team_id = ""),
                (data.data_two.data.time = ""),
                (data.data_two.status = "0");
            }
          }
          http.post("admin/expert/programme", data).then(res => {
            if (res.code == 200) {
              this.$Message.success(res.msg);
              this.isAdd = false;
              this.getList(0);
            }
          });
        } else {
        }
      });
    },
    getSingleDate(e) {
      http
        .post("admin/expert/programme_find", {
          id: e
        })
        .then(res => {
          this.$nextTick(() => {
            this.formItem = {
              type: res.data.type.toString(), //分类
              single_double: res.data.single_double.toString(), //单双料
              describe: res.data.describe, //描述
              money: res.data.money, //方案金额
              back: res.data.back,
              expert_id: res.data.expert_id,
              reason: res.data.reason,
              pay: res.data.pay,
              endtime: formatDate(res.data.endtime),
              dataId1: res.data.data_one.id,
              dataId2: res.data.data_two.id,
              matchs2: Number(res.data.data_two.data.match_id),
              matchs1: Number(res.data.data_one.data.match_id),
              team1: Number(res.data.data_one.data.team.home_team_id),
              visiteam1: Number(res.data.data_one.data.team.visiting_team_id),
              team2: Number(res.data.data_two.data.team.home_team_id),
              visiteam2: Number(res.data.data_two.data.team.visiting_team_id),
              time1: formatDate(res.data.data_one.data.time),
              time2: formatDate(res.data.data_two.data.time),
              dataOneStatus: res.data.data_one.status,
              dataTwoStatus: res.data.data_two.status
            };
          });
        });
      this.isAdd = true;
    },
    getSelectData(e) {
      http.post("admin/expert/data_list", { type: 1, select: e }).then(res => {
        this.match = res.data;
      });
      http.post("admin/expert/data_list", { type: 2, select: e }).then(res => {
        this.Team = res.data;
      });
      http.post("admin/expert/data_list", { type: 3, select: e }).then(res => {
        this.expert = res.data;
      });
    },

    //  搜索
    searchBtn() {
      this.getList(0, this.type, this.matchId, this.status, this.is_true);
    },
    // 新增
    addBtn() {
      this.$nextTick(() => {
        this.$refs["formItem"].resetFields();
      });
      this.isScore = false;
      this.isAdd = true;
      this.title = "新增";
    },
    //  翻页
    changPage(index) {
      this.getList(index, this.searchText_phone);
    },

    remove(index) {
      this.data6.splice(index, 1);
    },
    changeOption(e) {
      this.getSelectData(e);
    },
    // 列表
    getList(page, type,match_id,status,is_true) {
      http
        .post("admin/expert/programme_list", {
          page: page,
          limit: 10,
          type: type,
          match_id:match_id,
          status:status,
          is_true:is_true
        })
        .then(res => {
          if (res.code==200) {
            this.tabdata=[]
            this.tabdata = res.data;
            this.dataCount = res.data.count;
            this.tabdata.forEach((val, index) => {
              val.endtime = formatDate(val.endtime);
              val.matchs1 = res.data[index].data_one.data.match_name;
              val.matchs2 = res.data[index].data_two.data.match_name;
              val.status == "1"
                ? (val.status = "进行中")
                : (val.status = "已结束");
              val.back == "1" ? (val.back = "是") : (val.back = "否");
              val.pay == "1" ? (val.pay = "是") : (val.pay = "否");
              val.score1 = res.data[index].data_one.vs
                ? res.data[index].data_one.vs.home_vs +
                  "-" +
                  res.data[index].data_one.vs.visiting_vs
                : "";
              val.score2 = res.data[index].data_two.vs
                ? res.data[index].data_two.vs.home_vs +
                  "-" +
                  res.data[index].data_two.vs.visiting_vs
                : "";
              val.team1 =
                res.data[index].data_one.name.home_team_id +
                "-" +
                res.data[index].data_one.name.visiting_team_id;
              if (res.data[index].data_two.name) {
                val.team2 =
                  res.data[index].data_two.name.home_team_id +
                  "-" +
                  res.data[index].data_two.name.visiting_team_id;
              }

              val.type == 1 ? (val.type = "足球") : (val.type = "篮球");
              val.single_double == 1
                ? (val.single_double = "单料")
                : (val.single_double = "双");
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
