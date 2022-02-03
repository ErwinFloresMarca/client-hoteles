<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Pagination'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [5, 10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])

let currentPage = computed({
  get: () => {
    return props.page
  },
  set: (val: number) => {
    emit('update:page', val)
  }
})
let pageSize = computed({
  get: () => {
    return props.limit
  },
  set: (val: number) => {
    emit('update:limit', val)
  }
})

let handleSizeChange = (val: number) => {
  emit('pagination', { page: currentPage, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
let handleCurrentChange = (val: number) => {
  emit('pagination', { page: val, limit: pageSize })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
