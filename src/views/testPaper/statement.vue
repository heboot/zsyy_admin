<template>
  <div>
    <Card>
      <p slot="title">报表</p>
      <div class="sear">
        <Form :model="formItem" :label-width="100" inline>
          <FormItem label="用户名字" class="searchInput">
            <Input v-model="formItem.bankTitle" placeholder="请输入用户名字"></Input>
          </FormItem>
          <FormItem label="参考状态：" class="searchInput">
            <Select style="width:200px;" v-model="formItem.userCategory">
                <Option :value="0">未参考</Option>
                <Option :value="1">参考</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="btn">
          <Button type="primary" @click="search">
            <Icon type="ios-search" style="font-size:16px" />查询
          </Button>
          <Button type="default" style="margin-left:10px" @click="clear">
            <Icon type="ios-undo" style="font-size:16px" />重置
          </Button>
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
import {testList,statement} from "@/service/testPaperApi/api";
export default {
  data() {
    return {
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
        bankTitle: ""
      },
      typeList: [],
      tableData: [],
      tableColumns: [
        {
          title: "姓名",
          key: "userName"
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
  },
  methods: {
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
      this.page = 1;
      this.getTableData();
    },
    clear() {
      for (let key in this.formItem) {
        this.formItem[key] = "";
      }
      this.getTableData();
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
    width: 300px;
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
