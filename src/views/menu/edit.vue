<template>
  <div class="menu-edit">
   <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/createOrEdit.vue'

export default {
  name: 'MenuEdit',
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
