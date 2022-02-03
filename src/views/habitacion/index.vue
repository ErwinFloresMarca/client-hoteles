<template>
  <div>
    <Title title="HABITACIONES" />
    <FilterResource :listProperties="properties" defaultProperty="fechaCreacion" @on-filter="onFilter">
      <el-button type="primary" :icon="Plus" size="mini" @click="onNew()">Nuevo</el-button>
    </FilterResource>
    <div class="list-container">
      <el-table :data="habitaciones" border stripe v-loading="loading">
        <el-table-column width="50px" label="No." fixed="left">
          <template #default="scope">
            {{ scope.$index + 1 + pagination.limit * pagination.skip }}
          </template>
        </el-table-column>
        <el-table-column v-for="prop in properties" :key="prop.key" :prop="prop.key" :label="prop.label">
          <template #default="scope">
            <el-button
              v-if="prop.key === 'estado'"
              :type="scope.row.estado ? 'success' : 'danger'"
              size="mini"
              @click="onChangeState(scope.row.id, scope.row.estado)"
            >
              <!-- TODO: change manage estado habitaciones and Categoria -->
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
    <dialog-habitacion-form
      ref="formDialog"
      :habitacion="selectHabitacion"
      @on-cancel="onCancel"
      @on-success="onSuccess"
    />
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
import { HabitacionResource } from '@/api/habitacion'
import { IHabitacion } from '@/types/apiResources'
import DialogHabitacionForm from './components/DialogHabitacionForm.vue'
export default {
  name: 'Habitaciones',
  components: { Title, FilterResource, Pagination, DialogHabitacionForm },
  setup() {
    const state = reactive<any>({
      selectHabitacion: undefined,
      habitaciones: [],
      properties: [
        { key: 'codigo', label: 'Código', filterable: true },
        { key: 'detalle', label: 'Detalle', filterable: true },
        { key: 'precio', label: 'Precio', filterable: true },
        { key: 'estado', label: 'Estado', filterable: false, disabled: true },
        { key: 'piso', label: 'Piso', filterable: true },
        { key: 'categoria', label: 'Categoria', filterable: true, disabled: true },
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
      HabitacionResource.list({
        ...state.filter,
        include: [{ relation: 'categoria' }, { relation: 'estado' }],
        limit: state.pagination.limit,
        skip: state.pagination.skip * state.pagination.limit
      }).then((resp: any) => {
        state.habitaciones = resp.data
        state.loading = false
      })
    }
    const getCant = () => {
      HabitacionResource.count({
        ...state.filter.where
      }).then((resp: any) => {
        state.pagination.total = resp.data.count
      })
    }
    const onChangeState = (id: string, estado: boolean) => {
      HabitacionResource.update(id, { estado: !estado }).then(() => {
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
    const onEdit = (habitacion: IHabitacion) => {
      state.selectHabitacion = habitacion
      formDialog.value.toggleVisible()
    }
    const onDelete = (id: string) => {
      HabitacionResource.destroy(id).then(() => {
        ElMessage({
          message: 'Habitacion eliminado exitosamente',
          type: 'success'
        })
        getList()
      })
    }
    const onCancel = () => {
      state.selectHabitacion = undefined
    }
    const onSuccess = () => {
      state.selectHabitacion = undefined
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
