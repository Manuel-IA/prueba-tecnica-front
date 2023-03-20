<template>
  <q-page class="flex flex-center">
    <h2 class="">Dummyjson</h2>

    <q-card class="full-width" >
      <div class="q-pa-md">
        <q-table
          title="Dummyjson"
          :rows="rows"
          :columns="columns"
          v-model:pagination="tablePagination"
          :rows-per-page-options="tablePagination.rowsPerPageOptions"
          virtual-scroll
          row-key="name"
          grid
          :filter="filterOptions"
          :filter-method="myFilterMethod"
        >
          <!-- FILTERS -->
          <template v-slot:top-left="props">
            <div class="full-width q-pa-sm">
              Filters
            </div>

            <!-- Range -->
            <q-input class="q-px-sm" style="width: 20%" type="number" label="Min price" v-model="minOption" />
            <q-input class="q-px-sm" style="width: 20%" type="number" label="Max price" v-model="maxOption" />

            <!-- Order by -->
            <q-select
              class="q-px-sm"
              label="Order by"
              style="width: 25%;"
              v-model="filterOptions.orderBy"
              :options="filterOptions.options"
            />

            <!-- buttons -->
            <div class="full-width q-py-sm">
              <q-btn label="Apply" @click="applyFilters" />
              <q-btn label="Reset" @click="resetFilters" />
            </div>
          </template>

          <!-- Search Input -->
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filterOptions.wordToSearch" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- <template v-slot:top-right="props">
            records per page:
            <q-select
              borderless v-model="tablePagination.rowsPerPage"
              :options="tablePagination.rowsPerPageOptions"
            />

            on page: {{tablePagination.page}}

            <q-btn flat icon="chevron_left" @click="props.prevPage" />
            <q-btn flat icon="chevron_right" @click="props.nextPage" />
          </template> -->

          <template v-slot:item="props">
            <div :class="cardClasses" :style="props.selected ? 'transform: scale(0.90);' : ''" >
              <q-card bordered v-ripple class="cursor-pointer q-hoverable" square >
                <span class="q-focus-helper"></span>
                <q-card-section>
                  <q-card-section :class="cellStyles">
                    <b>Title</b><br/>
                    {{props.row.title}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Price</b><br/>
                    {{props.row.price}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Brand</b><br/>
                    {{props.row.brand}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Category</b><br/>
                    {{props.row.category}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Description</b><br/>
                    {{props.row.description}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Discount Percentage</b><br/>
                    {{props.row.discountPercentage}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>ID</b><br/>
                    {{props.row.id}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Rating</b><br/>
                    {{props.row.rating}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Stock</b><br/>
                    {{props.row.stock}}
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Thumbnail</b><br/>
                    <q-img :src="props.row.thumbnail" />
                  </q-card-section>

                  <q-separator />
                  <q-card-section :class="cellStyles">
                    <b>Images</b><br/>
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
import { Loading } from 'quasar'
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
      url: 'https://dragon.virtualshop.c66.me/v1/products'
    }
  },
  data () {
    return {
      tablePagination: {
        rowsPerPage: 10,
        rowsPerPageOptions: [ 5, 10, 15, 20 ]
      },
      filterOptions: {
        options: [ 'A-Z', 'Z-A', '1-100', '100-1' ],
        orderBy: null,
        wordToSearch: null,
        majorToMinor: false,
        min: null,
        max: null
      },
      minOption: null,
      maxOption: null,
      rows: []
    }
  },
  mounted () {
    Loading.show()
    this.$axios.get( this.url )
      .then( ( response ) => {
        let products = response.data

        // Sort array
        products = this.sortBy( products, 'a-z' )

        // Assign sorted array
        this.rows = products

        // Disable loading
        Loading.hide()
      } )
  },
  computed: {
    cellStyles () {
      return 'col-xs-4 col-sm-5 col-md-3 q-ma-none q-py-md'
    },
    cardClasses () {
      return 'q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-style-transition'
    }
  },
  methods: {
    applyFilters () {
      this.filterOptions.min = this.minOption
      this.filterOptions.max = this.maxOption
      this.filterOptions.majorToMinor = false
    },
    resetFilters () {
      this.filterOptions.majorToMinor = true
      this.filterOptions.wordToSearch = null
      this.filterOptions.orderBy = null
      this.filterOptions.min = null
      this.filterOptions.max = null
      this.minOption = null
      this.maxOption = null
    },
    myFilterMethod ( rows, terms, cols ) {
      // Search option
      const wordToSearch = this.filterOptions.wordToSearch

      // Order option
      const orderBy = this.filterOptions.orderBy

      // Range
      const min = parseFloat( this.filterOptions.min )
      const max = parseFloat( this.filterOptions.max )

      let newArr = [].concat(rows) // Copy original array

      console.log( wordToSearch )
      console.log( min )
      console.log( max )

      // Range Filter
      if ( min && max ) {
        newArr = rows.filter( ( element ) => (element.price >= min) && (element.price <= max) )
      }

      // Search input
      if ( wordToSearch ) {
        const search = wordToSearch.toLowerCase()

        newArr = newArr.filter( ( product ) => {
          return product.title.toLowerCase().includes( search )
        } )
      }

      // Sort by
      if ( orderBy ) {
        const sortBy = orderBy.toLowerCase()
        newArr = this.sortBy( newArr, sortBy )
      }

      // Reset button
      if ( this.filterOptions.majorToMinor ) {
        newArr = newArr.sort( ( product1, product2 ) => {
          return product2.price - product1.price // Mayor a menor
        } )
      }

      return newArr
    },
    sortBy ( arr, mode ) {
      let newArr = [].concat( arr ) // Copy original array

      // ABC
      if ( mode.includes( 'a' ) ) {
        newArr.sort( (a, b) => {
          let validation1 = ( mode == 'a-z' ) ? (a.title.toLowerCase() > b.title.toLowerCase()) : (a.title.toLowerCase() < b.title.toLowerCase())
          let validation2 = ( mode == 'a-z' ) ? (a.title.toLowerCase() < b.title.toLowerCase()) : (a.title.toLowerCase() > b.title.toLowerCase())

          if ( validation1 ) {
            return 1;
          }
          if ( validation2 ) {
            return -1;
          }
          return 0;
        } )
      }

      // Numeric
      if ( mode.includes( '1' ) ) {
        newArr.sort( ( product1, product2 ) => {
          let validation = ( mode == '1-100' ) ? (product1.price - product2.price) : (product2.price - product1.price)

          return( validation )
        } )
      }

      return( newArr )
    }
  }
}
</script>
