<template>
  <el-dialog
    custom-class="dialog"
    :title="`${edit ? 'Editar' : 'Nueva'} Categoria`"
    width="30%"
    v-model="visible"
    @close="onClose"
  >
    <el-form
      :model="data"
      ref="formData"
      :rules="formRulesMixin"
      label-width="100px"
      :inline="false"
      size="normal"
      :disabled="loading"
    >
      <el-form-item label="Descripción" prop="descripcion" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.descripcion" type="text" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="danger" :loading="loading" @click="onClose">Cancelar</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">Guardar</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { computed, PropType, ref, watch } from 'vue'
import { ICategoria } from '@/types/apiResources'
import { ElMessage } from 'element-plus'
import { CategoriaResource } from '@/api/categoria'
export default {
  name: 'DialogCategoriaForm',
  props: {
    categoria: {
      type: Object as PropType<ICategoria | undefined>,
      default: undefined
    }
  },
  emits: ['on-success', 'on-cancel'],
  setup(props, { emit }) {
    const data = ref<ICategoria>({ descripcion: '' })
    const loading = ref<boolean>(false)
    const formData = ref<any>(null)
    const visible = ref<boolean>(false)
    watch(
      () => props.categoria,
      () => {
        if (props.categoria) data.value = { ...props.categoria }
        else data.value = { descripcion: '' }
      }
    )
    const edit = computed({
      get: () => {
        return !!props.categoria?.id
      },
      set: () => {}
    })
    const toggleVisible = () => {
      visible.value = !visible.value
    }
    const onClose = () => {
      if (visible.value === true) {
        toggleVisible()
        emit('on-cancel')
      }
    }
    const onSubmit = () => {
      formData.value.validate((valid: boolean) => {
        if (valid) {
          console.log('valid form')
          loading.value = true
          if (!edit.value) {
            CategoriaResource.store(data.value)
              .then(() => {
                ElMessage({
                  message: `Categoria '${data.value.descripcion}' creado exitosamente!`,
                  type: 'success'
                })
                loading.value = false
                toggleVisible()
                emit('on-success')
              })
              .catch(() => {
                loading.value = false
              })
          } else {
            CategoriaResource.update(data.value.id || '', data.value)
              .then(() => {
                ElMessage({
                  message: `Categoria '${data.value.descripcion}' actualizada exitosamente!`,
                  type: 'success'
                })
                loading.value = false
                toggleVisible()
                emit('on-success')
              })
              .catch(() => {
                loading.value = false
              })
          }
        } else {
          ElMessage({
            message: 'Revice los errores',
            type: 'error'
          })
        }
      })
    }
    return {
      data,
      visible,
      edit,
      toggleVisible,
      onClose,
      onSubmit,
      formData,
      loading
    }
  }
}
</script>
<style lang="scss">
.dialog {
  min-width: 200px;
}
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       