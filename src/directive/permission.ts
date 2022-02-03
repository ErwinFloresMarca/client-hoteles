import store from '@/store'

function checkPermission(el: any, binding: any) {
  const { value } = binding
  const role = store.state.user.role

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = permissionRoles.includes(role)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`necesita roles como v-permission="['admin','user']"`)
  }
}

//vue2和vue3中指令对比https://jishuin.proginn.com/p/763bfbd29cb7
export default {
  mounted(el: any, binding: any) {
    checkPermission(el, binding)
  },
  componentUpdated(el: any, binding: any) {
    checkPermission(el, binding)
  }
}
