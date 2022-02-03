<template>
  <div class="filter-container">
    <el-input
      v-if="selectProperty.filterable"
      v-model="keyword"
      class="filter-item"
      placeholder="palabra clave"
      size="mini"
      clearable
    />
    <el-select
      v-model="propertyKey"
      class="filter-item"
      placeholder="Campo donde buscar"
      size="mini"
      @change="searchProperty()"
    >
      <el-option
        v-for="property in properties"
        :key="property.key"
        :label="property.label"
        :value="property.key"
        :disabled="property.disabled"
      />
    </el-select>
    <el-select v-model="orderKey" class="filter-item" placeholder="ordenar" size="mini">
      <el-option v-for="order in orders" :key="order.key" :label="order.label" :value="order.key" />
    </el-select>
    <el-button type="primary" class="filter-item" :icon="Search" size="mini" :loading="loading" @click="onFilter()">
      Buscar / Refrescar
    </el-button>
    <div class="filter-item" style="width: fit-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { ObjTy } from '@/types/common'
import { defineComponent, PropType, reactive, toRefs, computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
enum TypeProperty {
  id = 'id',
  date = 'date',
  string = 'string',
  number = 'string'
}
interface Property {
  key: string
  label: string
  type?: TypeProperty
  disabled?: boolean
  filterable?: boolean
}
export default defineComponent({
  name: 'FilterResource',
  props: {
    listProperties: {
      type: Array as PropType<Array<Property>>,
      required: true
    },
    defaultProperty: {
      type: String,
      default: undefined
    }
  },
  emits: ['on-filter'],
  setup(props, ctx) {
    const state = reactive({
      orders: [
        { key: 'asc', label: 'Acendente' },
        { key: 'desc', label: 'Decendente' }
      ],
      keyword: '',
      propertyKey: props.defaultProperty || props.listProperties[0].key,
      orderKey: 'desc',
      loading: false
    })
    const { orders, keyword, propertyKey, orderKey, loading } = toRefs(state)
    const selectProperty = ref<Property | undefined>(undefined)
    const properties = computed(() => {
      return props.listProperties
    })
    const searchProperty = () => {
      selectProperty.value = properties.value.find((p) => {
        if (p.key === propertyKey.value) {
          return true
        } else {
          return false
        }
      })
      keyword.value = ''
    }
    const onFilter = () => {
      const where: ObjTy = {}
      if (keyword.value.length > 0) {
        where[propertyKey.value] = { like: keyword.value }
      }
      ctx.emit('on-filter', {
        order: `${propertyKey.value} ${orderKey.value}`,
        where: where
      })
    }

    searchProperty()
    onFilter()

    return {
      orders,
      keyword,
      propertyKey,
      selectProperty,
      orderKey,
      loading,
      properties,
      searchProperty,
      onFilter,
      Search
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-item {
  width: 150px;
  margin-right: 5px;
}
.filter-container {
  display: flex;
  padding-left: 10px;
  padding-top: 5px;
}
</style>
