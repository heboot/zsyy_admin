<template>
    <div>
        <Card>
            <p slot="title">个人中心</p>
            <Row>
                <Table :columns="column_frist" :data="userpage" :loading="ifLoading" border></Table>
            </Row>

            <Modal v-model="showModel" title="修改密码" width="400" @on-ok="confirmSub" @on-cancel="$Message.info('已取消！')">
                <Form :model="userPW" :label-width="100" label-position="right" :rules="checkPass">
                    <FormItem label="旧密码：" prop="lastPassword">
                        <Input type="password" v-model="userPW.lastPassword" placeholder="请输入旧密码"
                            :maxlength="18"></Input>
                    </FormItem>
                    <FormItem label="新密码：" prop="newPassword">
                        <Input type="password" v-model="userPW.newPassword" placeholder="请输入新密码"
                            :maxlength="18"></Input>
                    </FormItem>
                    <FormItem label="确认密码：" prop="newPasswordSure">
                        <Input type="password" v-model="userPW.newPasswordSure" placeholder="请输入新密码"
                            :maxlength="18"></Input>
                    </FormItem>
                </Form>
            </Modal>
        </Card>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { getStore, setStore, removeStore } from "@/config/storage";
import { employeeDetail, fixPersonalPW } from "@/service/getData";
export default {
    data() {
        const pattern = /^[0-9a-zA-Z]{6,18}$/;
        return {
            checkPass: {
                lastPassword: {
                    required: true,
                    message: "请输入6-18位字母或者数字",
                    trigger: "blur",
                    pattern
                },
                newPassword: {
                    required: true,
                    message: "请输入6-18位字母或者数字",
                    trigger: "blur",
                    pattern
                },
                newPasswordSure: {
                    required: true,
                    message: "请输入6-18位字母或者数字",
                    trigger: "blur",
                    pattern
                }
            },
            column_frist: [
                {
                    title: "用户名",
                    key: "username"
                },
                {
                    title: "所在部门",
                    key: "departmentName"
                },
                {
                    title: "拥有权限",
                    key: "role"
                },
                {
                    title: "电话号码",
                    key: "mobilePhone"
                },
                {
                    title: "邮箱",
                    key: "email",
                    width: 180
                },
                {
                    title: "QQ",
                    key: "qq",
                    width: 180
                },
                {
                    title: "操作",
                    render: (h, obj) => {
                        return h(
                            "Button",
                            {
                                props: {
                                    type: "primary"
                                    // size: "small"
                                },
                                on: {
                                    click: () => {
                                        this.showModel = true;
                                    }
                                }
                            },
                            "修改密码"
                        );
                    }
                }
            ],
            userpage: [],
            ifLoading: true,
            showModel: false,
            userPW: {
                lastPassword: "",
                newPassword: "",
                newPasswordSure: "",
                id: ""
            }
        };
    },
    methods: {
        confirmSub() {
            let pass = true;
            const {
                newPassword,
                newPasswordSure,
                id,
                lastPassword
            } = this.userPW;
            if (newPassword !== newPasswordSure) {
                this.$Message.error("请确保输入的密码一致！");
                return;
            }
            for (let key in this.userPW) {
                if (!String(key).trim().length) pass = false;
            }

            if (pass) {
                fixPersonalPW({ lastPassword, newPassword, id })
                    .then(res => {
                        if (!res.code) {
                            this.$Message.success(res.message);
                        } else this.$Message.error(res.message);
                    })
                    .catch(err => console.log(err));
            } else this.$Message.warning("请完善信息！");
        }
    },
    created() {
        let personalInfo = JSON.parse(Cookies.get("userInfo"));
        this.userPW.id = personalInfo.id;
        employeeDetail({ id: personalInfo.id })
            .then(res => {
                if (!res.code) {
                    this.userpage = [res.data];
                    this.ifLoading = false;
                } else this.$Message.error(res.message);
            })
            .catch(err => console.log(err));
    }
};
</script>

<style lang="less" scoped>
</style>


