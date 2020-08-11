<template>
  <div>
    <Card>
      <p slot="title">题目列表</p>
      <div class="sear">
        <Form :model="formItem" :label-width="100" inline>
          <FormItem label="全部分类：" style="width:300px;">
            <Select v-model="formItem.allType">
              <Option
                v-for="(item,i) of topicList"
                :key="i"
                :value="(item.id)"
              >{{item.categoryName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="题目标题：" style="width:500px;">
            <Input v-model="formItem.subjectTitle" placeholder="请输入题目标题"></Input>
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
        <div style="display:flex">
          <Button type="primary" @click="addModal=true" style="margin-right:10px;">新增题目</Button>
          <Upload
            :action="uploadUrl"
            :format="['xls']"
            :data="uploadData"
            :show-upload-list="false"
            :before-upload="onBeforeImgUploading"
            :on-success="onImgUploadInforSuccess"
            :on-format-error="handleImgFormatError"
          >
            <Button icon="ios-cloud-upload-outline" :loading="imgUploadLoading">导入题目</Button>
          </Upload>
        </div>
      </div>
      <Table :columns="tableColumns" :data="tableData" border></Table>
      <Page :total="total" :current="page" :page-size="limit" show-total @on-change="onPageChange" />
    </Card>
    <!-- 弹框 -->
    <Modal v-model="addModal" :title="modalTitle" :closable="false">
      <Form ref="addValidate" :model="addValidate" :label-width="90" :rules="ruleddValidate">
        <FormItem label="题目标题：" prop="questionTitle">
          <Input v-model="addValidate.questionTitle"></Input>
        </FormItem>
        <FormItem label="题目类型：" prop="questionType">
          <RadioGroup v-model="addValidate.questionType">
            <Radio label="0">单选题</Radio>
            <Radio label="1">多选题</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="题目分类：" prop="questionCategoryId">
          <Select v-model="addValidate.questionCategoryId">
            <Option v-for="(item,i) of topicList" :key="i" :value="(item.id)">{{item.categoryName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="题目分值：" prop="questionValue">
          <InputNumber v-model="addValidate.questionValue" :min="1" :step="0.5"></InputNumber>
        </FormItem>
        <FormItem label="答案选项：" v-for="(item,i) in options" :key="i">
          <div class="optionsLine">
            <Input v-model="item.optionContent"></Input>
            <Button type="error" @click="delOption(i)">删除</Button>
          </div>
          <div>
            <RadioGroup v-model="item.isTrue">
              <Radio label="0">错误</Radio>
              <Radio label="1">正确</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <Button type="primary" @click="addOption" class="addoption">添加选项</Button>
        <FormItem label="答案解析：" style="width:390px">
          <Input
            v-model="addValidate.answerExplain"
            type="textarea"
            :autosize="{minRows:5,maxRows: 5}"
            placeholder="答案解析"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="sure">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getTopicList,
  getUserClass,
  updateBank,
  delSubject,
  getTopicType,
  addSubject,
  updateSubject
} from "@/service/questionApi/api";
import { getStore, removeStore, setStore } from "@/config/storage";
export default {
  data() {
    return {
      uploadUrl: `${this.host}/admin/subject/import`,
      imgUploadLoading: false,
      uploadData: {},
      modalTitle: "新增题目",
      topicList: [],
      userType: [],
      addModal: false,
      userList: [],
      total: 0,
      page: 1,
      limit: 10,
      formItem: {
        allType: "",
        subjectTitle: ""
      },
      tableData: [],
      tableColumns: [
        {
          title: "题目标题",
          key: "questionTitle"
        },
        {
          title: "类型",
          key: "questionType",
          render: (h, params) => {
            let txt = params.row.questionType == 0 ? "单选" : "多选";
            return h("span", {}, txt);
          }
        },
        {
          title: "分值",
          key: "questionValue"
        },
        {
          title: "分类",
          key: "questionCategoryId",
          render: (h, params) => {
            let txt = "";
            this.topicList.forEach(ele => {
              if (ele.id == params.row.questionCategoryId) {
                txt = ele.categoryName;
              }
            });
            return h("span", {}, txt);
          }
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "创建人",
          key: "createUser"
        },
        {
          title: "操作",
          width: 180,
          render: (h, params) => {
            return (
              "div",
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    on: {
                      click: () => {
                        console.log(params.row);
                        this.addValidate.id = params.row.id;
                        this.addValidate.questionTitle =
                          params.row.questionTitle;
                        this.addValidate.questionType = String(
                          params.row.questionType
                        );
                        this.addValidate.questionValue =
                          params.row.questionValue;
                        this.addValidate.answerExplain =
                          params.row.answerExplain;
                        this.addValidate.questionCategoryId =
                          params.row.questionCategoryId;
                        this.options = params.row.questionOptionList.map(
                          ele => {
                            ele.isTrue = String(ele.isTrue);
                            return ele;
                          }
                        );
                        this.addModal = true;
                        this.modalTitle = "修改题目";
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error"
                    },
                    style: {
                      marginLeft: "10px"
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: "确认删除",
                          content: "确定删除该题目？",
                          loading: true,
                          onOk: () => {
                            delSubject(params.row.id).then(res => {
                              if (res.code == 0) {
                                this.$Modal.remove();
                                this.$Message.success("删除成功！");
                                this.getTableData();
                              }
                            });
                          }
                        });
                      }
                    }
                  },
                  "删除"
                )
              ]
            );
          }
        }
      ],
      options: [
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" }
      ],
      addValidate: {
        questionTitle: "",
        questionType: "",
        questionValue: 1,
        answerExplain: "",
        questionCategoryId: null
      },
      ruleddValidate: {
        questionTitle: [
          {
            required: true,
            message: "题目标题不能为空",
            trigger: "blur"
          }
        ],
        questionType: [
          {
            required: true,
            message: "题目类型不能为空",
            trigger: "change"
          }
        ],
        questionValue: [
          {
            required: true,
            message: "题目分值不能为空",
            trigger: "blur",
            type: "number"
          }
        ],
        questionCategoryId: [
          {
            required: true,
            message: "题目分类不能为空",
            trigger: "change",
            type: "number"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
    this.getTableData();
    this.getTopic();
  },
  methods: {
    onBeforeImgUploading() {
      this.imgUploadLoading = true;
    },
    onImgUploadInforSuccess(res) {
      console.log(res);
      this.imgUploadLoading = false;
      this.$Message.success(res.message);
      this.getTableData();
    },
    handleImgFormatError(file) {
      this.$Notice.error({
        title: "文件格式错误",
        desc: "上传的文件格式是错误的，请选择xls的文件"
      });
    },
    addOption() {
      this.options.push({
        optionContent: "",
        isTrue: "0"
      });
    },
    delOption(i) {
      if (this.options.length > 4) {
        this.options.splice(i, 1);
      } else {
        this.$Message.error("不能少于4个选项!");
      }
    },
    getTopic() {
      getTopicType().then(res => {
        console.log(res);
        if (res.code == 0) {
          this.topicList = res.data;
        }
      });
    },
    sure() {
      this.$refs["addValidate"].validate(valid => {
        if (valid) {
          let isTrue;
          this.options.forEach(ele => {
            if (ele.optionContent) {
              isTrue = true;
            } else {
              isTrue = false;
            }
          });
          if (isTrue) {
            if (this.modalTitle == "新增题目") {
              addSubject({
                ...this.addValidate,
                createUser: getStore("username"),
                questionOptionList: this.options
              }).then(res => {
                console.log(res);
                if (res.code == 0) {
                  this.$refs["addValidate"].resetFields();
                  this.options = [
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" }
                  ];
                  this.addValidate.answerExplain = "";
                  this.addModal = false;
                  this.getTableData();
                  this.$Message.success(res.message);
                }
              });
            } else {
              updateSubject({
                ...this.addValidate,
                createUser: getStore("username"),
                questionOptionList: this.options
              }).then(res => {
                if (res.code == 0) {
                  this.$refs["addValidate"].resetFields();
                  this.options = [
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" },
                    { optionContent: "", isTrue: "0" }
                  ];
                  this.addValidate.answerExplain = "";
                  this.addModal = false;
                  this.getTableData();
                  this.$Message.success(res.message);
                }
              });
            }
          }
        }
      });
    },
    cancel() {
      this.$refs["addValidate"].resetFields();
      this.options = [
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" },
        { optionContent: "", isTrue: "0" }
      ];
      this.addValidate.answerExplain = "";
      this.addModal = false;
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
      getTopicList({
        pageNum: this.page,
        pageSize: this.limit,
        subjectCategory: this.formItem.allType,
        subjectTitle: this.formItem.subjectTitle
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
.addoption {
  margin: 0 180px 20px;
}
.optionsLine {
  display: flex;
  justify-content: space-between;
  /deep/ .ivu-input-wrapper {
    width: 80%;
  }
}
</style>
