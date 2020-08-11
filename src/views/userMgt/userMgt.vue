<template>
    <div>
        <Card>
            <p slot="title">用户管理</p>
            <div class="sear">
                <Form :model="formItem" :label-width="100" inline>
                    <FormItem label="手机号：" class="searchInput">
                        <Input v-model="formItem.mobilePhone" placeholder="请输入手机号码"></Input>
                    </FormItem>
                    <FormItem label="用户分类：" class="searchInput">
                        <Select v-model="formItem.userCategoryId">
                            <Option v-for="(item,i) in typeList" :key="i" :value="String(item.id)">{{item.categoryName}}
                            </Option>
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
                <div>
                    <Button type="error" @click="delUser()">删除用户</Button>
                    <Button type="primary" @click="addModal=true">
                        <Icon type="plus-round"></Icon>添加用户
                    </Button>
                    <Button type="warning" @click="sendShow">发送通知</Button>
                </div>
            </div>
            <Table ref="selection" @on-selection-change="select" :columns="tableColumns" :data="tableData" border></Table>
            <Page :total="total" :current="page" :page-size="limit" show-total @on-change="onPageChange" />
        </Card>
        <!-- 增加编辑弹框 -->
        <Modal v-model="addModal" title="新增用户" :closable="false">
            <Form ref="formValidate" :model="formValidate" :label-width="90" :rules="ruleValidate">
                <FormItem label="手机号：" prop="mobilePhone">
                    <Input v-model="formValidate.mobilePhone"></Input>
                </FormItem>
                <FormItem label="性别：" prop="gender">
                    <RadioGroup v-model="formValidate.gender">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="用户分类：" prop="userCategoryId">
                    <Select v-model="formValidate.userCategoryId">
                        <Option v-for="(item,i) in typeList" :key="i" :value="item.id">{{item.categoryName}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="addModal=false">取消</Button>
                <Button type="primary" @click="sure">确定</Button>
            </div>
        </Modal>
        <!-- 发消息 -->
        <Modal v-model="sendModal" title="发送通知" :closable="false">
            <Form ref="sendValidate" :model="sendValidate" :label-width="120" :rules="rulesSend">
                <FormItem label="是否是全体通知：" prop="isAll">
                    <RadioGroup v-model="sendValidate.isAll">
                        <Radio label="0">否</Radio>
                        <Radio label="1" :disabled="isAll">是</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="通知类型：" prop="informType">
                    <Select v-model="sendValidate.informType">
                        <Option value="0">系统通知</Option>
                        <Option value="1">考核通知</Option>
                        <Option value="2">批阅通知</Option>
                        <Option value="3">成绩通知</Option>
                    </Select>
                </FormItem>
                <FormItem label="通知标题：" prop="informTitle">
                    <Input v-model="sendValidate.informTitle"></Input>
                </FormItem>
                <FormItem label="通知内容：" prop="informContent">
                    <Input v-model="sendValidate.informContent" type="textarea"
                        :autosize="{minRows:6,maxRows: 5}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="sendModal=false">取消</Button>
                <Button type="primary" @click="send">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    getList,
    getUserClass,
    changeStatu,
    addUser,
    sendMsg,
    delUser
} from "@/service/userMgtApi/api";
import { getStore, removeStore, setStore } from "@/config/storage";
// 认证状态
const certificationStatusMap = new Map([
    [0, "未填写资料"],
    [1, "认证中"],
    [2, "认证通过"],
    [3, "认证未通过"]
]);
export default {
    data() {
        return {
            selectedArr: [],
            sendModal: false,
            addModal: false,
            total: 0,
            page: 1,
            limit: 10,
            formItem: {
                mobilePhone: "",
                userCategoryId: ""
            },
            formValidate: {
                mobilePhone: "",
                gender: "",
                userCategoryId: null
            },
            ruleValidate: {
                mobilePhone: [
                    {
                        required: true,
                        message: "手机号不能为空",
                        trigger: "blur"
                    },
                    {
                        pattern: /^1[3456789]\d{9}$/,
                        message: "手机号码格式不正确",
                        trigger: "blur"
                    }
                ],
                gender: [
                    {
                        required: true,
                        message: "性别不能为空",
                        trigger: "change"
                    }
                ],
                userCategoryId: [
                    {
                        required: true,
                        message: "用户分类不能为空",
                        trigger: "change",
                        type: "number"
                    }
                ]
            },
            sendValidate: {
                isAll: "",
                informType: "",
                informTitle: "",
                informContent: ""
            },
            rulesSend: {
                isAll: [
                    {
                        required: true,
                        message: "是否通知全体不能为空",
                        trigger: "change"
                    }
                ],
                informType: [
                    {
                        required: true,
                        message: "通知类型不能为空",
                        trigger: "change"
                        // type:"number"
                    }
                ],
                informTitle: [
                    {
                        required: true,
                        message: "通知标题不能为空",
                        trigger: "blur"
                    }
                ],
                informContent: [
                    {
                        required: true,
                        message: "通知内容不能为空",
                        trigger: "blur"
                    }
                ]
            },
            typeList: [], //分类列表
            id: "",
            tableData: [],
            tableColumns: [
                {
                    type: "selection",
                    algin: "center",
                    width: 80
                },
                {
                    title: "昵称",
                    key: "userName"
                },
                {
                    title: "手机号",
                    key: "mobilePhone"
                },
                {
                    title: "性别",
                    key: "gender",
                    width: 80,
                    render: (h, params) => {
                        let txt = params.row.gender == 0 ? "男" : "女";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "用户分类",
                    key: "userCategory",
                    render: (h, params) => {
                        let txt = params.row.userCategory.categoryName;
                        return h("span", {}, txt);
                    }
                },
                // {
                //     title: "认证状态",
                //     key: "certificationStatus",
                //     render: (h, params) => {
                //         return h(
                //             "span",
                //             {},
                //             certificationStatusMap.get(
                //                 params.row.certificationStatus
                //             )
                //         );
                //     }
                // },
                {
                    title: "用户状态",
                    key: "memberStatus",
                    render: (h, params) => {
                        let txt =
                            params.row.memberStatus == 0 ? "正常" : "禁用";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    width: 150
                },
                {
                    title: "创建人",
                    key: "createUser"
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        let txt =
                            params.row.memberStatus == 0 ? "禁用" : "启用";
                        return [
                            h(
                                "Button",
                                {
                                    props: {
                                        type:
                                            params.row.memberStatus == 0
                                                ? "error"
                                                : "success"
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: "提示",
                                                content: txt + "该用户！",
                                                loading: true,
                                                onOk: () => {
                                                    if (txt == "禁用") {
                                                        this.changeStatus(
                                                            params.row.id,
                                                            1
                                                        );
                                                    } else {
                                                        this.changeStatus(
                                                            params.row.id,
                                                            0
                                                        );
                                                    }
                                                }
                                            });
                                        }
                                    }
                                },
                                txt
                            )
                        ];
                    }
                }
            ],
            isAll:false
        };
    },
    created() {
        this.getTableData();
        this.getUserList();
    },
    methods: {
        // 删除用户
        delUser(){
            this.$Modal.confirm({
                title: "提示",
                content: "是否删除用户",
                onOk: () => {
                    delUser(this.selectedArr).then(res => {
                        if (res.code == 0) {
                            this.$Message.success("删除成功");
                            this.getTableData();
                        } else {
                            this.$Message.error("操作失败！");
                        }
                    });
                },
                onCancel: () => {
                    this.$Message.info("取消删除");
                }
            });
        },
        sendShow(){
            console.log(this.selectedArr)
            // 选中用户
            if(this.selectedArr.length>0){
                this.sendValidate.isAll="0";
                this.isAll=true;
            }else{
                this.sendValidate.isAll="1";
                this.isAll=false;
            }
            this.sendModal=true;
        },
        send() {
            this.$refs["sendValidate"].validate(valid => {
                if (valid) {
                    sendMsg({
                        userId:this.selectedArr,
                        ...this.sendValidate
                    }).then(res => {
                        if (res.code == 0) {
                            this.sendModal = false;
                            this.selectedArr.length=0;
                            console.log(this.selectedArr);
                            this.getTableData();
                            this.$Message.success(res.message);
                        }
                    });
                }
            });
        },
        select(selection) {
            console.log(selection);
            let ids=[];
            selection.forEach(ele=>{
                ids.push(ele.id);
            });
            // this.selectedArr.push(...selection);
            this.selectedArr=ids;
            console.log(this.ids);
        },
        getUserList() {
            getUserClass().then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.typeList = res.data;
                }
            });
        },
        sure() {
            this.$refs["formValidate"].validate(valid => {
                if (valid) {
                    addUser({
                        mobilePhone: this.formValidate.mobilePhone,
                        gender: this.formValidate.gender,
                        userCategoryId: this.formValidate.userCategoryId,
                        createUser: getStore("username")
                    }).then(res => {
                        if (res.code == 0) {
                            this.addModal = false;
                            this.$refs["formValidate"].resetFields();
                            this.$Message.success(res.message);
                            this.getTableData();
                        }
                    });
                }
            });
        },
        //修改用户状态
        changeStatus(id, status) {
            changeStatu({
                userId: id,
                status: status
            }).then(res => {
                if (res.code == 0) {
                    setTimeout(() => {
                        this.$Modal.remove();
                    }, 1000);
                    console.log(status);
                    if(status==0){
                        this.$Message.success("启用该用户！");
                    }else{
                        this.$Message.success("禁止该用户！");
                    }
                    
                    this.getTableData();
                } else {
                    this.$Message.error("操作失败！");
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
            getList({
                pageNum: this.page,
                pageSize: this.limit,
                mobilePhone: this.formItem.mobilePhone,
                userCategoryId: this.formItem.userCategoryId
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
