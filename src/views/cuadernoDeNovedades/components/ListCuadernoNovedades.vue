import { ICuadernoDeNovedades } from '@/types/apiResources'
<template>
  <el-row :gutter="15">
    <el-col v-for="cuaderno in cuadernos" :key="cuaderno.id" :span="24" :sm="12" :md="8" :offset="0">
      <cuaderno-de-novedades :cuaderno="cuaderno" @change="onChange" />
    </el-col>
  </el-row>
</template>
<script lang="ts">
import { computed, PropType } from 'vue-demi'
import { ICuadernoDeNovedades } from '@/types/apiResources'
import CuadernoDeNovedades from './CuadernoDeNovedades.vue'
export default {
  components: { CuadernoDeNovedades },
  name: 'ListCuadernoNovedades',
  emits: ['change'],
  props: {
    list: {
      type: Array as PropType<Array<ICuadernoDeNovedades>>,
      default: () => []
    }
  },
  setup(props: any, ctx) {
    const cuadernos = computed(() => props.list)
    const onChange = () => {
      ctx.emit('change')
    }
    return {
      cuadernos,
      onChange
    }
  }
}
</script>
<style lang="scss"></style>
