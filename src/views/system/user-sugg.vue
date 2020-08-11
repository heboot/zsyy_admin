<template>
    <div>
        <Card>
            <p slot="title">意见反馈</p>
            <div class="sear">
                <Form :model="filterSearch" :label-width="100" inline>
                    <FormItem label="用户ID：">
                        <Input v-model="filterSearch.userId" placeholder="请输入用户ID"></Input>
                    </FormItem>
                    <FormItem label="反馈类型：">
                        <Select style="width:100px;" v-model="filterSearch.feedbackType">
                            <Option value="0">用户</Option>
                            <Option value="1">题目</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="反馈原因：">
                        <Select style="width:100px;" v-model="filterSearch.feedbackCause">
                            <Option value="0">错别字</Option>
                            <Option value="1">答案错误</Option>
                            <Option value="2">题目不完整</Option>
                            <Option value="3">图片不存在</Option>
                            <Option value="4">解析错误</Option>
                            <Option value="5">其他</Option>
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
            <Row>
                <div class="table_header">
                    <p>数据列表</p>
                </div>
            </Row>
            <Row>
                <Table :columns="columns_first" :data="content" :loading="ifLoading" border>
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
                        <Button type="error" size="small" @click="remove(index)">Delete</Button>
                    </template>
                </Table>
            </Row>

            <Row class="pageWrapper">
                <Page :total="totalElements" style='margin-top:8px' :current="current" @on-change="changePage"
                    show-elevator></Page>
            </Row>
        </Card>
        <Modal v-model="sendModal" title="反馈回复" :closable="false">
            <Form ref="sendValidate" :model="sendValidate" :label-width="120" :rules="rulesSend">
                <FormItem label="回复内容：" prop="answer">
                    <Input v-model="sendValidate.answer" type="textarea"
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
// import dtime from "time-formater";
import { getFeedback,feedBackAnswer,delFeedBack} from "@/service/systemApi/api";
import { setStore, getStore, removeStore } from "@/config/storage";
const feedbackCauseMap = new Map([
    [0, "错别字"],
    [1, "答案错误"],
    [2, "题目不完整"],
    [3, "图片不存在"],
    [4, "解析错误"],
    [5, "其他"]
]);
export default {
    data() {
        return {
            sendValidate:{
                id:"",
                answer:""
            },
            sendModal:false,
            filterSearch: {
                //查询参数
                feedbackType: "",
                userId: "",
                feedbackCause:''
            },
            pageNo: 1,
            pageSize: 10,
            time: [],
            totalElements: null,
            current: 1,
            ifLoading: true,
            columns_first: [
                {
                    title: "用户ID",
                    key: "userId"
                },
                {
                    title: "反馈内容",
                    key: "feedbackContent",
                    render: (h, params) => {
                        let txt =
                            params.row.feedbackContent &&
                            String(params.row.feedbackContent).substring(
                                0,
                                10
                            ) + "...";
                        return h(
                            "span",
                            {
                                domProps: {
                                    title: params.row.feedbackContent
                                }
                            },
                            txt
                        );
                    }
                },
                {
                    title: "反馈回答",
                    key: "feedbackAnswer",
                    render: (h, params) => {
                        let txt =
                            params.row.feedbackAnswer &&
                            String(params.row.feedbackAnswer).substring(0, 10) +
                                "...";
                        return h(
                            "span",
                            {
                                domProps: {
                                    title: params.row.feedbackAnswer
                                }
                            },
                            txt
                        );
                    }
                },
                {
                    title: "反馈原因",
                    key: "feedbackCause",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            feedbackCauseMap.get(params.row.feedbackCause)
                        );
                    }
                },
                {
                    title: "反馈类型",
                    key: "feedbackType",
                    render: (h, params) => {
                        let txt =
                            params.row.feedbackType == 0 ? "用户" : "题目";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime"
                },
                {
                    title: "操作",
                    width: 180,
                    render: (h, params) => {
                        let txt =params.row.feedbackAnswer =='' ? "回复" : "修改";
                        // if (!params.row.feedbackAnswer) {
                            return (
                                "div",
                                [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type: "primary"
                                            },
                                            style: {
                                                marginRight: '5px',
                                                color:'#2d8cf0',
                                                cursor:"default"
                                            },
                                            on: {
                                                click: () => {
                                                    this.showModel(params);
                                                }
                                            }
                                        },
                                        txt
                                    ),
                                    h('span', {
                                        props: {
                                            type: 'primary',
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color:'#2d8cf0',
                                            cursor:"default"
                                        },
                                        on: {
                                            click: () => {
                                                this.show(params)
                                            }
                                        }
                                    }, '查看'),
                                    h('span', {
                                        props: {
                                            type: 'error',
                                        },
                                        style:{
                                            color:'#2d8cf0',
                                            cursor:"default"
                                        },
                                        on: {
                                            click: () => {
                                                this.del(params)
                                            }
                                        }
                                    }, '删除')
                                ]
                            );
                        // }
                    }
                }
            ],
            content: [],
            rulesSend:{
                answer: [
                    {
                        required: true,
                        message: "内容不能为空",
                        trigger: "blur"
                    }
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        del(item){
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除此项反馈？',
                onOk: () => {
                    delFeedBack(item.row.id).then(res=>{
                        if(res.code==0){
                            this.$Message.success("删除成功");
                            this.getList();
                        }
                    })
                    
                },
                onCancel: () => {
                    this.$Message.info('Clicked cancel');
                }
            });
            // console.log(item.row.id);
            
        },
        showModel(item){
            this.sendValidate.id=item.row.id;
            this.sendValidate.answer=item.row.feedbackAnswer
            this.sendModal=true;
        },
        show (item) {
            console.log(item.row.feedbackContent);
            this.$Modal.info({
                title: '反馈内容',
                content:item.row.feedbackContent
            })
        },
        send(){
            this.sendValidate.answerUserName=localStorage.getItem("username")
            feedBackAnswer({
                ...this.sendValidate
            }).then(res=>{
                if(res.code==0){
                    this.sendModal=false;
                    for(let key in this.sendValidate){
                        this.sendValidate[key]="";
                    }
                    this.$Message.success(res.message);
                    this.getList();
                }
            })
        },
        changePage(pageIndex) {
            this.current = pageIndex;
            this.pageNo = pageIndex;
            this.getList();
        },
        getList() {
            console.log(this.filterSearch);
            getFeedback({
                pageNum: this.pageNo,
                pageSize: this.pageSize,
                ...this.filterSearch
            }).then(res => {
                if (res.code == 0) {
                    console.log(res);
                    this.ifLoading = false;
                    this.content = res.data.content;
                    this.totalElements = res.data.totalElements;
                }
            });
        },
        search() {
            this.pageNo = 1;
            this.getList();
        },
        clear() {
            for (let key in this.filterSearch) {
                this.filterSearch[key] = "";
            }
            this.getList();
        }
    }
};
</script>

<style lang="less" scoped>
.sear {
    display: flex;
}
</style>


