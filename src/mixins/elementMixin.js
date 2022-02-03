const mixin = {
  data() {
    /* element form校验相关*/
    // 密码必须为6-18位字母、数字
    let passwordValid = (rule, value, callback) => {
      if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
        callback(new Error('6-18 caracteres alfanuméricos'))
      } else {
        callback()
      }
    }
    // 大于0的整数
    let upZeroInt = (rule, value, callback) => {
      if (!/^\+?[1-9]\d*$/.test(value)) {
        callback(new Error('Un entero mayor que 0'))
      } else {
        callback()
      }
    }
    let cantBeBlanck = (rule, value, callback) => {
      if (!value) {
        console.log('campo vacio')
        callback(new Error('Este campo no puede estar vacio'))
      } else {
        if (value.length == 0) callback(new Error('Este campo no puede estar vacio'))
        else callback()
      }
    }
    let upZeroIntCanNull = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!/^\+?[1-9]\d*$/.test(value)) {
          callback(new Error('Un entero mayor que 0'))
        } else {
          callback()
        }
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Introduzca una contraseña'))
      } else {
        callback()
      }
    }
    return {
      /* table*/
      pageNumMixin: 1,
      pageSizeMixin: 10,
      pageTotalMixin: 0,
      tableDataMixin: [],
      rowDeleteIdArrMixin: [],
      loadingIdMixin: null,
      /* 表单*/
      formModelMixin: {},
      subFormMixin: {},
      searchFormMixin: {},
      /* 表单校验*/
      formRulesMixin: {
        isNotNull: [{ required: true, message: 'Este campo no puede estar vacio', trigger: 'blur' }],
        isNotNullSecond: [{ required: true, message: 'Este campo no puede estar vacio', trigger: 'blur' }],
        mLength8: [
          { required: true, message: 'Este campo es obligatorio.', trigger: 'blur' },
          { max: 8, message: 'Debe contener 8 caracteres como minimo', trigger: 'blur' }
        ],
        minLength7: [
          { required: true, message: 'Este campo es obligatorio.', trigger: 'blur' },
          { min: 7, message: 'Debe contener 7 caracteres como minimo', trigger: 'blur' }
        ],
        length17: [
          { required: true, message: 'Este campo es obligatorio.', trigger: 'blur' },
          { min: 17, max: 17, message: 'Debe contener 17 caracteres', trigger: 'blur' }
        ],
        desc: [{ validator: validatePass, trigger: 'blur' }],
        cantBeBlanck: [
          { required: true, message: 'Este campo no puede estar vacio', trigger: 'blur' },
          { validator: cantBeBlanck, trigger: 'blur' }
        ],
        upZeroInt: [{ validator: upZeroInt, trigger: 'blur' }],
        upZeroIntCanNull: [{ validator: upZeroIntCanNull, trigger: 'blur' }],
        passwordValid: [{ validator: passwordValid, trigger: 'blur' }]
      },
      /* 时间packing相关*/
      datePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 86400000
        }
      },
      startEndArrMixin: [],
      startEndArrSubMixin: [],
      /* dialog相关*/
      dialogTitleMixin: 'Aumentar',
      detailDialogMixin: false,
      isDialogEditMixin: false,
      dialogVisibleMixin: false,
      tableLoadingMixin: false,
      /* 级联相关*/
      cascaderKeyMixin: 1,
      SetKesDeptMixin: {
        value: 'id',
        expandTrigger: 'hover',
        label: 'label',
        children: 'children'
      },
      SetKesDeptMixinNoStrictlyMixin: {
        value: 'id',
        expandTrigger: 'hover',
        label: 'label',
        children: 'children',
        checkStrictly: true
      },
      SetKesDeptMixinNoStrictly: {
        value: 'id',
        expandTrigger: 'hover',
        label: 'label',
        children: 'children',
        checkStrictly: true
      },
      cascaderOptionsMixinOne: [],
      cascaderOptionsMixin: [],
      /* 树相关*/
      treeDataMixin: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    /* 级联*/
    casHandleChangeMixin() {
      // 解决目前级联选择器搜索输入报错问题
      ++this.cascaderKey
    },
    /*
     * 通知弹框
     * message：通知的内容
     * type：通知类型
     * duration：通知显示时长（ms）
     * */
    elMessageMixin(message, type) {
      type = type || 'success'
      this.$message({
        showClose: true,
        message: message || '成功',
        type: type,
        center: false
      })
    },
    /*
     * loading加载框
     * 调用后通过 this.loadingIdMixin.close() 进行关闭
     * */
    elLoadingMixin() {
      this.loadingIdMixin = this.$loading({
        lock: true,
        text: 'Cargando...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    },
    /*
     * 提示
     * message: 提示内容
     * type：提示类型
     * title：提示标题
     * duration：提示时长（ms）
     * */
    elNotifyMixin(message, type, title, duration) {
      type = type || 'success'
      this.$notify[type]({
        title: title || 'Error Inesperado',
        message: message || 'Por favor, pase un mensaje de aviso',
        position: 'top-right',
        duration: duration || 2500,
        offset: 40
      })
    },
    /*
      确认弹框(没有取消按钮)
    * title:提示的标题
    * message:提示的内容
    * return Promise
    * */
    elConfirmNoCancelBtnMixin(title, message) {
      return this.$confirm(message || '¿Está seguro de que desea eliminarlo?', title || 'Confirmación', {
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        showCancelButton: false,
        type: 'warning'
      }).catch(() => {})
    },
    /*
     * 确认弹框
     * title:提示的标题
     * message:提示的内容
     * return Promise
     * */
    elConfirmMixin(title, message) {
      return this.$confirm(message || '你确定要删除¿Está seguro de que desea eliminarlo?吗', title || 'Confirmación', {
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      })
    }
  }
}

export default mixin
