<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handle">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">后台管理系统</p>
        <p slot="title">Business Management System</p>
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="username">
            <Input v-model="form.username" :disabled="btnDisable" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              type="password"
              v-model="form.password"
              :disabled="btnDisable"
              placeholder="请输入密码"
            >
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
            </Input>
          </FormItem>
          <FormItem style="margin-top:10px">
            <Button @click="handle('loginForm')" type="primary" long>登录</Button>
          </FormItem>
          <!-- <p style='color:red;text-align:center' v-if="messshow">{{errormessage}}</p> -->
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";

import { setStore } from "@/config/storage";
import { signIn } from "@/service/getData";

export default {
  data() {
    return {
      btnDisable: false,
      form: {
        username: "",
        password: ""
      },
      phoneNum: null,
      messshow: false,
      errormessage: null,
      rules: {
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      permissions: {}
    };
  },
  methods: {
    handle() {
        // 登录接口
      signIn(this.form)
        .then(res => {
          if (!res.code) {
              console.log(res);
            Cookies.set("user", res.data.admin.username, { expires: 7 });
            Cookies.set("userInfo", res.data.admin, { expires: 7 });
            setStore("leftSidebarList", res.data.permissions);
            // console.log("左侧菜单",res.data.permissions);
            setStore("username",res.data.admin.username);
            this.$router.push({ name: "home_index" });
          } else this.$Message.error(res.message);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  beforeRouteLeave(to, from, next) {
    window.location.reload();
    next();
  },
  created() {
    this.phoneNum = Cookies.get("userPhone") || "";
  }
};
</script>