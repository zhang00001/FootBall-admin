<template>
  <div class="content">
    <Form
      :model="formItem"
      ref="formValidate"
      :rules="ruleValidate"
      :label-width="150"
      label-position="left"
    >
      <FormItem label="分类" prop="type">
        <RadioGroup v-model="formItem.type">
          <Radio label="1">足球</Radio>
          <Radio label="2">篮球</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="单双料" prop="single_double">
        <RadioGroup v-model="formItem.single_double">
          <Radio label="1">单料</Radio>
          <Radio label="2">双料</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="赛事" style="width:1380px" prop="data_one">
        <Row>
          <Col span="12">
            <Select v-model="formItem.data_one.data.match_id" style="width:200px">
              <Option v-for="(item,index) in match" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="12" v-if="formItem.single_double=='2'">
            <Select v-model="formItem.data_two.data.match_id" style="width:200px">
              <Option v-for="(item,index) in match" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="球队" style="width:1320px" prop="data_one">
        <Row>
          <Col span="12">
            <span>主队</span>
            <Select v-model="formItem.data_one.data.team.home_team_id" style="width:80px">
              <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
            <span>vs</span>
            <span>客队</span>
            <Select v-model="formItem.data_one.data.team.visiting_team_id" style="width:80px">
              <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="12" v-if="formItem.single_double=='2'">
            <span class="team">主队</span>
            <Select v-model="formItem.data_two.data.team.home_team_id" style="width:80px">
              <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
            <span>vs</span>
            <span>客队</span>
            <Select v-model="formItem.data_two.data.team.visiting_team_id" style="width:80px">
              <Option v-for="(item,index) in Team" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="比赛时间" style="width:1380px" prop="data_one">
        <Row>
          <Col span="12">
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="比赛时间"
              v-model="formItem.data_one.data.time"
            ></DatePicker>
          </Col>

          <Col span="12" v-if="formItem.single_double=='2'">
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="比赛时间"
              v-model="formItem.data_two.data.time"
            ></DatePicker>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="赛事描述" style="width:970px">
        <Input
          v-model="formItem.describe"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="赛事描述"
        ></Input>
      </FormItem>
      <FormItem label="方案金额" style="width:400px" class="scheme_money" prop="money">
        <Input v-model="formItem.money" placeholder="方案金额" class="scheme_money_inpt" type="number"></Input>
        <span class="scheme_money_text">钻</span>
      </FormItem>
      <FormItem label="不中包退">
        <i-switch v-model="formItem.back" :true-value="1" :false-value="0" size="large">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="专家选择" prop="expert_id">
        <Select v-model="formItem.expert_id" style="width:200px">
          <Option v-for="(item,index) in expert" :value="item.id" :key="index">{{item.nick}}</Option>
        </Select>
      </FormItem>
      <FormItem label="推荐理由" style="width:980px">
        <Input
          v-model="formItem.reason"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="推荐理由"
        ></Input>
      </FormItem>
      <FormItem label="支付查看">
        <i-switch v-model="formItem.pay" :true-value="1" :false-value="0" size="large">
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
        ></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="primary" class="scheme_btn" @click="save">发布</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import http from "@/utils/request";
export default {
  name: "scheme",
  data() {
    const validatedateOne = (rule, value, callback) => {
      if (
        value.data.match_id == "" ||
        value.data.team.home_team_id == "" ||
        value.data.team.visiting_team_id == "" ||
        value.data.time == ""
      ) {
        callback(new Error("赛事、主队、客队、比赛时间不能为空"));
      } else {
        if (value.data.team.home_team_id == value.data.team.visiting_team_id) {
          callback(new Error("主队和客队不能选择相同"));
        } else {
          callback();
        }
      }
    };

    const validateExpert_id = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("专家不能为空"));
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
        data_one: {
          id: "",
          data: {
            match_id: "",
            team: { home_team_id: "", visiting_team_id: "" },
            time: ""
          }
        },
        data_two: {
          id: "",
          data: {
            match_id: "",
            team: { home_team_id: "", visiting_team_id: "" },
            time: ""
          }
        }
      },
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
        endtime: [
          {
            validator: validateEndtime,
            message: "时间不能为空",
            trigger: "change"
          }
        ]
        // data_one: [
        //   {

        //     trigger: "blur",
        // validator:    validatedateOne
        //   }
        // ],
      },

      expert: [], //专家列表
      Team: [], //球队列表
      match: [] //赛事列表
    };
  },
  created() {
    // 获取下拉数据
    this.getSelectData();
  },
  methods: {
    save() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (this.formItem.data_one.data.match_id == "") {
            return this.$Message.warning("请选择赛事");
          }
          if (
            this.formItem.data_one.data.team.home_team_id == "" ||
            this.formItem.data_one.data.team.visiting_team_id == ""
          ) {
            return this.$Message.warning("主队和客队不能为空");
          }
          if (
            this.formItem.data_one.data.team.home_team_id ==
            this.formItem.data_one.data.team.visiting_team_id
          ) {
            return this.$Message.warning("主队和客队不能相同");
          }
          if (this.formItem.data_one.data.time == "") {
            return this.$Message.warning("比赛时间不能为空");
          }
          if (this.formItem.single_double == "2") {
            if (this.formItem.data_two.data.match_id == "") {
              return this.$Message.warning("请选择赛事");
            }
            if (
              this.formItem.data_two.data.team.home_team_id == "" ||
              this.formItem.data_two.data.team.visiting_team_id == ""
            ) {
              return this.$Message.warning("主队和客队不能为空");
            }
            if (
              this.formItem.data_two.data.team.home_team_id ==
              this.formItem.data_two.data.team.visiting_team_id
            ) {
              return this.$Message.warning("主队和客队不能相同");
            }
            if (this.formItem.data_two.data.time == "") {
              return this.$Message.warning("比赛时间不能为空");
            }
          }

          this.formItem.endtime =
            new Date(this.formItem.endtime).getTime() / 1000;
          this.formItem.data_one.data.time =
            new Date(this.formItem.data_one.data.time).getTime() / 1000;
          this.formItem.data_two.data.time =
            new Date(this.formItem.data_two.data.time).getTime() / 1000;

          http.post("admin/expert/programme", this.formItem).then(res => {
            if (res.data.code == 200) {
              this.$Message.success(res.data.msg);
              // this.formItem=Object.assign({},this.$options.data().form)
            }
          });
        } else {
        }
      });
    },
    checkData() {
      if (this.formItem.single_double == "2") {
      }
    },
    getSelectData() {
      http.post("admin/expert/data_list", { type: 1 }).then(res => {
        this.match = res.data;
      });
      http.post("admin/expert/data_list", { type: 2 }).then(res => {
        this.Team = res.data;
      });
      http.post("admin/expert/data_list", { type: 3 }).then(res => {
        this.expert = res.data;
      });
    }
  }
};
</script>

<style scoped>
.scheme_money_inpt {
  width: 80%;
}
.scheme_money_text {
  display: inline-block;
  padding-left: 10px;
}
.content {
  padding: 0 100px;
}
.content >>> .scheme_btn {
  margin-top: 20px;
  margin-left: 20px;
  width: 300px;
}
</style>


