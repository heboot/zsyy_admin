<template>
    <div>
        <Card>
            <p slot="title">发送通知</p>
            <div class="sear">
                <Form :model="formItem" :label-width="100" inline>
                    <FormItem label="用户ID：" class="searchInput">
                        <Input v-model="formItem.userId" placeholder="请输入用户ID"></Input>
                    </FormItem>
                    <FormItem label="通知类型：" class="searchInput" style="width:200px">
                        <Select v-model="formItem.informType">
                            <Option value="0">系统通知</Option>
                            <Option value="1">考核通知</Option>
                            <Option value="2">批阅通知</Option>
                            <Option value="3">成绩通知</Option>
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
                <div>数据列表</div>
            </div>
            <Table :columns="tableColumns" :data="tableData" border></Table>
            <Page :total="total" :current="page" :page-size="limit" show-total @on-change="onPageChange" />
        </Card>
    </div>
</template>

<script>
import {getList} from "@/service/newsApi/api";
const informTypeMap=new Map([
    [0,"系统通知"],
    [1,"考核通知"],
    [2,"批阅通知"],
    [3,"成绩通知"],
]);
export default {
    data() {
        return {
            formItem:{
                userId: "",
                informType:null
            },
            total: 0,
            page: 1,
            limit: 10,
            changeTitle: "",
            changeType: "",
            addModal: false,
            isShowDelModal: false,
            formValidate: {
                id: "",
                title: "",
                content: ""
            },
            isShowDelModal: false,
            ruleValidate: {
                title: [
                    {
                        required: true,
                        message: "公告标题不能为空",
                        trigger: "blur"
                    }
                ],
                content: [
                    {
                        required: true,
                        message: "公告内容不能为空",
                        trigger: "blur"
                    }
                ]
            },
            tableData: [],
            tableColumns: [
                {
                    title: "通知标题",
                    key: "informTitle"
                },
                {
                    title:"通知类型",
                    key:"informType",
                    render:(h,params)=>{
                        return h("span",{},informTypeMap.get(params.row.informType))
                    }
                },
                {
                    title: "公告内容",
                    key: "informContent",
                    render: (h, params) => {
                        let txt =
                            String(params.row.informContent).substring(0,6) + "...";
                        return h(
                            "span",
                            {
                                domProps: {
                                    title: params.row.informContent
                                }
                            },
                            txt
                        );
                    }
                },
                {
                    title:"消息状态",
                    key:"messageStatus",
                    render:(h,params)=>{
                        let txt=params.row.messageStatus==0?"未读":"已读";
                        return h("span",{},txt)
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime"
                }
            ]
        };
    },
    created() {
        this.getTableData();
    },
    methods: {
        clear() {
            for (let key in this.formItem) {
                this.formItem[key] = "";
            }
            this.getTableData();
        },
        onPageChange(page) {
            this.page = page;
            this.getTableData();
        },
        search() {
            this.page = 1;
            this.getTableData();
        },
        getTableData() {
            getList({
                pageNum: this.page,
                pageSize: this.limit,
                userId: this.formItem.userId,
                informType:this.formItem.informType
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
