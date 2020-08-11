<template>
    <div>
        <Card>
            <p slot="title">轮播管理</p>
            <Row>
                <div class="sear">
                    <div class="table_header">
                        <p>数据列表</p>
                    </div>
                    <Button type="primary" @click="addShow">新增</Button>
                </div>
            </Row>
            <Row>
                <Table :columns="columns_first" :data="content" :loading="ifLoading" border>
                </Table>
            </Row>

            <Row class="pageWrapper">
                <Page :total="totalElements" style='margin-top:8px' :current="current" @on-change="changePage"
                    show-elevator></Page>
            </Row>
        </Card>
        <Modal v-model="addModal" title="轮播图片" :closable="false">
            <Form ref="bannerValidate" :model="bannerValidate" :label-width="120" :rules="rulesBanner">
                <FormItem label="标题：" prop="title">
                    <Input v-model="bannerValidate.title"></Input>
                </FormItem>
                <FormItem label="轮播图片：" prop="imgUrl">
                    <Input v-model="bannerValidate.imgUrl" placeholder="只能上传一张jpg/png格式文件">
                    <span slot="append">
                        <Upload :action="uploadImgUrl" :format="['jpg','jpeg','png']" :data="uploadData"
                            :show-upload-list="false" :before-upload="onBeforeImgUploading"
                            :on-success="onImgUploadInforSuccess" :on-format-error="handleImgFormatError">
                            <Button icon="ios-cloud-upload-outline" :loading="imgUploadLoading">选择上传文件</Button>
                        </Upload>
                    </span>
                    </Input>
                </FormItem>
                <FormItem label="排序：" prop="sort">
                    <InputNumber v-model="bannerValidate.sort" :min="1"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="sure">确定</Button>
            </div>
        </Modal>
        <Modal v-model="picModal">
            <div class="maxpic">
                <img :src="maxPics" class="maxPicture" alt="">
            </div>
        </Modal>
    </div>

</template>

<script>
import {
    getBannerList,
    addBanner,
    updateBanner,
    detBanner
} from "@/service/bannerApi/api";
export default {
    data() {
        return {
            imgUploadLoading: false,
            uploadData: {},
            uploadImgUrl: `${this.host}/admin/upload/oss/image`,
            maxPics: "",
            picModal: false,
            bannerId: "",
            bannerValidate: {
                title: "",
                imgUrl: "",
                sort: null
            },
            addModal: false,
            pageNo: 1,
            pageSize: 10,
            time: [],
            totalElements: null,
            current: 1,
            ifLoading: true,
            columns_first: [
                {
                    title: "ID",
                    key: "id"
                },
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "图片",
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
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        let txt = params.row.status == 0 ? "启用" : "未启用";
                        return h("span", {}, txt);
                    }
                },
                {
                    title: "排序",
                    key: "sort"
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
                                    "Button",
                                    {
                                        props: {
                                            type: "primary"
                                        },
                                        on: {
                                            click: () => {
                                                this.bannerId = params.row.id;
                                                this.bannerValidate.title =
                                                    params.row.title;
                                                this.bannerValidate.imgUrl =
                                                    params.row.imgUrl;
                                                this.bannerValidate.sort =
                                                    params.row.sort;
                                                this.modalType = "编辑";
                                                this.addModal = true;
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
                                                    content: "确定删除该轮播？",
                                                    loading: true,
                                                    onOk: () => {
                                                        detBanner(
                                                            params.row.id
                                                        ).then(res => {
                                                            if (res.code == 0) {
                                                                this.$Modal.remove();
                                                                this.$Message.success(
                                                                    "删除成功！"
                                                                );
                                                                this.getList();
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
            content: [],
            rulesBanner: {
                title: [
                    {
                        required: true,
                        message: "标题不能为空",
                        trigger: "blur"
                    }
                ],
                imgUrl: [
                    {
                        required: true,
                        message: "图片不能为空",
                        trigger: "blur"
                    }
                ],
                sort: [
                    {
                        required: true,
                        message: "排序不能为空",
                        trigger: "blur"
                    }
                ]
            },
            modalType: "新增"
        };
    },
    created() {
        this.getList();
    },
    methods: {
        addShow() {
            this.modalType = "新增";
            this.addModal = true;
        },
        onBeforeImgUploading() {
            this.imgUploadLoading = true;
        },
        onImgUploadInforSuccess(res) {
            console.log(res);
            this.imgUploadLoading = false;
            this.bannerValidate.imgUrl = res.data || "";
        },
        handleImgFormatError(file) {
            this.$Notice.error({
                title: "文件格式错误",
                desc: "上传的文件格式是错误的，请选择jpg或者png格式的图片"
            });
        },
        cancel() {
            this.addModal = false;
            for (let key in this.bannerValidate) {
                this.bannerValidate[key] = "";
            }
            this.bannerValidate.sort = null;
        },
        sure() {
            if (this.modalType == "新增") {
                addBanner({
                    ...this.bannerValidate
                }).then(res => {
                    if (res.code == 0) {
                        this.addModal = false;
                        for (let key in this.bannerValidate) {
                            this.bannerValidate[key] = "";
                        }
                        this.bannerValidate.sort = null;
                        this.$Message.success(res.message);
                        this.getList();
                    }
                });
            } else {
                updateBanner({
                    id: this.bannerId,
                    ...this.bannerValidate
                }).then(res => {
                    if (res.code == 0) {
                        this.addModal = false;
                        for (let key in this.bannerValidate) {
                            this.bannerValidate[key] = "";
                        }
                        this.bannerValidate.sort = null;
                        this.bannerId = "";
                        this.$Message.success(res.message);
                        this.getList();
                    }
                });
            }
        },
        changePage(pageIndex) {
            this.current = pageIndex;
            this.pageNo = pageIndex;
            this.getList();
        },
        getList() {
            getBannerList({
                pageNum: this.pageNo,
                pageSize: this.pageSize
            }).then(res => {
                if (res.code == 0) {
                    console.log(res);
                    this.ifLoading = false;
                    this.content = res.data.content;
                    this.totalElements = res.data.totalElements;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.sear {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}
.maxPicture {
    width: 100%;
    height: 100%;
    display: block;
}
</style>


