<template>
    <div>
        <Card>
            <p slot="title">新增题库</p>
            <div>
                <Form ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
                    <FormItem label="题库标题：" prop="questionTitle">
                        <Input v-model="formValidate.questionTitle" placeholder="请输入题库标题"></Input>
                    </FormItem>
                    <FormItem label="用户分类：" prop="userType" style="width:400px">
                        <Select v-model="formValidate.userType">
                            <Option v-for="(item,i) of userType" :key="i" :value="(item.id)">
                                {{item.categoryName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="题库封面：" prop="imgUrl" style="width:400px">
                        <Input v-model="formValidate.imgUrl" placeholder="只能上传一张jpg/png格式文件">
                        <span slot="append">
                            <Upload :action="uploadImgUrl" :format="['jpg','jpeg','png']" :data="uploadData"
                                :show-upload-list="false" :before-upload="onBeforeImgUploading"
                                :on-success="onImgUploadInforSuccess" :on-format-error="handleImgFormatError">
                                <Button icon="ios-cloud-upload-outline" :loading="imgUploadLoading">选择上传文件</Button>
                            </Upload>
                        </span>
                        </Input>
                    </FormItem>
                    <Card>
                        <p slot="title">题目搜索</p>
                        <FormItem label="全部分类：" style="width:400px;">
                            <Select v-model="formValidate.allType">
                                <Option v-for="(item,i) of topicList" :key="i" :value="(item.id)">
                                    {{item.categoryName}}</Option>
                            </Select>
                        </FormItem>
                        <div class="search">
                            <FormItem label="题目标题：">
                                <Input v-model="formValidate.subjectTitle" placeholder="请输入课程标题"></Input>
                            </FormItem>
                            <Button type="primary" @click="search" class="button">
                                <Icon type="ios-search" style="font-size:16px" />搜索
                            </Button>
                            <Button type="default" style="margin-right:20px" @click="clear">
                                <Icon type="ios-undo" style="font-size:16px" />重置
                            </Button>
                            <Button type="primary" @click="add">新增题目</Button>
                        </div>
                        <Table ref="selection" @on-selection-change="select" :columns="tableColumns" :data="tableData" border></Table>
                        <Page :total="total" :current="page" :page-size="limit" show-total @on-change="onPageChange" />
                    </Card>
                </Form>
            </div>
            <Button type="primary" @click="submitSubject" style="width:400px;margin:20px;">提交</Button>
        </Card>
        <!-- 弹框 -->
        <Modal v-model="addModal" title="新增题目" :closable="false">
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
                <FormItem label="题目分类：" prop="questionCategoryId" style="width:390px">
                    <Select v-model="addValidate.questionCategoryId">
                        <Option v-for="(item,i) of topicList" :key="i" :value="(item.id)">
                            {{item.categoryName}}</Option>
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
                    <Input v-model="addValidate.answerExplain" type="textarea" :autosize="{minRows:5,maxRows: 5}"
                        placeholder="答案解析"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="addModal=false">取消</Button>
                <Button type="primary" @click="sure">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    BASICURL,
    getUserClass,
    getTopicType,
    getTopicList,
    uploadBank,
    addSubject
} from "@/service/questionApi/api";
import { getStore, removeStore, setStore } from "@/config/storage";
export default {
    data() {
        return {
            uploadImgUrl: `${this.host}/admin/upload/oss/image`,
            imgUploadLoading: false,
            uploadData: {},
            total: 0,
            page: 1,
            limit: 10,
            addModal: false,
            formValidate: {
                questionTitle: "",
                userType: null,
                allType: "",
                subjectTitle: "",
                imgUrl: ""
            },
            ruleValidate: {
                questionTitle: [
                    {
                        required: true,
                        message: "题库标题不能为空",
                        trigger: "blur"
                    }
                ],
                userType: [
                    {
                        required: true,
                        message: "用户分类不能为空",
                        trigger: "change",
                        type: "number"
                    }
                ],
                imgUrl: [
                    {
                        required: true,
                        message: "题库封面不能为空",
                        trigger: "change"
                    }
                ],
                allType: [
                    {
                        required: true,
                        message: "全部分类不能为空",
                        trigger: "change",
                        type: "array"
                    }
                ],
                allContent: [
                    {
                        required: true,
                        message: "全部内容不能为空",
                        trigger: "change",
                        type: "array"
                    }
                ],
                subjectTitle: [
                    {
                        required: true,
                        message: "题目标题不能为空",
                        trigger: "blur"
                    }
                ]
            },
            tableData: [],
            tableColumns: [
                {
                    type: "selection",
                    algin: "center",
                    width: 80
                },
                {
                    title: "题目标题",
                    key: "questionTitle"
                },
                {
                    title: "类型",
                    key: "questionType",
                    render: (h, params) => {
                        let txt =
                            params.row.questionType == 0 ? "单选" : "多选";
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
                }
            ],
            topicList: [],
            addValidate: {
                questionTitle: "",
                questionType: "",
                questionValue: 1,
                answerExplain: "",
                questionCategoryId: null
            },
            options: [
                { optionContent: "", isTrue: "0" },
                { optionContent: "", isTrue: "0" },
                { optionContent: "", isTrue: "0" },
                { optionContent: "", isTrue: "0" }
            ],
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
            },
            optionList: [],
            userType: [],
            selectedArr: [],
            selectedIds:[]
        };
    },
    created() {
        this.getUserType();
        this.getTopic();
        this.getTopicTable();
    },
    methods: {
        // 选择表格
        select(selection) {
            console.log(selection);
            this.selectedArr.push(...selection);
            console.log(this.selectedArr);
        },
        submitSubject() {
            this.$refs["formValidate"].validate(valid => {
                if (valid) {
                    if (this.selectedArr.length == 0) {
                        this.$Message.error("请选择要添加的题目！");
                        return;
                    }
                    let list = [];
                    this.selectedArr.forEach(ele => {
                        list.push({
                            id: ele.id
                        });
                    });
                    console.log(list);
                    let data = {
                        bankTitle: this.formValidate.questionTitle,
                        imgUrl: this.formValidate.imgUrl,
                        userType: this.formValidate.userType,
                        questionSubjectSet: list
                    };
                    console.log(data);
                    uploadBank({
                        ...data
                    }).then(res => {
                        console.log(res);
                        if (res.code == 0) {
                            this.$refs["formValidate"].resetFields();
                            this.selectedArr.length = 0;
                            this.getTopicTable();
                            this.$Message.success(res.message);
                        }
                    });
                }
            });
        },
        onBeforeImgUploading() {
            this.imgUploadLoading = true;
        },
        onImgUploadInforSuccess(res) {
            console.log(res);
            this.imgUploadLoading = false;
            this.formValidate.imgUrl = res.data || "";
        },
        handleImgFormatError(file) {
            this.$Notice.error({
                title: "文件格式错误",
                desc: "上传的文件格式是错误的，请选择jpg或者png格式的图片"
            });
        },
        getTopicTable() {
            console.log(this.formValidate.allType);
            getTopicList({
                subjectCategory: this.formValidate.allType,
                subjectTitle: this.formValidate.subjectTitle,
                pageNum: this.page,
                pageSize: this.limit
            }).then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.tableData = res.data.content;
                    this.total = res.data.totalElements;
                }
            });
        },
        getUserType() {
            getUserClass().then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.userType = res.data;
                }
            });
        },
        getTopic() {
            getTopicType().then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.topicList = res.data;
                }
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
        add() {
            this.addModal = true;
        },
        onPageChange(page) {
            this.page = page;
            this.getTopicTable();
        },
        search() {
            this.page = 1;
            this.getTopicTable();
        },
        clear() {
            this.page = 1;
            this.formValidate.allType = "";
            this.formValidate.subjectTitle = "";
            this.getTopicTable();
        },
        cancel() {
            this.addModal = false;
            this.resetForm();
        },
        sure() {
            this.$refs["addValidate"].validate(valid => {
                if (valid) {
                    // 判断是否填写选项
                    let isTrue;
                    this.options.forEach(ele => {
                        if (ele.optionContent) {
                            isTrue = true;
                        } else {
                            isTrue = false;
                        }
                    });
                    console.log(this.addValidate);
                    console.log(this.options);
                    if (isTrue) {
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
                                this.getTopicTable();
                                this.$Message.success(res.message);
                            }
                        });
                    } else {
                        this.$Message.error("请填写选项！");
                    }
                }
            });
        },
        resetForm() {
            for (let key in this.formValidate) {
                this.formValidate[key] = "";
            }
        }
    }
};
</script>

<style lang="less" scoped>
.search {
    display: flex;
    height: 32px;
    margin: 0 0 10px;
    .button {
        margin: 0 20px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}
/deep/ .ivu-input {
    width: 300px;
}
.addoption {
    margin: 0 180px 20px;
}
.optionsLine {
    display: flex;
}
</style>
