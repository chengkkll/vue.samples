<template>
  <div class="login">
    <div class="bg"></div>
    <!-- 登录/注册 账号 -->
    <div class="account-container" v-if="current !== 'forget'">
      <h2 class="title">{{CURRENT_MAP[current]}} {{PROJECT_NAME}} 帐号</h2>
      <hr class="header-line">
      <form autocomplete="off">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="info.account">
        </div>
        <div class="form-group">
          <label>密码
          </label>
          <input type="password" v-model="info.password" @keyup.enter="loginOrRegister">
        </div>
        <div class="form-group switch-forget">
          <a @click="switchPage('forget')">忘记密码?</a>
        </div>
      </form>
      <el-button 
        type="primary" 
        class="signin-btn"
        :disabled="loading || !info.account || !info.password"
        @click="loginOrRegister()">{{CURRENT_MAP[current]}}{{loading?'中...':''}}
      </el-button>
    </div>
    <a class="switch-page" v-if="current !== 'forget' && REGISTER_PAGE === 'on'">
      {{ current === 'login'?'还没有账号?':'已有账号'}} 
      <strong @click="switchPage(current === 'login' ? 'register' : 'login')">
        立即{{current === 'login'?'注册':'登录'}}
      </strong>
    </a>
    <!-- 忘记密码 -->
    <div class="account-container" v-if="current === 'forget'">
      <h2 class="title">找回密码</h2>
      <hr class="header-line">
      <form autocomplete="off">
        <div class="form-group">
          <label>手机号码</label>
          <input 
            placeholder="请输入合法的手机号码" 
            type="text" 
            v-model="forget.mobile" style="width: 60%">
            <!-- :disabled="loading || !/^1\d{10}$/.test(forget.mobile)" -->
          <el-button 
            type="primary" 
            size="small" 
            :disabled="!forgetMobileValid || loading || !forget.canSendCode"
            @click="sendCode()">{{ forget.step === 'sendCode' ? '发送验证码' : `${60 - forget.lastSend}秒后再试` }}
          </el-button>
        </div>
        <div class="form-group">
          <label>验证码</label>
          <input 
            placeholder="请输入验证码" 
            type="text" 
            v-model="forget.code">
        </div>
        <div class="form-group">
          <label>新登录密码</label>
          <input 
            placeholder="请输入 6-20 位新密码" 
            type="password" 
            v-model="forget.newPassword">
        </div>
         <div class="form-group">
          <label>确认新密码</label>
          <input 
            placeholder="请再次输入新密码" 
            type="password" 
            v-model="forget.newPasswordConfirm">
        </div>
        <div class="form-group switch-forget">
          <a @click="switchPage('login')">想起密码了?</a>
        </div>
      </form>
      <el-button 
        type="primary" 
        class="signin-btn"
        :disabled="canNotChangePassword"
        @click="changePasswordByCode()">确认
      </el-button>
    </div>
    
  </div>
</template>

<script>
import authApi from '@/model/api/auth';
import { setToken } from '@/config/http';
import env from '@/config/env';
import storage from '@/config/localstorage';

const CURRENT_MAP = {
  login: '登录',
  register: '登录',
  forget: '登录',
};

export default {
  name: 'Login',
  data() {
    return {
      PROJECT_NAME: env.PROJECT_NAME,
      REGISTER_PAGE: env.REGISTER_PAGE,
      CURRENT_MAP,
      info: {
        account: '',
        password: '',
      },
      forget: {
        mobile: '',
        code: '',
        step: 'sendCode',
        newPassword: '',
        newPasswordConfirm: '',
        canSendCode: true,
        lastSend: 0,
        timer: null,
      },
      current: 'login',
      loading: false,
    };
  },
  // 跳到这个页面不管是用户主动推出登录，还是因为 http 出现 401 还是用户手动输入地址
  created() {
    if (daovoice) {
      daovoice('init');
    }
    // 如果有token，都需要拿着token去后端验证一下，如果token过期需要清空，防止因为 token 过期导致的登录死循环
    if (storage.token) {
      authApi.getInfoByToken()
        .then(() => {
          this.$router.push({ name: 'IndexPage' });
        }, () => {
          // token 不可用，请求头的 token 置空清空掉
          setToken();
          storage.clear();
        });
    }
  },
  computed: {
    // 忘记密码的电话是否合法
    forgetMobileValid() {
      return /^1\d{10}$/.test(this.forget.mobile);
    },
    // 是否可以更改密码
    canNotChangePassword() {
      // 忙碌中 | 电话号码不合法 | 没有验证码 | 验证码还没发送 | 新密码长度太短
      return this.loading ||
        !this.forgetMobileValid ||
        !this.forget.code ||
        this.forget.step !== 'sended' ||
        this.forget.newPassword.length < 6 ||
        this.forget.newPassword !== this.forget.newPasswordConfirm;
    },
  },
  methods: {
    loginOrRegister() {
      if (this.loading) return;
      if (this.current === 'login') {
        this.login();
      } else {
        this.register();
      }
    },
    // 切换面板
    switchPage(current) {
      if (this.loading) return;
      this.current = current;
      document.title = `${this.PROJECT_NAME} - ${CURRENT_MAP[current]}`;
    },
    login() {
      this.loading = true;
      authApi.login(this.info)
        .then((res) => {
          setToken(res.token);
          this.$router.push({ name: 'IndexPage' });
        }, (res) => {
          this.loading = false;
          this.$message.error(_.get(res, 'data.message', '登录失败,请重试'));
        });
    },
    // 注册
    register() {
      this.loading = true;
      authApi.register(this.info)
        .then(() => {
          this.loading = false;
          this.$message.success('注册成功, 请您登录');
          this.switchPage('login');
        }, (res) => {
          this.loading = false;
          this.$message.error(_.get(res, 'data.message', '注册失败,请重试'));
        });
    },

    // 发送验证码
    sendCode() {
      this.loading = true;
      this.forget.canSendCode = false;
      this.forget.step = 'sended';
      authApi.sendCode(this.forget.mobile)
        .then(() => {
          this.loading = false;
          this.$message.success('验证码发送成功');
        }, (res) => {
          this.loading = false;
          this.$message.error(_.get(res, 'data.message', '验证码发送失败, 请稍后重试'));
        });
      this.forget.timer = setInterval(() => {
        this.forget.lastSend += 1;
        if (this.forget.lastSend >= 60) {
          this.forget.lastSend = 0;
          this.forget.canSendCode = true;
          this.forget.step = 'sendCode';
          clearInterval(this.forget.timer);
        }
      }, 1000);
    },

    // 验证验证码
    changePasswordByCode() {
      this.loading = true;
      authApi.changePasswordByCode(this.forget)
        .then(() => {
          this.loading = false;
          this.$message.success('密码修改成功, 请重新登录');
          this.switchPage('login');
        }, (res) => {
          this.loading = false;
          this.$message.error(_.get(res, 'data.message', '电话号码或验证码错误, 请重试'));
        });
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  padding-top: 140px;
  padding-bottom: 50px;
  .bg {
    position: fixed;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url('../../../assets/blue-mountain.jpg') no-repeat;
    background-size: cover;
  }
  .logo {
    margin-bottom: 10px;
    text-align: center;
    svg {
      width: 220px;
      height: 80px;
    }
  }
  .account-container {
    position: relative;
    width: 310px;
    margin: 0 auto;
    padding: 27px 20px 30px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 15px 30px 0 rgba(0,0,1,.1);
    .title {
      font-size: 17px;
      line-height: 24px;
      margin: 0;
      padding: 0 20px;
      text-align: center;
      color: #595f69;
      font-weight: 400;
    }
    .header-line {
      width: 120px;
      height: 1px;
      margin: 6px auto 14px;
      border: 0;
      background-color: #e4e7ed;
    }
    form .form-group {
      &.switch-forget{
        text-align: right;
        a{
          color: #9ba3af;
          cursor: pointer;
          text-decoration: underline;
        }
      }
      margin-bottom: 14px;
      label {
        line-height: 24px;
        display: block;
        margin-bottom: 5px;
        color: #9ba3af;
        a {
          line-height: 24px;
          text-decoration: none;
          color: #9ba3af;
          &.pull-right{
            float: right;
          }
        }
      }
      input {
        line-height: 1;
        width: 93%;
        height: 32px;
        margin: 0;
        padding: 0 10px;
        transition: border .25s ease;
        text-align: left;
        color: #3d444f;
        border: 1px solid #ccd1d9;
        border-radius: 2px;
        outline: 0;
        background-color: #fff;
        box-shadow: none;
      }
    }
    .signin-btn {
      width: 100%;
    }
  }
  .switch-page {
    font-size: 14px;
    display: block;
    width: 310px;
    margin: 30px auto 0;
    padding: 16px;
    text-align: center;
    text-decoration: none!important;
    color: rgba(255,255,255,.9)!important;
    border: 1px solid rgba(255,255,255,.3);
    border-radius: 4px;
    background-color: rgba(255,255,255,.12);
    text-shadow: 0 1px 4px rgba(0,0,0,.1);
    strong{
      cursor: pointer;
    }
  }
}
</style>
