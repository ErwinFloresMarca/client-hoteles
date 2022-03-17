<template>
  <div>
    <Title title="PERSONAS" />
    <FilterResource :listProperties="properties" defaultProperty="fechaCreacion" @on-filter="onFilter">
      <el-button type="primary" :icon="Plus" size="mini" @click="onNew()">Nuevo</el-button>
    </FilterResource>
    <div class="list-container">
      <el-table :data="personas" border stripe v-loading="loading">
        <el-table-column width="50px" label="No." fixed="left">
          <template #default="scope">
            {{ scope.$index + 1 + pagination.limit * pagination.skip }}
          </template>
        </el-table-column>
        <el-table-column v-for="prop in properties" :key="prop.key" :prop="prop.key" :label="prop.label">
          <template #default="scope">
            <el-button
              v-if="prop.key === 'estado'"
              :key="`btn-state-${scope.row.estado ? 's' : 'd'}-${scope.row.id}`"
              :type="scope.row.estado ? 'success' : 'danger'"
              size="mini"
              @click="onChangeState(scope.row.id, scope.row.estado)"
            >
              {{ scope.row.estado ? 'Activo' : 'Inactivo' }}
            </el-button>
            <span v-else-if="prop.key === 'fechaCreacion'">
              {{ formatTime(scope.row[prop.key], '{d}/{m}/{y}') }}
            </span>
            <span v-else>
              {{ scope.row[prop.key] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Opciones" width="220px" fixed="right">
          <template #default="scope">
            <el-button type="warning" :icon="Edit" size="mini" @click="onEdit(scope.row)">Editar</el-button>
            <el-button type="danger" :icon="Delete" size="mini" @click="onDelete(scope.row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="pagination.total"
        :page="pagination.skip + 1"
        :limit="pagination.limit"
        @pagination="onPaginate"
      />
    </div>
    <dialog-persona-form ref="formDialog" :persona="selectPersona" @on-cancel="onCancel" @on-success="onSuccess" />
  </div>
</template>
<script lang="ts">
import Title from '@/components/Title.vue'
import FilterResource from '@/components/FilterResource/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { reactive, ref, toRefs } from 'vue-demi'
import { ElMessage } from 'element-plus'
import { ObjTy } from '@/types/common'
import { PersonaResource } from '@/api/persona'
import { IPersona } from '@/types/apiResources'
import DialogPersonaForm from './components/DialogPersonaForm.vue'
export default {
  name: 'Salones',
  components: { Title, FilterResource, Pagination, DialogPersonaForm },
  setup() {
    const state = reactive<any>({
      selectPersona: undefined,
      personas: [],
      properties: [
        { key: 'documento', label: 'Documento', filterable: true },
        { key: 'nombres', label: 'Nombres', filterable: true },
        { key: 'apellidos', label: 'Apellidos', filterable: true },
        { key: 'correo', label: 'Correo', filterable: true },
        { key: 'clave', label: 'Clave', filterable: true },
        { key: 'estado', label: 'Estado', filterable: false, disabled: true },
        { key: 'fechaCreacion', label: 'Fecha de Creación' }
      ],
      pagination: {
        total: 0,
        skip: 0,
        limit: 10
      },
      filter: { where: {} },
      loading: false
    })

    const onPaginate = (options: { page: number; limit: number }) => {
      state.pagination = {
        ...state.pagination,
        limit: options.limit,
        skip: options.page - 1
      }
    }
    const onFilter = (data: ObjTy) => {
      state.filter = { where: {}, ...data }
      getList()
    }
    const getList = () => {
      state.loading = true
      getCant()
      PersonaResource.list({
        ...state.filter,
        include: [{ relation: 'tipoPersona' }],
        limit: state.pagination.limit,
        skip: state.pagination.skip * state.pagination.limit
      }).then((resp: any) => {
        state.personas = resp.data
        state.loading = false
      })
    }
    const getCant = () => {
      PersonaResource.count({
        ...state.filter.where
      }).then((resp: any) => {
        state.pagination.total = resp.data.count
      })
    }
    const onChangeState = (id: string, estado: boolean) => {
      PersonaResource.update(id, { estado: !estado }).then(() => {
        ElMessage({
          message: 'Estado actualizado exitosamente!',
          type: 'success'
        })
        getList()
      })
    }
    const onNew = () => {
      formDialog.value.toggleVisible()
    }
    const onEdit = (habitacion: IPersona) => {
      state.selectPersona = habitacion
      formDialog.value.toggleVisible()
    }
    const onDelete = (id: string) => {
      PersonaResource.destroy(id).then(() => {
        ElMessage({
          message: 'Salon eliminado exitosamente',
          type: 'success'
        })
        getList()
      })
    }
    const onCancel = () => {
      state.selectPersona = undefined
    }
    const onSuccess = () => {
      state.selectPersona = undefined
      getList()
    }
    const formDialog = ref<any>(null)
    getList()
    return {
      ...toRefs(state),
      Delete,
      Edit,
      Plus,
      onPaginate,
      onFilter,
      getCant,
      getList,
      onChangeState,
      onNew,
      onEdit,
      onDelete,
      onCancel,
      onSuccess,
      formDialog
    }
  }
}
</script>
<style lang="scss">
.list-container {
  padding: 5px;
  height: 100%;
}
</style>
