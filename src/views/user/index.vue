<template>
  <div class="usuarios-container">
    <Title title="Usuarios" />
    <FilterResource :listProperties="properties" defaultProperty="nombreUsuario" @on-filter="onFilter"></FilterResource>
    <div class="list-container">
      <el-table :data="users" border stripe :loading="loading">
        <el-table-column width="50px" label="No.">
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
            <span v-else>
              {{ scope.row[prop.key] }}
            </span>
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
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import Title from '@/components/Title.vue'
import Pagination from '@/components/Pagination/index.vue'
import FilterResource from '@/components/FilterResource/index.vue'
import { ObjTy } from '@/types/common'
import { UserResource } from '@/api/user'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'Users',
  components: { Title, Pagination, FilterResource },
  data() {
    const pagination = reactive({
      total: 50,
      skip: 0,
      limit: 10
    })
    const users = ref([])
    const loading = ref(false)
    const filter = ref({ where: {} })
    const properties = [
      { key: 'nombreCompleto', label: 'Nombre Completo', filterable: true },
      { key: 'nombreUsuario', label: 'Nombre de usuario', filterable: true },
      { key: 'email', label: 'Correo Electronico', filterable: true },
      { key: 'estado', label: 'Estado', filterable: false },
      { key: 'fechaCreacion', label: 'Fecha de Creación', filterable: false }
    ]
    return {
      pagination,
      properties,
      users,
      loading,
      filter,
      Delete
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onPaginate(options: { page: number; limit: number }) {
      this.pagination = {
        ...this.pagination,
        limit: options.limit,
        skip: options.page - 1
      }
    },
    onFilter(data: ObjTy) {
      this.filter = { where: {}, ...data }
      this.getList()
    },
    getList() {
      this.loading = true
      this.getCant()
      UserResource.list({
        ...this.filter,
        limit: this.pagination.limit,
        skip: this.pagination.skip * this.pagination.limit
      }).then((resp: any) => {
        this.users = resp.data
        this.loading = false
      })
    },
    getCant() {
      UserResource.count({
        ...this.filter.where
      }).then((resp: any) => {
        this.pagination.total = resp.data.count
      })
    },
    onChangeState(id: string, estado: boolean) {
      UserResource.update(id, { estado: !estado }).then(() => {
        ElMessage({
          message: 'Estado actualizado exitosamente!',
          type: 'success'
        })
        this.getList()
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.usuarios-container {
  width: 100%;
  height: 100%;
}
.list-container {
  padding: 5px;
  height: 100%;
}
</style>
