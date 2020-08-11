<template>
    <div>
        <Card>
            <p slot="title">课程列表</p>
            <div class="sear">
                <Form :model="formItem" :label-width="100" inline>
                    <FormItem label="课程标题：" class="searchInput">
                        <Input v-model="formItem.courseTitle" placeholder="请输入课程标题"></Input>
                    </FormItem>
                    <FormItem label="是否收费：" class="searchInput">
                        <Select v-model="formItem.charge">
                            <Option value="0">免费</Option>
                            <Option value="1">收费</Option>
                            <Option value="2">VIP</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div class="btn">
                    <Button type="primary" @click="search">
                        <Icon type="ios-search" />查询
                    </Button>
                    <Button type="default" style="margin-left:10px" @click="clear">
                        <Icon type="ios-undo" />重置
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
import { getCourseList,changeStatu,delCourse} from "@/service/courseApi/api";
import { getStore, removeStore, setStore } from "@/config/storage";
export default {
    data() {
        return {
            editModal: false,
            total: 0,
            page: 1,
            limit: 10,
            error: false,
            formItem: {
                courseTitle: "",
                charge: ""
            },
            tableData: [],
            tableColumns: [
                {
                    title: "课程名称",
                    key: "courseTitle"
                },
                {
                    title: "视频数",
                    key: "classNum"
                },
                {
                    title: "状态",
                    key: "courseStatus",
                    render: (h, params) => {
                        let txt =
                            params.row.courseStatus == 0 ? "上架" : "下架";
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
                    title: "是否收费",
                    key: "whetherPay",
                    render: (h, params) => {
                        let txt = params.row.whetherPay == 0 ? "否" : "是";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "会员专属",
                    key: "memberOnly",
                    render: (h, params) => {
                        let txt = params.row.memberOnly == 0 ? "否" : "是";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "操作",
                    width:240,
                    render: (h, params) => {
                        let txt=params.row.courseStatus==0?"下架":"上架";
                        return [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary"
                                    },
                                    style: {
                                        marginRight: "10px"
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push(`/course/edit/${params.row.id}`);
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: params.row.courseStatus==0?"warning":"success"
                                    },
                                    style: {
                                        marginRight: "10px"
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row)
                                            this.$Modal.confirm({
                                                title: "提示",
                                                content: txt + "该课程！",
                                                loading: true,
                                                onOk: () => {
                                                    if (txt == "下架") {
                                                        this.changeStatus(params.row.id,false);
                                                    } else {
                                                        this.changeStatus(params.row.id,true);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                },
                                txt
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type:"error"
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row)
                                            this.$Modal.confirm({
                                                title: "提示",
                                                content:"删除该课程！",
                                                loading: true,
                                                onOk: () => {
                                                    delCourse(0,params.row.id).then(res=>{
                                                        if(res.code==0){
                                                            this.$Modal.remove();
                                                            this.$Message.success(res.message);
                                                            this.getTableData();
                                                        }
                                                    })
                                                }
                                            });
                                        }
                                    }
                                },
                                "删除"
                            )
                        ];
                    }
                }
            ]
        };
    },
    created() {
        this.getTableData();
    },
    activated() {},
    methods: {
        changeStatus(id, status) {
            changeStatu({
                courseId:id,
                status:status
            }).then(res => {
                if (res.code == 0) {
                    this.$Modal.remove();
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
            getCourseList({
                pageNum: this.page,
                pageSize: this.limit,
                courseTitle: this.formItem.courseTitle,
                charge: this.formItem.charge
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
