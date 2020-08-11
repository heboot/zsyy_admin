<template>
    <div>
        <Card>
            <p slot="title">系统参数配置</p>
            <Tabs type="card" @on-click="clickType">
                <TabPane label="用户分类">
                    <div class="tableHead">
                        <div style="font-weight:700;">数据列表</div>
                        <div>
                            <Button type="primary" class="addBut" @click="add">新增分类</Button>
                        </div>
                    </div>
                    <Table :columns="columns_first" :data="contentpage" border :loading="ifLoading"></Table>
                    <div class="pageWrapper">
                        <Page :total="totalNum" :current="currentPageIdx" show-total @on-change="changePage"></Page>
                    </div>
                </TabPane>
                <TabPane label="题目分类">
                    <div class="tableHead">
                        <div style="font-weight:700;">数据列表</div>
                        <div>
                            <Button type="primary" class="addBut" @click="add">新增分类</Button>
                        </div>
                    </div>
                    <Table :columns="columns_first" :data="contentpage" border :loading="ifLoading"></Table>
                    <div class="pageWrapper">
                        <Page :total="totalNum" :current="currentPageIdx" show-total @on-change="changePage"></Page>
                    </div>
                </TabPane>
                <TabPane label="课程分类">
                    <div class="tableHead">
                        <div style="font-weight:700;">数据列表</div>
                        <div>
                            <Button type="primary" class="addBut" @click="add">新增分类</Button>
                        </div>
                    </div>
                    <Table :columns="columns_first" :data="contentpage" border :loading="ifLoading"></Table>
                    <div class="pageWrapper">
                        <Page :total="totalNum" :current="currentPageIdx" show-total @on-change="changePage"></Page>
                    </div>
                </TabPane>
                <TabPane label="课程内容">
                    <div class="sear">
                        <Form :label-width="100" style="width:300px">
                            <FormItem label="课程分类：" class="searchInput">
                                <Select v-model="userCategoryId">
                                    <Option v-for="(item,i) in typeList" :key="i" :value="String(item.id)">
                                        {{item.categoryName}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Form>
                        <Button type="primary" class="addBut" @click="showContent">
                            <Icon type="ios-search" style="font-size:16px" />查询
                        </Button>
                        <Button type="default" class="addBut" @click="clear">
                            <Icon type="ios-undo" style="font-size:16px" />重置
                        </Button>
                    </div>
                    <div class="tableHead">
                        <div style="font-weight:700;">数据列表</div>
                        <div>
                            <Button type="primary" class="addBut" @click="addContent">新增分类</Button>
                        </div>
                    </div>
                    <Table :columns="columns_second" :data="coursepage" border :loading="ifLoading"></Table>
                    <div class="pageWrapper">
                        <Page :total="totalNum1" :current="currentPageIdx1" show-total @on-change="changePage1"></Page>
                    </div>
                </TabPane>
            </Tabs>
            <!-- 分类 -->
            <Modal v-model="addModal" :title="modalName" :closable="false">
                <Form ref="formValidate" :model="formValidate" :label-width="100" :rules="ruleValidate">
                    <FormItem label="分类名称" prop="categoryName">
                        <Input v-model="formValidate.categoryName"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="sure">确定</Button>
                </div>
            </Modal>
            <!-- 课程内容 -->
            <Modal v-model="addContentModal" :title="modalName" :closable="false">
                <Form ref="formValidate1" :model="formValidate1" :label-width="100" :rules="ruleValidate1">
                    <FormItem label="课程分类：" v-if="modalName=='新增课程内容分类'">
                        <Select v-model="categoryId" @on-change="showContent">
                            <Option v-for="(item,i) in typeList" :key="i" :value="String(item.id)">{{item.categoryName}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分类名称：" prop="contentName">
                        <Input v-model="formValidate1.contentName"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="default" @click="cancel">取消</Button>
                    <Button type="primary" @click="sureContent">确定</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import {
    getTalbe,
    updateUser,
    updateQuestion,
    updateCourse,
    addUser,
    addQuestion,
    addCourse,
    addCourseContent,
    updateCourseContent,
    delContent,
    getContent
} from "@/service/systemApi/api";
export default {
    data() {
        return {
            userCategoryId: "",
            currentPageIdx: 1,
            currentPageIdx1: 1,
            addDayModal: false,
            ifLoading: true,
            totalNum: null,
            addModal: false,
            addContentModal: false,
            modalName: "新增",
            formValidate: {
                categoryName: "",
                id: null
            },
            categoryId: "",
            formValidate1: {
                contentName: "",
                id: null
            },
            ruleValidate: {
                categoryName: [
                    {
                        required: true,
                        message: "分类名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            ruleValidate1: {
                contentName: [
                    {
                        required: true,
                        message: "分类名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            columns_first: [
                {
                    title: "ID",
                    key: "id"
                },
                {
                    title: "分类名称",
                    key: "categoryName"
                },
                {
                    title: "创建时间",
                    key: "createTime"
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        return [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary"
                                    },
                                    on: {
                                        click: () => {
                                            console.log(1);
                                            this.formValidate.categoryName =
                                                params.row.categoryName;
                                            this.formValidate.id =
                                                params.row.id;
                                            if (this.type == 0) {
                                                this.modalName = "修改用户分类";
                                            } else if (this.type == 1) {
                                                this.modalName = "修改题目分类";
                                            } else {
                                                this.modalName = "修改课程分类";
                                            }
                                            this.isEdit = true; //编辑
                                            this.addModal = true;
                                        }
                                    }
                                },
                                "修改"
                            )
                        ];
                    }
                }
            ],
            contentpage: [],
            columns_second: [
                {
                    title: "ID",
                    key: "id"
                },
                {
                    title: "分类名称",
                    key: "contentName"
                },
                {
                    title: "创建时间",
                    key: "createTime"
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        return [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary"
                                    },
                                    on: {
                                        click: () => {
                                            console.log(1);
                                            this.formValidate1.contentName =
                                                params.row.contentName;
                                            this.formValidate1.id =
                                                params.row.id;
                                            this.modalName = "修改课程内容";
                                            this.isEdit = true; //编辑
                                            this.addContentModal = true;
                                        }
                                    }
                                },
                                "修改"
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
                                            console.log(params.row);
                                            this.$Modal.confirm({
                                                title: "确认删除",
                                                content:
                                                    "<p>确定删除该课程视频？</p>",
                                                loading: true,
                                                onOk: () => {
                                                    delContent(
                                                        params.row.id
                                                    ).then(res => {
                                                        if (res.code == 0) {
                                                            this.$Modal.remove();
                                                            this.$Message.success(
                                                                "删除成功！"
                                                            );
                                                            this.getInfo(3);
                                                        }
                                                    });
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
            ],
            typeList: [],
            coursepage: [],
            page: 1,
            page1: 1,
            limit: 10,
            limie1: 10,
            totalNum1: 0,
            type: 0,
            isEdit: false
        };
    },
    created() {
        this.getInfo(0);
    },
    methods: {
        clear() {
            this.userCategoryId="";
            this.getInfo(3);
        },
        addContent() {
            this.isEdit = false; //新增
            this.modalName = "新增课程内容分类";
            this.addContentModal = true;
        },
        add() {
            this.isEdit = false; //新增
            if (this.type == 0) {
                this.modalName = "新增用户分类";
            } else if (this.type == 1) {
                this.modalName = "新增题目分类";
            } else {
                this.modalName = "新增课程分类";
            }
            this.addModal = true;
        },
        cancel() {
            this.addModal = false;
            this.addContentModal = false;
            for (let key in this.formValidate) {
                this.formValidate[key] = "";
            }
            for (let key in this.formValidate1) {
                this.formValidate1[key] = "";
            }
        },
        clickType(type) {
            this.contentpage.length = 0;
            this.coursepage.length = 0;
            this.userCategoryId = "";
            if (type == 3) {
                this.getInfo(type);
                this.getContentList(2);
            } else {
                console.log(type);
                this.type = type;
                this.getInfo(type);
            }
        },
        getInfo(type) {
            getTalbe({
                pageNum: this.page,
                pageSize: this.limit,
                type: type
            }).then(res => {
                if (res.code == 0) {
                    console.log(res);
                    this.ifLoading = false;
                    this.coursepage = res.data.content;
                    this.contentpage = res.data.content;
                    this.totalNum = res.data.totalElements;
                    this.totalNum1 = res.data.totalElements;
                }
            });
        },
        getContentList(type) {
            getTalbe({
                pageNum: this.page,
                pageSize: this.limit,
                type: type
            }).then(res => {
                if (res.code == 0) {
                    this.ifLoading = false;
                    this.typeList = res.data.content;
                }
            });
        },
        // 对应课程分类下的内容分类
        showContent() {
            console.log(1111);
            getContent({
                pageNum: this.page,
                pageSize: this.limit,
                courseCategoryId: this.userCategoryId
            }).then(res => {
                if (res.code == 0) {
                    console.log(res);
                    this.coursepage = res.data.content;
                    this.totalNum1 = res.data.totalElements;
                }
            });
        },
        // 修改
        sure(id) {
            console.log(this.type);
            this.$refs["formValidate"].validate(valid => {
                if (valid) {
                    // 修改接口
                    if (this.isEdit) {
                        //修改用户
                        if (this.type == 0) {
                            updateUser({
                                ...this.formValidate
                            }).then(res => {
                                if (res.code == 0) {
                                    for (let key in this.formValidate) {
                                        this.formValidate[key] = "";
                                    }
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        } else if (this.type == 1) {
                            updateQuestion({
                                ...this.formValidate
                            }).then(res => {
                                if (res.code == 0) {
                                    for (let key in this.formValidate) {
                                        this.formValidate[key] = "";
                                    }
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        } else {
                            updateCourse({
                                ...this.formValidate
                            }).then(res => {
                                if (res.code == 0) {
                                    for (let key in this.formValidate) {
                                        this.formValidate[key] = "";
                                    }
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        }
                    } else {
                        // 新增
                        if (this.type == 0) {
                            addUser({
                                categoryName: this.formValidate.categoryName
                            }).then(res => {
                                if (res.code == 0) {
                                    this.formValidate.categoryName = "";
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        } else if (this.type == 1) {
                            addQuestion({
                                categoryName: this.formValidate.categoryName
                            }).then(res => {
                                if (res.code == 0) {
                                    this.formValidate.categoryName = "";
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        } else {
                            addCourse({
                                categoryName: this.formValidate.categoryName
                            }).then(res => {
                                if (res.code == 0) {
                                    this.formValidate.categoryName = "";
                                    this.getInfo(this.type);
                                    this.addModal = false;
                                    this.$Message.success(res.message);
                                }
                            });
                        }
                    }
                }
            });
        },
        sureContent() {
            this.$refs["formValidate1"].validate(valid => {
                if (valid) {
                    // 修改
                    if (this.isEdit) {
                        updateCourseContent({ ...this.formValidate1 }).then(
                            res => {
                                if (res.code == 0) {
                                    for (let key in this.formValidate1) {
                                        this.formValidate1[key] = "";
                                    }
                                    this.getInfo(3);
                                    this.addContentModal = false;
                                    this.$Message.success(res.message);
                                }
                            }
                        );
                    } else {
                        // 新增
                        addCourseContent({
                            categoryId: this.categoryId,
                            contentName: this.formValidate1.contentName
                        }).then(res => {
                            if (res.code == 0) {
                                this.formValidate1.contentName = "";
                                this.getInfo(3);
                                this.addContentModal = false;
                                this.$Message.success(res.message);
                            }
                        });
                    }
                }
            });
        },
        changePage(pageIndex) {
            this.page = pageIndex;
            this.getInfo(this.type);
        },
        changePage1(pageIndex) {
            this.page = pageIndex;
            this.getInfo(3);
        }
    }
};
</script>

<style scoped lang='less'>
.sear {
    display: flex;
    align-items:center;
    .addBut{
        margin-top:-20px;
        margin-left:20px;
    }
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