<template>
  <div class="novedad-container">
    <div class="message-layout">
      <div
        class="message-alert"
        :style="{
          width: `calc(100% ${editable ? '- 80px' : ''})`
        }"
      >
        <el-alert :type="nvd.importancia" effect="light" show-icon :closable="false">
          <template #title>
            {{ nvd.detalle }}
          </template>
        </el-alert>
      </div>
      <el-button
        v-if="editable"
        class="message-options"
        type="warning"
        size="mini"
        circle
        :icon="Edit"
        @click="edit = !edit"
      />
      <el-button
        v-if="editable"
        class="message-options"
        type="danger"
        size="mini"
        circle
        :icon="Delete"
        @click="onDelete"
      />
    </div>
    <el-form
      v-if="editable && edit"
      :model="nvd"
      ref="form"
      :rules="formRulesMixin"
      label-width="100px"
      :inline="false"
      size="mini"
    >
      <el-form-item label="Novedad" prop="detalle" :rule="formRulesMixin.cantBeBlanck">
        <el-input v-model="nvd.detalle" type text></el-input>
      </el-form-item>
      <el-form-item label="Importancia" prop="importancia" :rule="formRulesMixin.cantBeBlanck">
        <!-- <el-input v-model="nvd.importancia" type text></el-input> -->
        <el-select v-model="nvd.importancia" placeholder="importancia de la novedad" clearable>
          <el-option v-for="item in listImportancia" :key="item.v" :label="item.l" :value="item.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-row type="flex" justify="space-around">
          <el-button type="primary" @click="onChange">Guardar</el-button>
          <el-button @click="onCancel">Cancelar</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { INovedad } from '@/types/apiResources'
import { computed, PropType, ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
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
    const listImportancia = [
      { l: 'Por defecto', v: 'info' },
      { l: 'Alarma', v: 'warning' },
      { l: 'Urgente', v: 'error' }
    ]
    const edit = ref<boolean>(false)
    const onChange = () => {
      edit.value = false
      emit('update:novedad', nvd.value)
      emit('change', nvd.value)
    }
    const onDelete = () => {
      emit('delete', nvd.value)
    }
    const onCancel = () => {
      edit.value = false
    }
    return {
      nvd,
      edit,
      listImportancia,
      Edit,
      Delete,
      onChange,
      onDelete,
      onCancel
    }
  }
}
</script>
<style lang="scss">
.novedad-container {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
}
.message-layout {
  width: 100%;
  margin-bottom: 5px;
}
.message-alert {
  display: inline-block;
}
.message-options {
  margin-left: 5px;
}
</style>
