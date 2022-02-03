<template>
  <div>
    <Title title="SALONES" />
    <FilterResource :listProperties="properties" defaultProperty="fechaCreacion" @on-filter="onFilter">
      <el-button type="primary" :icon="Plus" size="mini" @click="onNew()">Nuevo</el-button>
    </FilterResource>
    <div class="list-container">
      <el-table :data="salones" border stripe v-loading="loading">
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
              <!-- TODO: change manage estado -->
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
    <dialog-salon-form ref="formDialog" :salon="selectSalon" @on-cancel="onCancel" @on-success="onSuccess" />
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
import { SalonResource } from '@/api/salon'
import { ISalon } from '@/types/apiResources'
import DialogSalonForm from './components/DialogSalonForm.vue'
export default {
  name: 'Salones',
  components: { Title, FilterResource, Pagination, DialogSalonForm },
  setup() {
    const state = reactive<any>({
      selectSalon: undefined,
      salones: [],
      properties: [
        { key: 'codigo', label: 'Código', filterable: true },
        { key: 'detalle', label: 'Detalle', filterable: true },
        { key: 'precio', label: 'Precio', filterable: true },
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
      SalonResource.list({
        ...state.filter,
        include: [{ relation: 'estado' }],
        limit: state.pagination.limit,
        skip: state.pagination.skip * state.pagination.limit
      }).then((resp: any) => {
        state.salones = resp.data
        state.loading = false
      })
    }
    const getCant = () => {
      SalonResource.count({
        ...state.filter.where
      }).then((resp: any) => {
        state.pagination.total = resp.data.count
      })
    }
    const onChangeState = (id: string, estado: boolean) => {
      SalonResource.update(id, { estado: !estado }).then(() => {
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
    const onEdit = (habitacion: ISalon) => {
      state.selectSalon = habitacion
      formDialog.value.toggleVisible()
    }
    const onDelete = (id: string) => {
      SalonResource.destroy(id).then(() => {
        ElMessage({
          message: 'Salon eliminado exitosamente',
          type: 'success'
        })
        getList()
      })
    }
    const onCancel = () => {
      state.selectSalon = undefined
    }
    const onSuccess = () => {
      state.selectSalon = undefined
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
