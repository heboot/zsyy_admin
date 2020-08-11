<template>
  <div>
    <Card>
      <p slot="title">新增题目</p>
      <div class="sear">
        <Form :model="formItem" :rules="ruleInline" :label-width="100" inline>
          <FormItem label="题目标题：" width='100%'>
            <Input v-model="subTitle" placeholder="请输入课程标题"></Input>
          </FormItem>
					<FormItem label="题型分类：" >
					  <CheckboxGroup v-model="subClass" prop="content">
					    <Checkbox :label="item.name" v-for="(item,index) in contentList" :key="index"></Checkbox>
					  </CheckboxGroup>
					</FormItem>
        </Form>
      </div>
    </Card>

  </div>
</template>

<script>
import {
  getBatchList,
  addBatch,
  getList,
  delBatch
} from "@/service/questionApi/api";
export default {
  data() {
    return {
      subTitle:"",
			subClass:"",
			contentList: [
			  { name: "心血管" },
			  { name: "糖尿病" },
			  { name: "特殊人群用药" },
			], //内容list
    };
  },
  created() {
    this.getTableData();
    this.getContractNumList();
  },
  activated() {},
  methods: {
    contractchange(e){
      console.log(e);
      this.formValidate.contractTitle=e.label;
      this.list&&this.list.forEach(el=>{
        if(el.id==e.value){
          console.log(el);
          this.formValidate.contractNum = el.contractNum;
        }
      })
    },
    // 查询所有合约列表
    getContractNumList() {
      getList().then(res => {
        console.log(res);
        this.list = res.data;
      });
    },
    search() {
      this.page = 1;
      this.getTableData();
    },
    clear() {
      for (let key in this.formItem) {
        this.formItem[key] = "";
      }
      this.getTableData();
    },
    cancel(){
      this.addModal=false;
      for(let key in this.formValidate){
        this.formValidate[key]='';
      }
    },
    del(id) {
      console.log(id);
      delBatch(id).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.isShowDelModal = false;
          this.$Message.success(res.message);
          this.getTableData();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    dateform(time) {
      console.log(time)
      var date = new Date(time);
      console.log(date)
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      // return h + ":" + minute + ":" + second;
        return y + "-" + m + "-" + d;
    },
    sure() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          addBatch({
            ...this.formValidate
          }).then(res => {
            console.log(res);
            if (res.code == 0) {
              this.$Message.success(res.message);
              this.cancel();
              this.getTableData();
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    },
    onPageChange(page) {
      this.page = page;
      this.getTableData();
    },
    getTableData() {
      let time = this.formItem.lootTime;
      if (time) {
        time = this.dateform(time);
        console.log(time);
      } else {
        time = "";
      }
      getBatchList({
        pageNum: this.page,
        pageSize: this.limit,
        lootTime: time
      }).then(res => {
        console.log(res);
        this.tableData = res.data.content;
        this.total = res.data.totalElements;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.tableHead {
  width: 100%;
  height: 50px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sear {
  display: flex;
  // justify-content: space-between;
  .btn {
    margin-left: 50px;
    margin-right: 100px;
    button:nth-child(2) {
      margin-left: 10px;
    }
    button:nth-child(3) {
      margin-left: 380px;
    }
  }
}
.ivu-page {
  margin-top: 10px;
  text-align: right;
}
.show {
  width: 600px;
  img {
    width: 100%;
  }
}
</style>
