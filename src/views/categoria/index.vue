<template>
  <div>
    <Title title="CATEGORIAS" />
    <FilterResource :listProperties="properties" defaultProperty="descripcion" @on-filter="onFilter">
      <el-button type="primary" :icon="Plus" size="mini" @click="onNew()">Nuevo</el-button>
    </FilterResource>
    <div class="list-container">
      <el-table :data="categorias" border stripe v-loading="loading">
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
    <dialog-categoria-form
      ref="formDialog"
      :categoria="selectCategoria"
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
import { CategoriaResource } from '@/api/categoria'
import DialogCategoriaForm from './components/DialogCategoriaForm.vue'
import { ICategoria } from '@/types/apiResources'
export default {
  components: { Title, FilterResource, Pagination, DialogCategoriaForm },
  name: 'Categorias',
  setup() {
    const state = reactive<any>({
      selectCategoria: undefined,
      categorias: [],
      properties: [
        { key: 'descripcion', label: 'Descripción', filterable: true },
        { key: 'estado', label: 'Estado', filterable: false },
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
      CategoriaResource.list({
        ...state.filter,
        limit: state.pagination.limit,
        skip: state.pagination.skip * state.pagination.limit
      }).then((resp: any) => {
        state.categorias = resp.data
        state.loading = false
      })
    }
    const getCant = () => {
      CategoriaResource.count({
        ...state.filter.where
      }).then((resp: any) => {
        state.pagination.total = resp.data.count
      })
    }
    const onChangeState = (id: string, estado: boolean) => {
      CategoriaResource.update(id, { estado: !estado }).then(() => {
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
    const onEdit = (categoria: ICategoria) => {
      state.selectCategoria = categoria
      formDialog.value.toggleVisible()
    }
    const onDelete = (id: string) => {
      CategoriaResource.destroy(id).then(() => {
        ElMessage({
          message: 'Categoria eliminada exitosamente',
          type: 'success'
        })
        getList()
      })
    }
    const onCancel = () => {
      state.selectCategoria = undefined
    }
    const onSuccess = () => {
      state.selectCategoria = undefined
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
