<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Virtual Shop
        </q-toolbar-title>

        <!-- Shopping Cart -->
        <Cart />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Cart from 'src/components/Cart.vue'

export default {
  components: {
    Cart
  },
  setup () {
    return {
    }
  }
}
</script>
