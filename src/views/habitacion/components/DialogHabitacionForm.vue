<template>
  <el-dialog
    custom-class="dialog"
    :title="`${edit ? 'Editar' : 'Nueva'} Habitacion`"
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
      size="medium"
      :disabled="loading"
    >
      <el-form-item label="Codigo" prop="codigo" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.codigo" type="text" />
      </el-form-item>
      <el-form-item label="Detalle" prop="detalle" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.detalle" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="Precio" prop="precio" :rules="formRulesMixin.cantBeBlanck">
        <el-input-number
          style="width: 100%"
          v-model="data.precio"
          type="number"
          :precision="2"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Piso" prop="piso">
        <el-input-number style="width: 100%" v-model="data.piso" type="number" :step="1" controls-position="right" />
      </el-form-item>
      <el-form-item label="Estado" prop="estadoId" :rules="formRulesMixin.cantBeBlanck">
        <select-estado v-model="data.estadoId" />
      </el-form-item>
      <el-form-item label="Categoría" prop="categoriaId" :rules="formRulesMixin.cantBeBlanck">
        <select-categoria v-model="data.categoriaId" />
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
import { IHabitacion } from '@/types/apiResources'
import { ElMessage } from 'element-plus'
import { HabitacionResource } from '@/api/habitacion'
import SelectEstado from '@/views/estado/components/SelectEstado.vue'
import SelectCategoria from '@/views/categoria/components/SelectCategoria.vue'
export default {
  components: { SelectEstado, SelectCategoria },
  name: 'DialogHabitacionForm',
  props: {
    habitacion: {
      type: Object as PropType<IHabitacion | undefined>,
      default: undefined
    }
  },
  emits: ['on-success', 'on-cancel'],
  setup(props, { emit }) {
    const defaultHabitacion: IHabitacion = {
      codigo: '',
      detalle: '',
      precio: 0
    }
    const data = ref<IHabitacion>(defaultHabitacion)
    const loading = ref<boolean>(false)
    const formData = ref<any>(null)
    const visible = ref<boolean>(false)
    watch(
      () => props.habitacion,
      () => {
        if (props.habitacion) data.value = { ...props.habitacion }
        else data.value = defaultHabitacion
      }
    )
    const edit = computed({
      get: () => {
        return !!props.habitacion?.id
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
            HabitacionResource.store(data.value)
              .then(() => {
                ElMessage({
                  message: `Habitacion '${data.value.codigo}' creado exitosamente!`,
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
            HabitacionResource.update(data.value.id || '', data.value)
              .then(() => {
                ElMessage({
                  message: `Habitacion '${data.value.codigo}' actualizada exitosamente!`,
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
  min-width: 350px;
}
</style>
