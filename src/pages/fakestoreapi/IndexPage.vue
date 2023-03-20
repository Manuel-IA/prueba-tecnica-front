<template>
  <q-page class="flex flex-center">
    <h2 class="">fakestoreapi</h2>

    <q-card class="full-width" >
      <div class="q-pa-md">
        <q-table
          title="Fakestoreapi"
          :rows="rows"
          :columns="columns"
          :pagination="{ rowsPerPage: 0 }"
          row-key="name"
          grid
          hide-pagination
        >
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition" :style="props.selected ? 'transform: scale(0.90);' : ''" >
              <q-card v-ripple class="no-shadow cursor-pointer q-hoverable" square >
                <span class="q-focus-helper"></span>
                <q-card-section>
                  <q-card-section :class="cellStyles">
                    <b>brand</b><br/>
                    {{props.row.brand}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>category</b><br/>
                    {{props.row.category}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>description</b><br/>
                    {{props.row.description}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>discountPercentage</b><br/>
                    {{props.row.discountPercentage}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>id</b><br/>
                    {{props.row.id}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>price</b><br/>
                    {{props.row.price}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>rating</b><br/>
                    {{props.row.rating}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>stock</b><br/>
                    {{props.row.stock}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>thumbnail</b><br/>
                    {{props.row.thumbnail}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <b>title</b><br/>
                    {{props.row.title}}
                  </q-card-section>

                  <q-card-section :class="cellStyles">
                    <ImagesViewer :images="props.row.images" />
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import ImagesViewer from 'src/components/ImagesViewer.vue'

export default {
  components: {
    ImagesViewer
  },
  setup () {
    const columns = [
      { name: 'brand', label: 'brand', field: 'brand' },
      { name: 'category', label: 'category', field: 'category' },
      { name: 'description', label: 'description', field: 'description' },
      { name: 'discountPercentage', label: 'discountPercentage', field: 'discountPercentage' },
      { name: 'id', label: 'id', field: 'id' },
      { name: 'price', label: 'price', field: 'price' },
      { name: 'rating', label: 'rating', field: 'rating' },
      { name: 'stock', label: 'stock', field: 'stock' },
      { name: 'title', label: 'title', field: 'title' },
      { name: 'images', label: 'images', field: 'images' },
      { name: 'thumbnail', label: 'thumbnail', field: 'thumbnail' }
    ]

    return {
      columns,
      url: 'https://fakestoreapi.com/products'
    }
  },
  data () {
    return {
      rows: []
    }
  },
  computed: {
    cellStyles () {
      return 'col-xs-4 col-sm-5 col-md-3 q-ma-none'
    }
  },
  mounted () {
    this.$axios.get( this.url )
      .then( ( response ) => {
        const products = response.data.products
        this.rows = products
      } )
  }
}
</script>
