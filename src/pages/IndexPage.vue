<template>
  <q-page class="flex flex-center">
    <h2 class="">Products</h2>

    <List />
  </q-page>
</template>

<script>
import List from 'src/components/products/List.vue'

export default {
  components: {
    List
  }
}
</script>
