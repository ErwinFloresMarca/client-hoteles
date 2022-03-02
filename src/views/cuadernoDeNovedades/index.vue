<template>
  <div>
    <Title title="Cuadernos De Novedades" />
    <FilterResource :listProperties="properties" defaultProperty="fechaCreacion" @on-filter="onFilter">
      <template #filter-options>
        <el-button type="primary" :icon="Plus" size="mini" @click="onNew()">Nuevo</el-button>
      </template>
    </FilterResource>
    <div class="list-container">
      <list-cuaderno-novedades :list="cuadernos" />
      <Pagination
        :total="pagination.total"
        :page="pagination.skip + 1"
        :limit="pagination.limit"
        @pagination="onPaginate"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Title from '@/components/Title.vue'
import Pagination from '@/components/Pagination/index.vue'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue-demi'
import { ObjTy } from '@/types/common'
import { CuadernoDeNovedadResource } from '@/api/cuadernoDeNovedad'
import ListCuadernoNovedades from './components/ListCuadernoNovedades.vue'
import FilterResource from '@/components/FilterResource/index.vue'
export default {
  name: 'CuadernoDeNovedades',
  components: { Title, Pagination, ListCuadernoNovedades, FilterResource },
  setup() {
    const state = reactive<any>({
      selectCuaderno: undefined,
      cuadernos: [],
      properties: [{ key: 'fechaCreacion', label: 'Fecha de Creación', filterable: false }],
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
      CuadernoDeNovedadResource.list({
        ...state.filter,
        include: [{ relation: 'user' }],
        limit: state.pagination.limit,
        skip: state.pagination.skip * state.pagination.limit
      }).then((resp: any) => {
        state.cuadernos = resp.data
        state.loading = false
      })
    }
    const getCant = () => {
      CuadernoDeNovedadResource.count({ ...state.filter.where }).then((resp: any) => {
        state.pagination.total = resp.data.count
      })
    }
    getList()
    return {
      ...toRefs(state),
      Delete,
      Edit,
      Plus,
      onPaginate,
      onFilter,
      getCant,
      getList
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
