<template>
  <el-dialog
    custom-class="dialog"
    :title="`${edit ? 'Editar' : 'Nueva'} Persona`"
    width="30%"
    v-model="visible"
    @close="onClose"
  >
    <el-form
      :model="data"
      ref="formData"
      :rules="formRulesMixin"
      label-width="140px"
      :inline="false"
      size="medium"
      :disabled="loading"
    >
      <el-form-item label="Clave" prop="clave" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.clave" type="text" />
      </el-form-item>
      <el-form-item label="Tipo de Documento" prop="tipoDocumento" :rules="formRulesMixin.cantBeBlanck">
        <el-select v-model="data.tipoDocumento" placeholder="seleccione un tipo de documento" clearable>
          <el-option v-for="item in ['CI', 'NIT']" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Documento" prop="documento" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.documento" type="text" />
      </el-form-item>
      <el-form-item label="Nombres" prop="nombres" :rules="formRulesMixin.cantBeBlanck">
        <el-input v-model="data.nombres" type="text" />
      </el-form-item>
      <el-form-item label="Apellidos" prop="apellidos">
        <el-input v-model="data.apellidos" type="text" />
      </el-form-item>
      <el-form-item label="Correo Elextrónico" prop="correo">
        <el-input v-model="data.correo" type="text" />
      </el-form-item>
      <el-form-item label="Tipo de Persona" :rules="formRulesMixin.cantBeBlanck">
        <select-tipo-persona v-model="data.tipoPersonaId" />
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
import { IPersona } from '@/types/apiResources'
import { ElMessage } from 'element-plus'
import { PersonaResource } from '@/api/persona'
import SelectTipoPersona from '@/views/tipoPersona/components/SelectTipoPersona.vue'

export default {
  components: { SelectTipoPersona },
  name: 'DialogPersonaForm',
  props: {
    persona: {
      type: Object as PropType<IPersona | undefined>,
      default: undefined
    }
  },
  emits: ['on-success', 'on-cancel'],
  setup(props, { emit }) {
    const defaultPersona: IPersona = {
      tipoDocumento: 'CI',
      documento: '',
      nombres: '',
      clave: '',
      tipoPersonaId: undefined
    }
    const data = ref<IPersona>(defaultPersona)
    const loading = ref<boolean>(false)
    const formData = ref<any>(null)
    const visible = ref<boolean>(false)
    watch(
      () => props.persona,
      () => {
        if (props.persona) data.value = { ...props.persona }
        else data.value = defaultPersona
      }
    )
    const edit = computed({
      get: () => {
        return !!props.persona?.id
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
          loading.value = true
          if (!edit.value) {
            PersonaResource.store(data.value)
              .then(() => {
                ElMessage({
                  message: `Persona '${data.value.documento}' creada exitosamente!`,
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
            PersonaResource.update(data.value.id || '', data.value)
              .then(() => {
                ElMessage({
                  message: `Persona '${data.value.documento}' actualizada exitosamente!`,
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               