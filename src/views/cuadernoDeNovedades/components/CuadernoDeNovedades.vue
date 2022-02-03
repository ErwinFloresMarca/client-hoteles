<template>
  <el-card class="cuaderno-container" shadow="hover" :body-style="{ padding: '5px' }">
    <template #header>
      <div>
        <span>{{ cdn.user.nombreCompleto }}</span>
        <span style="float: right">
          <el-popover placement="top" trigger="hover">
            <time>
              {{
                new Date(cdn.fechaCreacion).toLocaleDateString('es-BO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  timeZoneName: 'long'
                })
              }}
            </time>
            <template #reference>
              <span>{{ formatTime(cdn.fechaCreacion, '{d}/{m}/{y}') }}</span>
            </template>
          </el-popover>
        </span>
      </div>
    </template>
    <novedad v-for="(n, i) in cdn.novedades" :key="i" v-model:novedad="cdn.novedades[i]" />
  </el-card>
</template>
<script lang="ts">
import { computed, PropType } from 'vue'
import { ICuadernoDeNovedades } from '@/types/apiResources'
import Novedad from './Novedad.vue'
export default {
  components: { Novedad },
  name: 'CuadernoDeNovedades',
  emits: ['update:cuaderno', 'change'],
  props: {
    cuaderno: {
      type: Object as PropType<ICuadernoDeNovedades>,
      required: true
    }
  },
  setup(props, { emit }) {
    const cdn = computed({
      get: () => props.cuaderno,
      set: (c: ICuadernoDeNovedades) => {
        emit('change', c)
        emit('update:cuaderno', c)
      }
    })
    return {
      cdn
    }
  }
}
</script>
<style lang="scss">
.cuaderno-container {
  width: 100%;
  margin: 10px;
}
</style>
