<template>
    <div>
        <Modal v-model="modal" :title="title" :footer-hide="true" :mask-closable="false" :closable="false" fullscreen>
            <Form :model="formdata" label-position="left" :label-width="120" :rules="ruleInline">
                <FormItem label="所属分类" prop="cateId">
                    <Select v-model="formdata.cateId" placeholder="请选择" multiple :disabled="disabled">
                        <Option v-for="(item, index) in belongtypes" :value="item.id" :key="index">{{item.cateName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属机构" prop="organId">
                    <Select v-model="formdata.organId" placeholder="请选择" :disabled="disabled">
                        <Option v-for="(item, index) in allOrgans" :value="item.id" :key="index">{{item.organName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称" prop="proName">
                    <Input v-model="formdata.proName" placeholder="产品名称" :disabled="specialdisabled"></Input>
                </FormItem>
                <FormItem label="产品编号" prop="proNum">
                    <Input v-model="formdata.proNum" placeholder="产品编号" :disabled="specialdisabled"></Input>
                </FormItem>
                <FormItem label="产品描述网址" prop="proDesc">
                    <Input v-model="formdata.proDesc" placeholder="产品描述网址" :disabled="disabled">
                    <span slot="prepend">http://</span>
                    </Input>
                </FormItem>
                <FormItem label="产品图片" prop="pic">
                    <Upload :action="uploadAction" :format="['jpg','png']" :on-success="onUploadSuccess" :on-format-error="onUploadFormatError" :max-size="50" :on-exceeded-size="onUploadExceeded" :on-error="onUploadError" :show-upload-list="false">
                        <Button icon="ios-cloud-upload-outline" :disabled="disabled">上传图片</Button>
                    </Upload>
                    <div class="img_box" v-if="formdata.pic"><img :src="formdata.pic"></div>
                </FormItem>
                <FormItem label="抢购价" prop="rushPrice">
                    <Input v-model="formdata.rushPrice" placeholder="抢购价" :disabled="specialdisabled"></Input>
                </FormItem>
                <FormItem label="指导价" prop="guidePrice">
                    <Input v-model="formdata.guidePrice" placeholder="指导价" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="初始发售数量" prop="initAmount">
                    <Input v-model="formdata.initAmount" placeholder="初始发售数量" :disabled="specialdisabled"></Input>
                </FormItem>
                <FormItem label="首次开盘价" prop="initPrice">
                    <Input v-model="formdata.initPrice" placeholder="首次开盘价" :disabled="specialdisabled"></Input>
                </FormItem>
                <FormItem label="涨停比例" prop="upRate">
                    <Input v-model="formdata.upRate" placeholder="涨停比例" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="跌停比例" prop="downRate">
                    <Input v-model="formdata.downRate" placeholder="跌停比例" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="转让手续费比例" prop="transferRate">
                    <Input v-model="formdata.transferRate" placeholder="转让手续费比例" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="抢购开始时间" prop="rushTime">
                    <DatePicker type="datetime" placeholder="抢购开始时间" v-model="formdata.rushTime" :disabled="specialdisabled"></DatePicker>
                </FormItem>
                <FormItem label="抢购结束时间" prop="rushEnd">
                    <DatePicker type="datetime" placeholder="抢购结束时间" v-model="formdata.rushEnd" :disabled="disabled"></DatePicker>
                </FormItem>
                <FormItem label="交易结束时间" prop="transferTime">
                    <DatePicker type="datetime" placeholder="交易结束时间" v-model="formdata.transferTime" :disabled="disabled"></DatePicker>
                </FormItem>
                <FormItem label="兑换结束时间" prop="convertTime">
                    <DatePicker type="datetime" placeholder="兑换结束时间" v-model="formdata.convertTime" :disabled="disabled"></DatePicker>
                </FormItem>
                <FormItem label="做市商编号" prop="marketMaker">
                    <Input v-model="formdata.marketMaker" placeholder="做市商编号" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="排序" prop="sorts">
                    <Input v-model="formdata.sorts" placeholder="排序" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="是否推荐">
                    <RadioGroup v-model="formdata.orHot">
                        <Radio label="0" :disabled="disabled">否</Radio>
                        <Radio label="1" :disabled="disabled">是</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否禁用订购">
                    <RadioGroup v-model="formdata.orderStatus" :disabled="disabled">
                        <Radio label="0" :disabled="disabled">否</Radio>
                        <Radio label="1" :disabled="disabled">是</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <div :class="{ishide:ishide}">
                        <Button style="margin-left:8px;margin-right:50px;" @click="cancel">取消</Button>
                        <Button type="primary" @click="ok">确定</Button>
                    </div>
                    <div :class="{ishide:iseditorhide}">
                        <Button style="margin-left:8px;margin-right:50px;" @click="cancel">取消</Button>
                        <Button type="primary" @click="editor">确定</Button>
                    </div>
                    <div :class="{ishide:seehide}">
                        <Button style="margin-left:8px;margin-right:50px;" type="primary" @click="cancel">关闭</Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { BASICURL } from '@/service/getData';
import dtime from 'time-formater'
export default {
    name: "addproduct",
    props: ['belongtypes', 'allOrgans', 'ishide'],
    data() {
        const pattern = /^\d+(\.\d{0,4})?$/;
        const intpattern = /^[1-9]\d*$/;
        const lqzeropattern = /^\d+$/;
        return {
            formdata: {
                cateId: [],
                organId: "",
                proName: "",
                proNum: "",
                proDesc: "",
                pic: "",
                rushPrice: "",
                guidePrice: "",
                initAmount: "",
                initPrice: "",
                upRate: "",
                downRate: "",
                transferRate: "",
                marketMaker: "",
                orderStatus: "1",
                orHot: "1",
                rushTime: "",
                rushEnd: "",
                transferTime: "",
                convertTime: "",
                sorts: "",
            },
            iseditorhide: false,
            title: "",
            seehide: false,
            disabled: false,
            specialdisabled: false,
            modal: false,
            uploadAction: `${BASICURL}/admin/common/upload/oss/image`,
            imgsrc: "",
            id: "",
            ruleInline: {
                cateId: [{ required: true, message: '所属分类为必选项', trigger: 'blur' }],
                organId: [{ required: true, message: '所属分类为必选项', trigger: 'blur' }],
                proName: [{ required: true, message: '产品名称为必填项', trigger: 'blur', type: "string" }],
                proNum: [{ required: true, message: '产品编号为必填项且必须由数字和英文字母组成', trigger: 'blur', type: "string", pattern: /^[a-zA-Z0-9]+$/ }],
                proDesc: [{ required: true, message: '产品描述网址为必填项', trigger: 'blur' }],
                rushPrice: [{ required: true, message: '抢购价为必填项且必须为整数或者四位小数', trigger: 'blur', pattern }],
                guidePrice: [{ required: true, message: '指导价为必填项且必须整数或者四位小数', trigger: 'blur', pattern }],
                initAmount: [{ required: true, message: '初始发售数量为必填项且必须大于0的整数', trigger: 'blur', pattern: intpattern }],
                initPrice: [{ required: true, message: '首次开盘价为必填项且必须为整数或者四位小数', trigger: 'blur', pattern }],
                upRate: [{ required: true, message: '涨停比例为必填项且必须为整数或者四位小数', trigger: 'blur', pattern }],
                downRate: [{ required: true, message: '跌停比例为必填项且必须为整数或者四位小数', trigger: 'blur', pattern }],
                transferRate: [{ required: true, message: '转让手续费比例为必填项且必须为整数或者四位小数', trigger: 'blur', pattern }],
                rushTime: [{ required: true, message: '抢购开始时间为必填项', trigger: 'blur', type: "date" }],
                rushEnd: [{ required: true, message: '抢购结束时间为必填项', trigger: 'blur', type: "date" }],
                transferTime: [{ required: true, message: '交易结束时间为必填项', trigger: 'blur', type: "date" }],
                convertTime: [{ required: true, message: '兑换结束时间为必填项', trigger: 'blur', type: "date" }],
                sorts: [{ required: true, message: '排序为必填项且必须为0-9999的整数', trigger: 'blur', pattern: /^\d{0,4}$/ }],
                marketMaker: [{ required: true, message: '做市商编号为必填项且必须为整数', trigger: 'blur', pattern: intpattern }],
            }
        }
    },
    methods: {
        ok() {
            let obj = {};
            if (!this.formdata.pic) {
                this.$Message.error("请上传产品图片");
                return;
            }
            for (let key in this.formdata) {
                if (this.formdata[key] == "") {
                    this.$Message.error("所有内容为必填");
                    return;
                };
                if (Array.isArray(this.formdata[key])) {
                    obj[key] = this.formdata[key].join(",");
                } else if (this.formdata[key] instanceof Date) {
                    let date = dtime(this.formdata[key]).format('YYYY-MM-DD HH:mm:ss');
                    obj[key] = date;
                } else {
                    obj[key] = this.formdata[key];
                }
            };


            this.$emit("add", obj, this.formdata);
        },
        commenfun() {
            let marketMaker = this.formdata.marketMaker;
            checkUserExistenceApi(marketMaker).then(res => {
                console.log(res);
            })
        },
        cancel() {
            this.modal = false;
            for (let key in this.formdata) {
                this.formdata[key] = "";
            }
        },
        editor() {
            let obj = {};
            for (let key in this.formdata) {
                if (this.formdata[key] == "") {
                    this.$Message.error("所有内容为必填");
                    return;
                };
                if (Array.isArray(this.formdata[key])) {
                    obj[key] = this.formdata[key].join(",");
                } else if (this.formdata[key] instanceof Date) {
                    let date = dtime(this.formdata[key]).format('YYYY-MM-DD HH:mm:ss');
                    obj[key] = date;
                } else {
                    obj[key] = this.formdata[key];
                }
            }
            if (this.id != null && this.id != undefined) {
                obj.id = this.id;
            }
            this.$emit("editor", obj, this.formdata);
        },
        onUploadError() {
            this.$Message.error("上传失败")
        },
        onUploadExceeded() {
            this.$Message.error("单个文件不能超过1M")
        },
        onUploadFormatError() {
            this.$Message.error("不支持的文件类型")
        },
        onUploadSuccess(res, file, fileList) {
            console.log(res, file, fileList);
            if (res.returnCode == 4000) {
                //  this.$storage.clear();
                this.$Message.error("登录已过期，请重新登录！")
                setTimeout(() => {
                    window.location.href = `${window.location.origin}/login`;
                }, 500)
            } else {
                this.formdata.pic = res.data;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.isshow {
    display: none;
}
.img_box {
    width: 100px;
    height: 100px;
    margin-top: 20px;
    img {
        width: 100%;
        height: 100%;
    }
}
.ishide {
    display: none;
    text-align: center;
}
</style>



