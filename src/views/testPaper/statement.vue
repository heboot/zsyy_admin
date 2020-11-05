<template>
  <div>
    <Card>
      <p slot="title">报表</p>
      <div class="sear">
        <Form :model="formItem" :label-width="100" inline>
          <!-- <FormItem label="用户名字" class="searchInput">
            <Input v-model="formItem.bankTitle" placeholder="请输入用户名字"></Input>
          </FormItem> -->
          <FormItem label="选择导出试卷" class="searchInput">
            <Select style="width:400px;" v-model="formItem.testId">
                <Option :value="item.id" v-for="(item,index) in testTitleList" :key="index"  >{{item.testTitle}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="btn">
          <Button type="primary" @click="search">
            <Icon type="ios-search" style="font-size:16px" />导出
          </Button>
          <!-- <Button type="default" style="margin-left:10px" @click="clear">
            <Icon type="ios-undo" style="font-size:16px" />重置
          </Button> -->
        </div>
      </div>
        
      <div class="tableHead">
        <div style="font-weight:700;">数据列表</div>
      </div>
      <Table :columns="tableColumns" :data="tableData" border></Table>
      <Page :total="total" :current="page" :page-size="limit" show-total @on-change="onPageChange" />
    </Card>
    <Modal v-model="picModal">
      <div class="maxpic">
        <img :src="maxPics" class="maxPicture" alt />
      </div>
    </Modal>
  </div>
</template>

<script>
import {getUserClass} from "@/service/questionApi/api";
import {testList,statement,statementExcel} from "@/service/testPaperApi/api";
export default {
  data() {
    return {
      testTitleList:[],
      userType: [],
      maxPics: "",
      picModal: false,
      imgUploadLoading: false,
      uploadData: {},
      uploadImgUrl: `${this.host}/admin/upload/oss/image`,
      updateModal: false,
      userList: [],
      editModal: false,
      total: 0,
      page: 1,
      limit: 10,
      error: false,
      formItem: {
        bankTitle: "",
        testId:""
      },
      typeList: [],
      tableData: [],
      tableColumns: [
        {
          title: "姓名",
          key: "realName"
        },
         {
          title: "手机",
          key: "phone"
        },
         {
          title: "试卷",
          key: "testName"
        },
        {
          title: "得分",
          key: "source"
        },
        {
          title: "状态",
          key: "testStatus"
        },
        {
          title: "参考时间",
          key: "createTime"
        },
      ],
      updateValidate: {
        id: "",
        bankTitle: "",
        userType: "",
        imgUrl: ""
      },
      rulesUpdate: {
        bankTitle: [
          {
            required: true,
            message: "题库标题不能为空",
            trigger: "blur"
          }
        ],
        userType: [
          {
            required: true,
            message: "题库分类不能为空",
            trigger: "change",
            type: "number"
          }
        ],
        imgUrl: [
          {
            required: true,
            message: "题库图片不能为空",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getUserList();
    this.getTableData();
    this.getTestList();
  },
  methods: {
    getTestList(){
       testList({
        pageNum:1,
        pageSize: 100,
      }).then(res => {
        console.log(res);
        this.testTitleList = res.data.content;
      });
    },
    goOther(){
        this.$router.push({path:"/statement",query:{id:1}})
    },
    onBeforeImgUploading() {
      this.imgUploadLoading = true;
    },
    onImgUploadInforSuccess(res) {
      console.log(res);
      this.imgUploadLoading = false;
      this.updateValidate.imgUrl = res.data || "";
    },
    handleImgFormatError(file) {
      this.$Notice.error({
        title: "文件格式错误",
        desc: "上传的文件格式是错误的，请选择jpg或者png格式的图片"
      });
    },
    sure() {
        updateBank({
            ...this.updateValidate
        }).then(res=>{
            if(res.code==0){
                this.updateModal = false;
                for (let key in this.updateValidate) {
                    this.updateValidate[key] = "";
                }
                this.getTableData();
                this.$Message.success(res.message);
            }
        })
    },
    cancel() {
      for (let key in this.updateValidate) {
        this.updateValidate[key] = "";
      }
      this.updateModal = false;
    },
    getUserList() {
      getUserClass().then(res => {
        if (res.code == 0) {
          this.userList = res.data;
        }
      });
    },
    changeStatus(id, status) {
      changeStatu(id, status).then(res => {
        if (res.code == 0) {
          this.$Message.success(res.message);
          this.getTableData();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    onPageChange(page) {
      this.page = page;
      this.getTableData();
    },
    search() {
      if(this.formItem.testId == null || this.formItem.testId == ""){
         this.$Message.error("请先选择导出的试卷名");
        return
      }
      // this.page = 1;
      // this.getTableData();
      const elink = document.createElement('a')
      elink.href = "http://47.115.32.248:6004/admin/test/question/statement/export?testId="  +   this.formItem.testId
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
    },
    clear() {
      for (let key in this.formItem) {
        this.formItem[key] = "";
      }
      this.getTableData();
// const elink = document.createElement('a')
//       elink.href = "http://127.0.0.1:6004/admin/test/question/statement/export?a="  +   
//               document.body.appendChild(elink)
//               elink.click()
//               URL.revokeObjectURL(elink.href) // 释放URL 对象
//               document.body.removeChild(elink)

 
    },
    getTableData() {
      statement({
        pageNum: this.page,
        pageSize: this.limit,
        testId: this.$route.query.id
      }).then(res => {
        console.log(res);
        if(res.data!=null){
            res.data.content.forEach(item=>{
                item.testStatus==1?item.testStatus='已参考':item.testStatus='未参考'
            })
            this.tableData = res.data.content;
            this.total = res.data.totalElements;
        }
        
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sear {
  display: flex;
  .searchInput {
    // width: 300px;
  }
  .btn {
    margin-left: 100px;
    button:nth-child(2) {
      margin-left: 10px;
    }
  }
}
.ivu-page {
  margin-top: 10px;
  text-align: right;
}
.tableHead {
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
