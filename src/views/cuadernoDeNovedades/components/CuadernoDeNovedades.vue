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
    <novedad
      v-for="(n, i) in cdn.novedades"
      :key="i"
      v-model:novedad="cdn.novedades[i]"
      :editable="editable"
      @change="onChange"
      @delete="onDeleteNovedad(n, i)"
    />
    <el-button v-if="editable" style="width: 100%" type="success" size="mini" @click="onNewNovedad" :icon="Plus" />
  </el-card>
</template>
<script lang="ts">
import { computed, PropType } from 'vue'
import { ICuadernoDeNovedades, INovedad } from '@/types/apiResources'
import Novedad from './Novedad.vue'

import { Plus } from '@element-plus/icons-vue'
export default {
  components: { Novedad },
  name: 'CuadernoDeNovedades',
  emits: ['update:cuaderno', 'change'],
  props: {
    cuaderno: {
      type: Object as PropType<ICuadernoDeNovedades>,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
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
    const onNewNovedad = () => {
      cdn.value.novedades.push({ detalle: '', importancia: 'info', fechaHora: new Date().toISOString() })
      onChange
    }
    const onDeleteNovedad = (novedad: INovedad, index: number) => {
      cdn.value.novedades = cdn.value.novedades.filter((n, i) => i != index)
      onChange()
    }
    const onChange = () => {
      emit('change', cdn.value)
      emit('update:cuaderno', cdn.value)
    }
    return {
      cdn,
      onNewNovedad,
      onDeleteNovedad,
      onChange,
      Plus
    }
  }
}
</script>
<style lang="scss">
.cuaderno-container {
  width: 100%;
  margin: 5px;
}
</style>
