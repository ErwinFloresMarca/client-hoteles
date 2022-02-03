<template>
  <div class="novedad-container">
    <el-alert :type="nvd.importancia" effect="light" show-icon closable @close="onDelete">
      <template #title>
        <el-button style="float: right" type="warning" size="mini" circle :icon="Edit" @click="edit = !edit">
          Editar
        </el-button>
        {{ nvd.detalle }}
      </template>
    </el-alert>
    <el-form
      v-if="edit"
      :model="nvd"
      ref="form"
      :rules="formRulesMixin"
      label-width="80px"
      :inline="true"
      size="normal"
    >
      <el-form-item label="Novedad" prop="detalle" :rule="formRulesMixin.cantBeBlanck">
        <el-input v-model="nvd.detalle" type text></el-input>
      </el-form-item>
      <el-form-item label="Importancia" prop="importancia" :rule="formRulesMixin.cantBeBlanck">
        <!-- <el-input v-model="nvd.importancia" type text></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onChange">Guardar</el-button>
        <el-button>Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { INovedad } from '@/types/apiResources'
import { computed, PropType, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
export default {
  name: 'Novedad',
  emits: {
    'update:novedad': (novedad: INovedad) => {
      return !!novedad.detalle
    },
    change: (novedad: INovedad) => {
      return !!novedad.detalle
    },
    delete: (novedad: INovedad) => {
      return !!novedad
    }
  },
  props: {
    novedad: {
      type: Object as PropType<INovedad>,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const nvd = computed({
      get: () => props.novedad,
      set: (v: INovedad) => {
        emit('update:novedad', v)
        emit('change', v)
      }
    })
    const edit = ref<boolean>(false)
    const onChange = () => {
      emit('update:novedad', nvd.value)
      emit('change', nvd.value)
    }
    const onDelete = () => {
      emit('delete', nvd.value)
    }
    return {
      nvd,
      edit,
      Edit,
      onChange,
      onDelete
    }
  }
}
</script>
<style lang="scss">
.novedad-container {
  width: 100%;
  margin: 10px;
}
</style>
