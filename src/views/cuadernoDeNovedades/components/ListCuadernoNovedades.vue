import { ICuadernoDeNovedades } from '@/types/apiResources'
<template>
  <div>
    <cuaderno-de-novedades v-for="cuaderno in cuadernos" :key="cuaderno.id" :cuaderno="cuaderno" @change="onChange" />
  </div>
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
