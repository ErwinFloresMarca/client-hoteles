<template>
  <div>
    <el-select
      v-model="selectEstado"
      placeholder="Seleccione un Estado"
      clearable
      filterable
      remote
      reserve-keyword
      :remote-method="onFilter"
      :size="size"
      :multiple="multiple"
      @change="onChange()"
    >
      <el-option v-for="estado in estados" :key="estado.id" :label="`${estado.descripcion}`" :value="estado.id" />
    </el-select>
  </div>
</template>

<script>
import { EstadoResource } from '@/api/estado'
export default {
  name: 'SelectEstado',
  props: {
    modelValue: {
      type: [String, Array],
      default: undefined
    },
    size: {
      type: String,
      default: 'medium'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      estados: [],
      selectEstado: undefined
    }
  },
  watch: {
    modelValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.selectEstado = newValue
      }
    }
  },
  created() {
    this.onFilter('')
  },
  methods: {
    onChange() {
      this.$emit('change', this.selectEstado)
      this.$emit('update:modelValue', this.selectEstado)
    },
    onFilter(kw) {
      EstadoResource.list({
        where: {
          descripcion: { like: kw }
        },
        order: ['descripcion asc'],
        limit: 15
      }).then((resp) => {
        this.estados = resp.data
      })
    }
  }
}
</script>

<style lang="scss">
.el-select {
  width: 100%;
}
</style>
