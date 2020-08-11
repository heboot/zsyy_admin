<template>
    <div>
        <Card>
            <p slot="title">编辑用户</p>
            <Row class="mainEmployeeContent">
                <Form ref="formCustom" :model="formWrapperObj" :rules="ruleFrom" :label-width="90"
                    label-position="right">
                    <FormItem label="用户名：" prop="username">
                        <Input type="text" v-model="formWrapperObj.username" :maxlength="20"></Input>
                    </FormItem>
                    <FormItem label="真实姓名：" prop="realName">
                        <Input type="text" v-model="formWrapperObj.realName" :maxlength="10"></Input>
                    </FormItem>
                    <FormItem label="角色：" prop="roleId">
                        <Select v-model="formWrapperObj.roleId">
                            <Option v-for="role in roleArr" :key="role.id" :value="String(role.id)">{{ role.role }}
                            </Option>
                        </Select>
                        <router-link to="/rolemanage">添加角色</router-link>
                    </FormItem>
                    <FormItem label="所属部门：" prop="departmentId">
                        <Select v-model="formWrapperObj.departmentId">
                            <Option v-for="depart in departArr" :key="depart.id" :value="String(depart.id)">
                                {{ depart.name }}</Option>
                        </Select>
                        <router-link to="/departmental_management">添加部门</router-link>
                    </FormItem>
                    <FormItem label="手机号：" prop="mobilePhone">
                        <Input v-model="formWrapperObj.mobilePhone" :maxlength="11"></Input>
                    </FormItem>
                    <FormItem label="登录密码：" prop="password">
                        <Input v-model="formWrapperObj.password" :maxlength="18"></Input>
                    </FormItem>
                    <FormItem label="是否启用：" prop="enable">
                        <RadioGroup v-model="formWrapperObj.enable">
                            <Radio :label="0">是</Radio>
                            <Radio :label="1">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                        <Input type="textarea" v-model="formWrapperObj.remark" :maxlength="200"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long @click="confrimSub">确 认</Button>
                    </FormItem>
                </Form>
            </Row>
        </Card>
    </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/config/storage";
import {
    roleManage,
    departmentManage,
    addAuditEmployee,
    employeeDetail
} from "@/service/getData";

export default {
    data() {
        const self = this;
        return {
            employeeID: null,
            roleArr: [],
            departArr: [],
            formWrapperObj: {
                id: "", //f  //11 不需要
                username: "", //11
                password: "", //隐藏
                mobilePhone: "",
                enable: 1, //f //11
                roleId: "", // 11
                departmentId: "", //11
                realName: "",
                remark: ""
            },
            ruleFrom: {
                username: [
                    {
                        required: true,
                        message: "用户名不能为空！",
                        trigger: "blur"
                    }
                ],
                roleId: [
                    {
                        required: true,
                        message: "请选择角色！",
                        trigger: "change"
                    }
                ],
                departmentId: [
                    {
                        required: true,
                        message: "请选择所在部门！",
                        trigger: "change"
                    }
                ],
                realName: [
                    {
                        required: true,
                        message: "请填写正确的格式！",
                        trigger: "blur"
                    }
                ],
                mobilePhone: [
                    {
                        required: true,
                        message: "请填写正确的手机号！",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        required: true,
                        type: "email",
                        message: "请填写正确的邮箱地址！",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        confrimSub() {
            this.$refs["formCustom"].validate(valid => {
                console.log(this.formWrapperObj);
                if (valid) {
                    addAuditEmployee(this.formWrapperObj).then(res => {
                        console.log(res);
                        if (!res.code) {
                            this.$router.push({ path: "/user_management" });
                            this.$Message.success(res.message);
                        } else this.$Message.error(res.message);
                    });
                } else {
                    this.$Message.waring("请填写完整信息");
                }
            });
        }
    },
    created() {
        roleManage({ pageNo: 1, pageSize: 10 }).then(res => {
            if (!res.code) {
                this.roleArr = res.data.content;
            } else this.$Message.error(res.message);
        });
        departmentManage().then(res => {
            if (!res.code) {
                this.departArr = res.data.content;
            } else this.$Message.error(res.message);
        });
        this.employeeID = getStore("employeeID");
        if (!!this.employeeID) {
            employeeDetail({ id: this.employeeID }).then(res => {
                if (!res.code) {
                    let formWrapperObj = res.data;
                    formWrapperObj.departmentId = String(
                        formWrapperObj.departmentId
                    );
                    formWrapperObj.roleId = String(formWrapperObj.roleId);
                    this.formWrapperObj = formWrapperObj;
                } else this.$Message.error(res.message);
                console.log(res);
            });
        } else {
            const pattern = /[^\u4e00-\u9fa5]{6,18}/;
            this.$set(this.ruleFrom, "password", [
                {
                    required: true,
                    message: "请填写正确的密码6-18位不包含中文！",
                    trigger: "blur",
                    pattern
                }
            ]);
        }
    }
};
</script>

<style lang="less" scoped>
.mainEmployeeContent {
    .ivu-form-item {
        margin: 25px auto;
        width: 380px;
    }
    .ivu-form-item-content {
        a {
            position: absolute;
            right: -60px;
            top: 0;
        }
    }
    .dashLine {
        text-align: center;
        border-top: 1px dashed #d2d2d2;
        button {
            color: #b3b1b1;
            &:hover {
                color: #57a3f3;
            }
        }
    }
}
</style>