<template>
  <div class="login-container columnCC">
    <el-form ref="refloginForm" size="medium" class="login-form" :model="formInline" :rules="formRulesMixin">
      <div class="title-container">
        <h3 class="title text-center">{{ settings.title }}</h3>
      </div>
      <el-form-item prop="nombreUsuario" :rules="formRulesMixin.isNotNull">
        <el-input
          ref="refNombreUsuario"
          v-model="formInline.nombreUsuario"
          type="text"
          name="nombreUsuario"
          placeholder="Nombre de Usuario"
        />
      </el-form-item>
      <el-form-item prop="nombreCompleto" :rules="formRulesMixin.isNotNull">
        <el-input
          ref="refNombreCompleto"
          v-model="formInline.nombreCompleto"
          type="text"
          name="nombreCompleto"
          placeholder="Nombre de Usuario"
        />
      </el-form-item>
      <el-form-item prop="email" :rules="formRulesMixin.isNotNull">
        <el-input
          ref="refEmail"
          v-model="formInline.email"
          type="email"
          name="email"
          placeholder="Correo Electrónico"
        />
      </el-form-item>
      <!--<el-form-item prop="password" :rules="formRulesMixin.passwordValid">-->
      <el-form-item prop="password" :rules="formRulesMixin.isNotNull">
        <div class="rowSC">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="refPassword"
            v-model="formInline.password"
            :type="passwordType"
            name="password"
            placeholder="Contraseña"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </div>
      </el-form-item>
      <el-form-item
        prop="passwordConfirm"
        :rules="[...formRulesMixin.isNotNull, { validator: passwordConfirmValid, trigger: 'blur' }]"
      >
        <div class="rowSC">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="refPasswordConfirm"
            v-model="formInline.passwordConfirm"
            :type="passwordType"
            name="passwordConfirm"
            @keyup.enter="signUpHandle"
            placeholder="Repita la Contraseña"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </div>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-button type="danger" class="login-btn" size="medium" @click.prevent="cancelhandle">Cancelar</el-button>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-button :loading="loading" type="primary" class="login-btn" size="medium" @click.prevent="signUpHandle">
            Registrarse
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SignUp'
}
</script>

<script setup lang="ts">
import { reactive, getCurrentInstance, watch, ref } from 'vue'
import settings from '@/settings'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ObjTy } from '@/types/common'
import { UserResource } from '@/api/user'
import { ElMessage } from 'element-plus'
let { proxy }: any = getCurrentInstance()
//form
let formInline = reactive({
  nombreUsuario: '',
  nombreCompleto: '',
  email: '',
  password: '',
  passwordConfirm: ''
})
let state: ObjTy = reactive({
  otherQuery: {},
  redirect: undefined
})

/* listen router change  */
const route = useRoute()
let getOtherQuery = (query: ObjTy) => {
  return Object.keys(query).reduce((acc: ObjTy, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  route,
  (route) => {
    const query = route.query
    if (query) {
      state.redirect = query.redirect
      state.otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)
/*
 *  login relative
 * */
let loading = ref(false)
const store = useStore()
let signUpHandle = () => {
  let refloginForm = ''
  proxy.$refs['refloginForm'].validate((valid: boolean) => {
    if (valid) {
      signUpReq()
    } else {
      return false
    }
  })
}
let cancelhandle = () => {
  proxy.$router.push({ path: '/login' })
}
let signUpReq = () => {
  loading.value = true
  console.log('send data to server')
  UserResource.signup({ ...formInline, passwordConfirm: undefined }, !!state.otherQuery.role).then((resp: any) => {
    ElMessage({
      message: `El suaurio ${resp.nombreCompleto} fue creado exitosamente, para inciar sesion un administrador debe aprobar su registro.`,
      type: 'success',
      duration: 5000
    })
    proxy.$router.push({ path: '/login' })
  })
}

/*
 *  password show or hidden
 * */
let passwordType = ref('password')
const refPassword: any = ref(null)
let showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  proxy.$nextTick(() => {
    refPassword.value.focus()
  })
}
/*
 * pasword confirm valid
 * */
let passwordConfirmValid = (rule: any, value: string, cb: (error?: Error) => true) => {
  if (value !== formInline.password) {
    cb(new Error('No es igual que la contraseña'))
  } else {
    cb()
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  height: 100vh;
  width: 100%;
  background-color: #2d3a4b;
  .login-form {
    margin-bottom: 20vh;
    width: 360px;
  }
  .title-container {
    .title {
      font-size: 22px;
      color: #eee;
      margin: 0 auto 25px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}

.svg-container {
  padding-left: 6px;
  color: $dark_gray;
  text-align: center;
  width: 30px;
}

//错误提示信息
.tip-message {
  color: #e4393c;
  height: 30px;
  margin-top: -12px;
  font-size: 12px;
}

//登录按钮
.login-btn {
  width: 100%;
  margin-bottom: 30px;
}
.show-pwd {
  width: 50px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  text-align: center;
}
</style>

<style lang="scss">
//css 样式重置 增加个前缀避免全局污染
.login-container {
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-input input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 10px 5px 10px 15px;
    color: #fff;
    height: 42px; //此处调整item的高度
    caret-color: #fff;
  }
}
</style>
