<template>
  <div>
    <Card>
      <p slot="title">试卷列表</p>
      <div class="sear">
        <Form :model="formItem" :label-width="100" inline>
          <FormItem label="试卷标题：" class="searchInput">
            <Input v-model="formItem.bankTitle" placeholder="请输入试卷标题"></Input>
          </FormItem>
          <FormItem label="用户分类：" class="searchInput">
            <Select style="width:200px;" v-model="formItem.userCategory">
                <Option v-for="(item,index) in userList" :value="(item.id)" :key="index">{{item.categoryName}}</Option>
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
    <Modal v-model="updateModal" title="修改题库" :closable="false">
      <Form ref="updateValidate" :model="updateValidate" :label-width="120" :rules="rulesUpdate">
        <FormItem label="题库标题：" prop="bankTitle">
          <Input v-model="updateValidate.bankTitle"></Input>
        </FormItem>
        <FormItem label="用户分类：" prop="userType" style="width:400px">
          <Select v-model="updateValidate.userType">
            <Option v-for="(item,i) of userList" :key="i" :value="(item.id)">{{item.categoryName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="轮播图片：" prop="imgUrl">
          <Input v-model="updateValidate.imgUrl" placeholder="只能上传一张jpg/png格式文件">
            <span slot="append">
              <Upload
                :action="uploadImgUrl"
                :format="['jpg','jpeg','png']"
                :data="uploadData"
                :show-upload-list="false"
                :before-upload="onBeforeImgUploading"
                :on-success="onImgUploadInforSuccess"
                :on-format-error="handleImgFormatError"
              >
                <Button icon="ios-cloud-upload-outline" :loading="imgUploadLoading">选择上传文件</Button>
              </Upload>
            </span>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="sure">确定</Button>
      </div>
    </Modal>
    <Modal v-model="picModal">
      <div class="maxpic">
        <img :src="maxPics" class="maxPicture" alt />
      </div>
    </Modal>
  </div>
</template>

<script>
import {getUserClass} from "@/service/questionApi/api";
import {testList} from "@/service/testPaperApi/api";
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
          title: "试卷标题",
          key: "testTitle"
        },
        {
          title: "题库图片",
          key: "imgUrl",
          render: (h, params) => {
            return h("div", [
              h("img", {
                style: {
                  width: "80px",
                  verticalAlign: "middle"
                },
                attrs: {
                  src: params.row.imgUrl
                },
                on: {
                  click: () => {
                    this.maxPics = params.row.imgUrl;
                    this.picModal = true;
                  }
                }
              })
            ]);
          }
        },
        {
          title: "参与人数",
          key: "testUserNum"
        },
        {
          title: "分类",
          key: "userType",
          render: (h, params) => {
            let txt = "";
            this.userList.forEach(ele => {
              if (ele.id == params.row.userType) {
                txt = ele.categoryName;
              }
            });
            return h("span", {}, txt);
          }
        },
        {
          title: "创建人",
          key: "createUser"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "操作",
          width: 180,
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "span",
                  {
                    style:{
                        color:'#2d8cf0',
                        cursor:"pointer"
                    },
                    on: {
                      click: () => {
                        this.goOther(params)
                      }
                    }
                  },
                  "报表"
                ),
              ]
            );
          }
        }
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
    goOther(item){
        console.log();
        this.$router.push({path:"/statement",query:{id:item.row.id}})
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
      testList({
        pageNum: this.page,
        pageSize: this.limit,
        testTitle: this.formItem.bankTitle,
        userCategory:this.formItem.userCategory
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
